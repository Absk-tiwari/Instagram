import React, { useEffect , useState,useContext, useRef } from 'react'
import img from "../../../../assets/icons/profile.png" ;
import {socket} from '../../../../socket'
import ProfileContext from '../../../../Contexts/Profiles/ProfileContext';
import ContextMenu from '../../../StateComponents/ContextMenu';
import headers from '../../../../APIs/Headers';
import {howLong, randomStr} from '../../../../helpers'

function Chat(props) {
  const {me,username,launch,update,till,changeMsg,details} = props    
  const [parent,setParent] = useState(false) // reflection to parent
  const {updateChat} = useContext(ProfileContext) // for target user api
  const [chats, loadChats] = useState([]) // old chats
  const [msg, setMessage] = useState('') // typing indicator
  const [hasmsg, AvailMessage] = useState(false) // decide to initiate the convo
  const [loader, load] = useState(true) // loader false will show fetched msgs 
  const [contextMenu, setContext] = useState({ isVisible: false, x: 0,y: 0,items: []})
  const box = useRef(null) // its child has all you need
  const file = useRef(null) // its child has all you need
  const [theme,setTheme] = useState('')
  const [chosen, choose] = useState('')
  const unsend = (from, _id) => {   // handle un-sending message
    fetch('https://instagram-vquy.onrender.com/api/messages/unsend',{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({_id,of:from})
    }).then(r=>r.json()).then(res=>{
      	if(res.status) document.querySelector('[data-id="'+_id+'"]').remove() 
    });
  }

  const uploadFile = event => {
	file.current?.click()
  }

  const remove = (me, _id) => {   // handle delete message
    fetch('https://instagram-vquy.onrender.com/api/messages/delete',{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({me,_id,username})
    }).then(r=> r.json()).then(res=>{
      	if(res.status) document.querySelector('[data-id="'+_id+'"]').remove()
    })
  }
  const onContext = event => {  // add items to context-menu
    let items
    if(event.target.className==='other'){
      items=[
        {label:'Copy', onClick:()=>console.log('tried to copy')},
        {label:'Delete', onClick:()=>remove(event.target.dataset.from, event.target.dataset.id)}
      ]
    }else{
      items = [
        {label:'Copy', onClick:()=>console.log('tried to copy')},
        {label:'Unsend', class:'text-danger', onClick:()=>unsend(event.target.dataset.from, event.target.dataset.id)}
      ]
    }
    event.preventDefault()
    const x = event.clientX-700
    const y = event.clientY 
    setContext({isVisible : true, x, y , items})
  }      // items are added to context menu

   
  const OnKeyUp = event => {  // signal typing... 
    setMessage(event.target.value)
    let res= {is:me,to:username}
    socket.emit('typing', res)
  }
 
 
  const scrollToBottom = time => {
    setTimeout(() => {
      if (box.current) box.current.scrollTop = box.current.scrollHeight;
    },time);
  };
  // eslint-disable-next-line
  const [isLoading, setLoading] = useState(false)

  const showMessage = (msg,id,other=true) => {    // let the message be printed
      let div = document.createElement('div')
      div.style.display='block'
      let p = document.createElement('p')
      p.innerText = msg
      p.dataset.id = id
      p.id = id
      p.className = other ? 'other': 'self'
      p.addEventListener('contextmenu', onContext)
      if(other){
        let hDiv = document.createElement('div')
        hDiv.classList.add('hstack')
        hDiv.classList.add('otherDiv')
        let imgElem = document.createElement('img')
        imgElem.src= details[0].profile?? img;
        imgElem.classList.add('img-rounded')
        imgElem.classList.add('inchat')
        hDiv.appendChild(imgElem) 
        hDiv.appendChild(p)
        div.appendChild(hDiv)
      }else div.appendChild(p) 

      if(box.current){
		const last = box.current.children.length
		AvailMessage(true) // it had messages
        box.current.children[last-1].appendChild(div)
        scrollToBottom(0)
      }
  }    // messages has been printed
  
  const sendImage = src =>{
	 let img = document.createElement('img')
	 img.src= src
	 img.className=`selfImage`
	 let createdID = randomStr(5) 
	 img.dataset.id = createdID
	 img.id = createdID
	 let cstring = me+'&'+username
	 let data = {from:me,to:username,content:src, cID:cstring,putAt:createdID,changeMsg:me,replaceMsg:msg}
	 
	 let added = till 
	 added[username+'_last'] = 'Photo'
	 added[username+'_seen'] = ' sent just now'
	 let newMsg
	 if(added[username]){
	   let prev = added[username]
	   if(prev.includes('message')){
		   let prev = added[username].split(' ')
		   prev=prev[0]
		   newMsg = `${parseInt(prev)+1} new messages`
	   }else{
		   newMsg = `2 new messages`
	   }  
	   data.replaceMsg =added[username]= newMsg 		
	 }  
	 changeMsg(added)
	 socket.emit('send', data)
	  if(box.current){
		const last = box.current.children.length
        box.current.children[last-1].appendChild(img)
        scrollToBottom(0)
      }
  }

  const sendMessage = event => {
    event.preventDefault()
    let createdID = randomStr(5) // helper function
    if(msg){
      let cstring = me+'&'+username
      let data = {from:me,to:username,content:msg, cID:cstring,putAt:createdID,changeMsg:me,replaceMsg:msg}
      setMessage('')
      let added = till 
      added[username+'_last'] = msg
      added[username+'_seen'] = ' sent just now'
	  let newMsg
	  if(added[username]){
		let prev = added[username]
		if(prev.includes('message')){
			let prev = added[username].split(' ')
			prev=prev[0]
			newMsg = `${parseInt(prev)+1} new messages`
		}else{
			newMsg = `2 new messages`
		}  
		data.replaceMsg =added[username]= newMsg 		
      }  
      changeMsg(added)
	  socket.emit('send', data)
    }
    showMessage(msg,createdID,false)
    setParent(!parent)
    if(update) update(parent)
	if(launch) updateChat(me,username) // seen text for you ? must be updated
  }
  useEffect(()=>{
    setLoading(true);
    document.addEventListener('click',()=>{ setContext({isVisible : false}) })
    socket.on('putID', data => document.querySelector(`[id="${data.on}"]`).dataset.id = data.exact )
    const receive = data=>{
      let content = data.content
      showMessage(content,data._id)
      let added = till
      added[username] = data.content
      added[username+'_seen'] = ' just now'
      changeMsg(added)
    }
    socket.on('receive', receive)  // handle 
 
    fetch('https://instagram-vquy.onrender.com/api/messages/of',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({cID:me+'&'+username})
    }).then(res=> res.json()).then(oldchats=>{
      if(oldchats && oldchats.length){
        loadChats(oldchats)
        AvailMessage(true)
      }
      load(false) 
      scrollToBottom(1500)
      if(launch) updateChat(me,username) // was a text for u ? update it
      setLoading(false)
    })
	let ImgElem = file.current
	ImgElem.addEventListener('change', e =>{
		let blob = e.target.files[0]
		var fileReader = new FileReader()
		fileReader.onload = function (e) {
		  sendImage(e.target.result)
		}
		fileReader.readAsDataURL(blob)
	})
    setParent(!parent);
    return () => {
	  ImgElem.removeEventListener('change',e=>{
		let blob = e.target.files[0]
		var fileReader = new FileReader()
		 
		fileReader.onload = function (e) {
		  sendImage(e.target.result)
		}
		fileReader.readAsDataURL(blob); 
	})
      document.removeEventListener('click', ()=> setContext({isVisible : false}))
      loadChats([])
      socket.off('receive',receive)
    }
  },[username,launch,me])

  const checkTheme = () => {
	setTheme(chosen)
  }

  return (
      <>
      <ContextMenu {...contextMenu} />
       {(
        <>
        <div className={`container-fluid ${theme}`} style={{margin:0,padding:0,position:'',height:`100vh`}}>
            <section className='header' style={{backgroundColor:'#e9ecef'}}>
                <div className='hstack'>
                    <div className='col-9 hstack'>
                        <div className='img-container mx-5 col-1'>
                            <img src={details && (details[0].profile??img)} style={{height:'63px',width:'63px'}} className='pfpicture' alt={username} />
                        </div>
                        <div className='col-10' style={{paddingTop:'15px'}}>
                            <h3>{username}</h3>
							{details[0].active?
							<p> Active {details.onlines.includes(username)? 'now' 
							:`${howLong(details[0].active)} ago`}</p>
							: <p>{username}</p>
							}
                        </div>
                    </div>
                    <div className='col-3 rel dropdown d-flex'>
                        <span className='fa fa-phone iconStyle' title='call' />
                        <span className='fa fa-video-camera iconStyle' title='video call'/> 
                        <span className='fa fa-ellipsis-v iconStyle dropdown' data-bs-toggle={`dropdown`} title='options'/> 
                        <ul className={`dropdown-menu`}>
                          <h5 className={'mx-4'} > Wallpaper </h5>
                          <li>
                            <span className={`dropdown-item px-4`}
                            onMouseEnter={()=>setTheme('morning')} 
                            onMouseLeave={checkTheme}
                            onClick={()=>choose('morning')} >
                              Morning 
                            </span>
                          </li>
                          <li>
                            <span className={`dropdown-item px-4`}
                              onMouseEnter={()=>setTheme('evening')} 
                              onMouseLeave={checkTheme}
                              onClick={()=>choose('evening')} >
                              Evening
                            </span>
                          </li>
                          <li>
                            <span className={`dropdown-item px-4`}
                              onMouseEnter={()=>setTheme('dust')} 
                              onMouseLeave={checkTheme}
                              onClick={()=>choose('dust')} >
                              Dust
                            </span>
                          </li>
                          <li>
                            <span className={`dropdown-item px-4`}
                              onMouseEnter={()=>setTheme('dark')} 
                              onMouseLeave={checkTheme}
                              onClick={()=>choose('dark')} >
                              Dark
                            </span>
                          </li>
                          <li>
                            <span className={`dropdown-item px-4`} onMouseEnter={()=>setTheme('')} 
                              onMouseLeave={checkTheme}
                              onClick={()=>choose('')} >
                              None 
                            </span>
                          </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className={`body`} style={{height:'70vh'}} ref={box} >
              {!hasmsg && 
                (<div className='spinner-container'>
                    <div style={{marginTop:'30vh', height:'100px'}}>
                      <p> Send a message to start the conversation</p>
                    </div>
                </div>)}
				{loader && (<div className='spinner-container d-block' style={{marginLeft:'45%',marginTop:'30%'}}><div className='spinner' style={{height:'60px', width:'60px'}}/></div>)}

              <div className='container' id='container'>
                {chats && chats.map((item, index)=>{ 
                  return (item.from===me?
                      (<div key={index} className={`d-block`}>
						{item.content.length>10000?
						<img src={item.content} className={`selfImage`} alt={``} data-id={item._id} onContextMenu={onContext} />:
						<p data-from={item.from===me?me:username} className='self' data-id={item._id} onContextMenu={onContext} >{item.content}</p>}
                        
						{index===chats.length-1 && item.read ? <small className={'readStat'}>seen</small> :''}
                      </div>):
                       (<div className='d-block' key={index}>
							<div className='hstack otherDiv'>
								<img className={`img-rounded inchat`} src={details && (details[0].profile??img)} alt={''} />
								{item.content?.length>10000?
								<img src={item.content} className={`otherImage`} data-id={item._id} alt={``} onContextMenu={onContext}/>
								:<p className='other' data-id={item._id} onContextMenu={onContext}>{item.content}</p>}
							</div>
						</div>)) 
                })}
              </div>

            </section>
            <section className='footer mt-4'>
                <form className='hstack rel' onSubmit={sendMessage} >
                    <input type='text' className='chat-input' name='message' value={msg} onChange={OnKeyUp} autoComplete='off' onBlur={()=>socket.emit('stopped',{is:me,to:username})} />
                    <span style={{left:'3%',position:'absolute'}}>
                      <i className="fa-regular fs-3 fa-face-smile"/>
                    </span>
                    <span style={{left:'88%',position:'absolute'}} onClick={uploadFile}>
                      <i className={`fa-regular ${msg.length?'d-none':''} fs-3 fa-image`}/>
                    </span>
					<input className='d-none' type='file' name='sendImage' ref={file}/>
                    <span type='submit' className={`text-primary abs ${msg.length?'':'d-none'} fs-5 fw-bold`} style={{width:'90%', marginLeft:'15px', left:'85%',fontFamily:'monospace'}} > Send </span>
                </form>
            </section>
        </div>
        </>
        )
     }
    </>
  )
}

export default Chat