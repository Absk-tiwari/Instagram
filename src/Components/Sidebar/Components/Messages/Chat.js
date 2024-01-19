import React, { useEffect , useState,useContext, useRef } from 'react'
import img from "../../../../assets/icons/profile.png" ;
import {socket} from '../../../../socket'
import ProfileContext from '../../../../Contexts/Profiles/ProfileContext';

function Chat(props) {
  const {me,username,launch,update,details} = props   
  const [parent,setParent] = useState(false)
  const {updateChat,getChatsOf} = useContext(ProfileContext)    
  const [msg, setMessage] = useState('')
  const [hasmsg, mark] = useState(false)
  const [loader, load] = useState(true)
  const box = useRef(null)
  const iconStyle ={
    fontSize:'25px',
    marginLeft:'40px',
    cursor:'pointer'
  }
   

  const getChats = async() => {
    let oldchats = await getChatsOf(me+'&'+username)
    if(oldchats && oldchats.length){
      mark(true)
      setLoading(true)
      printMessage(oldchats)
    }
  }
  const printMessage = msgArr => {
    let html=''
    msgArr.forEach(item=> { 
        html+= `<div style='display:block'><p class='${item.from===me?'self':'other'}'>${item.content}</p></div>`
    })
    setTimeout(() => {
      load(false);
      if(box.current){
        box.current.innerHTML = html
        document.getElementsByClassName('body')[0].scrollTop = document.getElementsByClassName('body')[0].scrollHeight
        if(launch){
          updateChat(me,username)
        }
      }
    },2500);
  }
  const [isLoading, setLoading] = useState(false)
  const showMessage = (msg,other=true) => {
     
      let div = document.createElement('div')
      div.style.display='block'
      let p = document.createElement('p')
      p.innerText = msg
      p.className = other ? 'other': 'self'
      div.appendChild(p)
      if(box.current ){
        box.current.appendChild(div)
        document.getElementsByClassName('body')[0].scrollTop = document.getElementsByClassName('body')[0].scrollHeight
      }
      // setTimeout(() => , 2400);      
  }
  socket.on('receive',data=>{
    let content = data.content
    showMessage(content)
    // alert('you have a message '+data.content)
  })
  
  useEffect(()=>{
    setLoading(true);
    mark(false);
    getChats().then(()=>setLoading(false));
    setParent(!parent)
  },[username])

  const sendMessage = event => {
    event.preventDefault()
    if(msg){
      let cstring = me+'&'+username
      let data = {from:me,to:username,content:msg, cID:cstring}
      socket.emit('send', data)
      setMessage('')
    }
    showMessage(msg,false)
    setParent(!parent)
    update(parent)
    if(launch){
      updateChat(me,username)
    }
  }

  return (
      <>
      { isLoading===true ?
        <div className="col-12 card-body mx-2">
                <p className="card-title placeholder-glow mb-5 mt-5 mx-5 d-flex" >
                <span className="placeholder col-6" style={{height:'40px'}}></span>
                <span className="placeholder col-1 offset-2"></span>
                <span className="placeholder offset-1 col-1"></span>
            </p>
            <p className="card-text placeholder-glow mt-4 mx-5">
                <span className="placeholder mt-4 col-7"></span>
                <span className="placeholder mt-5 col-6"></span>
            </p>
            <p className="card-body placeholder-glow mx-5">
              <span className='placeholder col-5'></span>
            </p>
        </div>        
     : (
        <>
        <div className='container-fluid' style={{margin:0,padding:0,position:''}}>
            <section className='header' style={{backgroundColor:'#e9ecef'}}>
                <div className='hstack'>
                    <div className='col-9 hstack'>
                        <div className='img-container mx-5 col-1'>
                            <img src={details.profile??img} style={{height:'63px',width:'63px'}} className='rounded-circle' alt={username} />
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
            <section className='body' style={{height:'70vh'}}  >
              {!hasmsg ? 
                (<div className='spinner-container'>
                    <div style={{marginTop:'30vh', height:'100px'}}>
                      <p> Send a message to start the conversation</p>
                    </div>
                </div>):loader && <div className='spinner-container' style={{marginLeft:'45%',marginTop:'30%',display:'block'}}>
                      <div className='spinner' style={{height:'60px', width:'60px'}}/></div>}
              <div className='container' id='container' ref={box}/>

            </section>
            <section className='footer mt-4'>
                <form className='hstack' onSubmit={sendMessage} style={{position:'relative'}}>
                    <input type='text' className='chat-input' name='message' value={msg} onChange={e=>{setMessage(e.target.value)}} />
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