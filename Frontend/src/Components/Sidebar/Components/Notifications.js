import React, { useState, useEffect } from 'react'
import { socket } from '../../../socket';
import headers from '../../../APIs/Headers';
import Button from '../../StateComponents/Button';
import logo from '../../../assets/icons/profile.png'
import ContextMenu from '../../StateComponents/ContextMenu';
import {howLong} from '../../../helpers';
import { useNavigate } from 'react-router-dom';
const Notifications = (props) => {
  const navigator =	useNavigate()
  const [read] = useState(props.read)
  const [notifications,set] = useState([]) 
  const [count, setCount] = useState(0)
  const [ting , ring] = useState(false)
  const [contextMenu, setContext] = useState({isVisible: false,x: 0,y: 0,items: [],c:''})
  const redirect = event => {
	if(event.target?.dataset?.id){
		document.getElementById('notifications')?.classList?.remove('show')
		let item = document.getElementById(event.target.dataset.id);
		if(item){
			let username = item.dataset?.from
			let should = item.dataset?.s
			if(should) navigator(`/profile/${username}`)
		}
	}else{
		event.preventDefault()
	}
  }
  const remove = _id => {
    fetch('http://https://instagram-api-one.vercel.app//api/notifications/delete',{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({_id})
    })
	.then(r=>r.json())
	.then(resp=>{
      if(resp.status){
        let temp = notifications
        temp = temp.filter(item=>item._id!==_id)
        set(temp)
        setCount(count-1)  
      }
    });
  }

  const onContext = event => { 
    let hasClass = event.target.getAttribute('class')
    let elem
    if(!hasClass){
      elem = event.target.parentElement
    }else{
      elem = event.target
    }
    let _id = elem.dataset.id
    let items = [ 
        {label:(<div className={`d-flex`}><i className={`fa fa-trash mt-1 mx-1`}/><span className={'text-danger'}>Remove</span></div>), class:'text-danger', onClick:()=>remove(_id)}
      ]
    event.preventDefault()
    const x = event.clientX - 250
    const y = event.clientY 
    setContext({
      isVisible : true, 
      x, y ,
      items,
      c:'100px',
	  h:`50px`
    })
  }

  const rem = () => setContext({isVisible : false})

    useEffect(() => { 
    
      const notify = data =>{
        let temp = notifications
        temp.unshift(data)
        set(temp)
        setCount(count+1)
        document.querySelector('.likenotif').classList.remove('d-none')
        document.querySelector('.number').innerHTML = count
        ring(!ting)
      }

      socket.on('notification', notify)
      const remNotification = resp => {
        let alt = notifications.filter(item=>{ return item.about !== resp.about })
        set(alt)
        setCount(count-1)
        ring(true)
      }
      socket.on('unnotify', remNotification)
    document.addEventListener('click',rem)
    if(ting===false){
      fetch('http://https://instagram-api-one.vercel.app//api/notifications',{
        headers:headers()
      })
	  .then(r=> r.json())
	  .then(data=>{
        set(data);//console.log(data)
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
    return ()=> {
      document.removeEventListener('click',rem)
      socket.off('init',data=>console.log('connections',data))
      socket.off('unnotify', remNotification)
      socket.off('notification', notify)
    }
  }, [ting,count,read,props.read]);

  return (
    <>
    <ContextMenu {...contextMenu}  />
    {notifications.map((item,index)=>{   
      return (
      <div className={`notification ${item.read===true && 'read'}`}  data-id={item._id} key={index} onContextMenu={onContext} id={item._id} data-from={item.from} data-s={(item.message).includes('following')} onClick={redirect}>
			<div className="hstack list-item gap-3" data-id={item._id}>
			<img src={item.label??logo} alt="?" className="rounded-circle pfpicture mx-2" data-id={item._id} />
			<p className="text-dark text-wrap notify-text" dangerouslySetInnerHTML={{ __html: item.message}} data-id={item._id} />
			<small data-id={item._id} className="text-secondary"> {howLong(item.at)} </small>
			{(item.message).includes('following') && <Button data-id={item._id} text={`${item.custom?.follow?'follow':'following'}`} alt={`${item.custom?.follow?'following':'follow'}`}/>}
			</div>
      </div>
      )})}
    </>
  )
}

export default Notifications