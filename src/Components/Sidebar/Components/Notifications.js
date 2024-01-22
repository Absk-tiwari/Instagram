import React, { useState, useEffect } from 'react'
import { socket } from '../../../socket';
import headers from '../../../APIs/Headers';
import Button from '../../StateComponents/Button';
import logo from '../../../assets/logo.png'
const Notifications = () => {
  let [notifications,set] = useState([])
  const [ting , ring] = useState(false)
  socket.on('notification',data=>{
    console.log(data)
    set([...notifications, data])
    ring(true)
  })
 
  useEffect(() => { 
    if(ting===false){
      fetch('http://192.168.119.154:1901/api/notifications',{
        headers:headers()
      }).then(res=> {return res.json()}).then(data=>{
        set(data);
      })   
    }
  }, [ting]);
  console.log('notifications loaded',notifications)
  return (
    <>
    { notifications.map((item,index)=>{   
         return (<div className="notification" key={index} style={{height:"70px",backgroundColor:"#f8f8f8",borderRadius:'10px',width:'100%',display:'flex', marginTop:'5px',paddingTop:'4px'}}>
            <div className="hstack list-item gap-3">
              <img src={item.label??logo} alt="?" className="rounded-circle pfpicture mx-2" />
              <p className="text-dark text-wrap" style={{paddingTop:'13px'}} dangerouslySetInnerHTML={{ __html: item.message}} />
              <small className="text-secondary">2h</small>
              <Button text={'follow'} alt={'following'}/>
            </div>
          </div>)
    })}
    </>
  )
}

export default Notifications