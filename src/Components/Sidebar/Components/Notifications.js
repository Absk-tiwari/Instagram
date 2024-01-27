import React, { useState, useEffect } from 'react'
import { socket } from '../../../socket';
import headers from '../../../APIs/Headers';
import Button from '../../StateComponents/Button';
import logo from '../../../assets/logo.png'
const Notifications = () => {
  let [notifications,set] = useState([])
  const [ting , ring] = useState(false)
  socket.on('notification', data =>{
    set([...notifications, data])
    ring(!ting)
  })
  socket.on('unnotify', resp=>{
    let alt = notifications.filter(item=>{ return item.about !== resp.about })
    set(alt)
    ring(true)
  })
  socket.on('init',data=>console.log('connections',data))
 
  useEffect(() => { 
    if(ting===false){
      fetch('http://localhost:1901/api/notifications',{
        headers:headers()
      }).then(res=> {return res.json()}).then(data=>{
        set(data);
      })   
    }
  }, [ting]);
  return (
    <>
    {notifications.length && notifications.map((item,index)=>{   
      return (
      <div className="notification" key={index} >
              <div className="hstack list-item gap-3">
                <img src={item.label??logo} alt="?" className="rounded-circle pfpicture mx-2" />
                <p className="text-dark text-wrap notify-text" dangerouslySetInnerHTML={{ __html: item.message}} />
                <small className="text-secondary">2h</small>
                <Button text={'follow'} alt={'following'}/>
              </div>
      </div>
      )})}
    </>
  )
}

export default Notifications