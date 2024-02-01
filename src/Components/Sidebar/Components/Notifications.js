import React, { useState, useEffect } from 'react'
import { socket } from '../../../socket';
import headers from '../../../APIs/Headers';
import Button from '../../StateComponents/Button';
import logo from '../../../assets/icons/profile.png'
import ContextMenu from '../../StateComponents/ContextMenu';
const Notifications = (props) => {
  const [read] = useState(props.read)
  let [notifications,set] = useState([]) 
  const [count, setCount] = useState(0)
  const [ting , ring] = useState(false)
  const [contextMenu, setContext] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    items: [],
    c:''
  });

  const remove = _id => {
    console.log(_id)
    fetch('http://localhost:1901/api/notifications/delete',{
      headers:headers(),
      body:JSON.stringify({_id})
    }).then(res=>{
      return res.json()
    }).then(resp=>{
      if(resp.status){
        let temp = notifications
        temp = temp.filter(item=>item._id!==_id)
        set(temp)
        setCount(count-1)  
      }
    });
  }

  const onContext = event => { 
    console.log(event.target)
    let items = [ 
        {label:(<i className='fa fa-trash'></i>), class:'text-danger', onClick:()=>remove(event.target.dataset.id)}
      ]
    event.preventDefault()
    const x = event.clientX 
    const y = event.clientY 
    setContext({
      isVisible : true, 
      x, y ,
      items,
      c:'70px'
    })
  }

  useEffect(() => { 
  
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
   
    console.log('M I changing everytime u clicked?');
    document.addEventListener('click',function(){
      setContext({
        isVisible : false,  
      })
    })
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
    <ContextMenu {...contextMenu}  />
    {notifications.map((item,index)=>{   
      return (
      <div className={`notification ${item.read===true && 'read'}`}  data-id={item._id} key={index} onContextMenu={onContext} >
              <div className="hstack list-item gap-3" data-id={item._id}>
                <img src={item.label??logo} alt="?" className="rounded-circle pfpicture mx-2" data-id={item._id} />
                <p className="text-dark text-wrap notify-text" dangerouslySetInnerHTML={{ __html: item.message}} data-id={item._id} />
                <small data-id={item._id} className="text-secondary">2h</small>
                {(item.message).includes('following') && <Button data-id={item._id} text={'follow'} alt={'following'}/>}
              </div>
      </div>
      )})}
    </>
  )
}

export default Notifications