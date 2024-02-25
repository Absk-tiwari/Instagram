import React, { useEffect , useState,useContext, useRef } from 'react'
import img from "../../../../assets/icons/profile.png" ;
import {socket} from '../../../../socket'
import ProfileContext from '../../../../Contexts/Profiles/ProfileContext';
import ContextMenu from '../../../StateComponents/ContextMenu';
import headers from '../../../../APIs/Headers';
import {randomStr} from '../../../../helpers'

function Chat(props) {
  const {me,username,launch,update,till,changeMsg,details} = props    
  const [parent,setParent] = useState(false) // reflection to parent
  const {updateChat} = useContext(ProfileContext) // for target user api
  const [chats, loadChats] = useState([]) // old chats
  const [msg, setMessage] = useState('') // typing message
  const [hasmsg, mark] = useState(false) // decide to initiate the convo
  const [loader, load] = useState(true) // loader false will show fetched msgs 
  const [contextMenu, setContext] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    items: [],
  });
  const box = useRef(null)
  const unsend = (from, _id) => {
    fetch('http://localhost:1901/api/messages/unsend',{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({_id,of:from})
    }).then(res=>{
      return res.json()
    }).then(resp=>{
      if(resp.status){
        document.querySelector('[data-id="'+_id+'"]').remove()
      }
    });
  }

  const remove = (me, _id) => {

    fetch('http://localhost:1901/api/messages/delete',{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({me,_id,username})
    }).then(res=>{
      return res.json()
    }).then(resp=>{
      if(resp.status){
        document.querySelector('[data-id="'+_id+'"]').remove()
      }
    })
  }
  const onContext = event => { 
    let items
    if(event.target.className==='other'){
      items = [
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
    const x = event.clientX - 100
    const y = event.clientY 
    setContext({
      isVisible : true, 
      x, y ,
      items
    })
  }

  const iconStyle ={
    fontSize:'25px',
    marginLeft:'40px',
    cursor:'pointer'
  }
   
  const OnKeyUp = event => {
    setMessage(event.target.value)
    let res = {is:me,to:username}
    socket.emit('typing', res)
  }
 
 
  const scrollToBottom = () => {
    setTimeout(() => {
      if (box.current) {
        box.current.scrollTop = box.current.scrollHeight;
      }
    },2500);
  };
  // eslint-disable-next-line
  const [isLoading, setLoading] = useState(false)
  const showMessage = (msg,id,other=true) => {
     let once = true
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
      }else{
        div.appendChild(p)
      }
      if(box.current && once){
        // console.log(box.current.children)
		const last = box.current.children.length
		console.log(last)
		mark(true)
        box.current.children[last-1].appendChild(div)
        document.getElementsByClassName('body')[0].scrollTop = document.getElementsByClassName('body')[0].scrollHeight
      }
  }
  
  useEffect(()=>{
    setLoading(true);
    document.addEventListener('click',function(){
      setContext({
        isVisible : false,  
      })
    })
    socket.on('putID',data =>{
      document.querySelector(`[id="${data.on}"]`).dataset.id = data.exact
    })
    const receive = data=>{
      let content = data.content
      showMessage(content,data._id)
      // loadChats([...chats,{content,_id:data._id}])
      let added = till
      added[username] = data.content
      added[username+'_seen'] = ' just now'
      changeMsg(added)
    }
    socket.on('receive', receive) 
 
    fetch('http://localhost:1901/api/messages/of',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({cID:me+'&'+username})
    }).then(res=>{
      return res.json()
    }).then(oldchats=>{
      if(oldchats && oldchats.length){
        loadChats(oldchats)
        mark(true)
      }
      load(false) 
      scrollToBottom()
      if(launch){
        updateChat(me,username)
      }
      setLoading(false)
    })
    setParent(!parent);
    return () => {
      document.removeEventListener('click',function(){
        setContext({
          isVisible : false,  
        })
      })
      loadChats([])
      socket.off('receive',receive)
    }
  },[username,launch,me])

  const sendMessage = event => {
    event.preventDefault()
    let createdID = randomStr(5)
    if(msg){
      let cstring = me+'&'+username
      let data = {from:me,to:username,content:msg, cID:cstring,putAt:createdID}
      socket.emit('send', data)
      setMessage('')
      let added = till
      added[username] = msg
      added[username+'_seen'] = ' sent just now'
      changeMsg(added)
    }
    showMessage(msg,createdID,false)
    setParent(!parent)
    if(update){ 
      update(parent)
    }
    if(launch){
      updateChat(me,username)
    }
  }

  return (
      <>
      <ContextMenu {...contextMenu} />
       {(
        <>
        <div className='container-fluid' style={{margin:0,padding:0,position:''}}>
            <section className='header' style={{backgroundColor:'#e9ecef'}}>
                <div className='hstack'>
                    <div className='col-9 hstack'>
                        <div className='img-container mx-5 col-1'>
                            <img src={details && details[0].profile?details[0].profile:img} style={{height:'63px',width:'63px'}} className='rounded-circle' alt={username} />
                        </div>
                        <div className='col-10' style={{paddingTop:'15px'}}>
                            <h3>{username}</h3>
                            <p>{props.name}</p>
                        </div>
                    </div>
                    <div className='col-3'>
                        <span className='fa fa-phone' style={iconStyle} title='call' />
                        <span className='fa fa-video-camera' title='video call' style={iconStyle}/> 
                        <span className='fa fa-ellipsis-v' title='options' style={iconStyle}/> 
                    </div>
                </div>
            </section>
            <section className='body' style={{height:'70vh'}} ref={box} >
              {!hasmsg && 
                (<div className='spinner-container'>
                    <div style={{marginTop:'30vh', height:'100px'}}>
                      <p> Send a message to start the conversation</p>
                    </div>
                </div>)}
				{loader && (<div className='spinner-container' style={{marginLeft:'45%',marginTop:'30%',display:'block'}}><div className='spinner' style={{height:'60px', width:'60px'}}/></div>)}

              <div className='container' id='container' >
                {chats && chats.length? chats.map((item, index)=>{ 
                  return (item.from===me?
                      (<div key={index} style={{display:'block'}}>
                        <p data-from={item.from===me?me:username} className={'self'} data-id={item._id} onContextMenu={onContext} >{item.content}</p>
                      </div>):
                      (<div style={{display:'block'}} key={index}><div className={'hstack otherDiv'} ><img className={'img-rounded inchat'} src={details && details[0].profile?details[0].profile:img} alt={''} /><p className={'other'} data-id={item._id} onContextMenu={onContext}>{item.content}</p></div></div>)) 
                }) :''}
              </div>

            </section>
            <section className='footer mt-4'>
                <form className='hstack' onSubmit={sendMessage} style={{position:'relative'}}>
                    <input type='text' className='chat-input' name='message' value={msg} onChange={OnKeyUp} onBlur={()=>socket.emit('stopped',{is:me,to:username})} />
                    <span style={{left:'3%',position:'absolute'}}>
                      <i className="fa-regular fs-3 fa-face-smile"/>
                    </span>
                    <span style={{left:'84%',position:'absolute'}}>
                      <i className={`fa-regular ${msg.length?'d-none':''} fs-3 fa-image`}/>
                    </span>
                    <span style={{width:'88%', position:'absolute', fontSize:'large', left:'90%'}}>
                      <i className={`fa-solid fs-3 ${msg.length?'d-none':''} fa-paperclip`}/>
                    </span>
                    <span type='submit' className={`text-primary ${msg.length?'':'d-none'} fs-5 fw-bold`} style={{width:'90%', marginLeft:'15px',position:'absolute', left:'85%',fontFamily:'monospace'}} > Send </span>
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