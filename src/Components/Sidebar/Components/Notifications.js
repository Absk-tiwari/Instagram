import React, { useState, useEffect } from 'react'
import { socket } from '../../../socket';
import headers from '../../../APIs/Headers';
import Button from '../../StateComponents/Button';
import logo from '../../../assets/icons/profile.png'
const Notifications = (props) => {
  const [read] = useState(props.read)
  let [notifications,set] = useState([]) 
  const [count, setCount] = useState(0)
  const [ting , ring] = useState(false)
  
  socket.on('notification', data =>{
    let temp = notifications
    temp.unshift(data)
    set(temp)
    setCount(count+1)
    document.querySelector('.likenotif').classList.remove('d-none')
    document.querySelector('.number').innerHTML = count
    ring(!ting)
  })
  socket.on('unnotify', resp=>{
    let alt = notifications.filter(item=>{ return item.about !== resp.about })
    set(alt)
    setCount(count-1)
    ring(true)
  })
  socket.on('init',data=>console.log('connections',data))
 
  useEffect(() => { 
    console.log('M I changing everytime u clicked?');
    if(ting===false){
      fetch('http://localhost:1901/api/notifications',{
        headers:headers()
      }).then(res=> {return res.json()}).then(data=>{
        set(data);
        let count=0;
        if(data && data.length){
          for(let i of data){
            if(i.read===false){
              count++
            }
          }
        }
        let heart = document.querySelector('.likenotif')
        let point = document.querySelector('.arrived')
        if(count){
          heart.classList.remove('d-none')
          document.querySelector('.number').innerHTML = count
          point.classList.remove('d-none')
          setCount(count)
        }
        else{
          if(!heart.classList.contains('d-none') || !point.classList.contains('d-none')){
            heart.classList.add('d-none')
            point.classList.add('d-none')
          } 
        } 
      })   
    }else{
      document.querySelector('.number').innerHTML = count
    }
  }, [ting,count,read,props.read]);
  return (
    <>
    {notifications.map((item,index)=>{   
      return (
      <div className={`notification ${item.read===true && 'read'}`} key={index} >
              <div className="hstack list-item gap-3">
                <img src={item.label??logo} alt="?" className="rounded-circle pfpicture mx-2" />
                <p className="text-dark text-wrap notify-text" dangerouslySetInnerHTML={{ __html: item.message}} />
                <small className="text-secondary">2h</small>
                {(item.message).includes('following') && <Button text={'follow'} alt={'following'}/>}
              </div>
      </div>
      )})}
    </>
  )
}

export default Notifications