import React, { useEffect , useState } from 'react'
import img from "../../../../assets/icons/itachi.jpg" ;
import {socket} from '../../../../socket'

function Chat(props) {
  const {me,username} = props    
  const [msg, setMessage] = useState('')
  const iconStyle ={
    fontSize:'25px',
    marginLeft:'40px',
    cursor:'pointer'
  }
  let messages = [];
  const addMessage = (from, content) => {
    !messages.some(msg=> msg.from=== from) && messages.push({from,content})
  }
  socket.on('receive',data=>{
    localStorage.setItem('cstring',data.connectionID)
    let from = data.from
    let content = data.content
    addMessage(from,content)
    showMessage(content)
  })
  const getChats = ()=>{//console.log(me+username)
  }
  const [isLoading, setLoading] = useState(false)
  const showMessage = (msg,other=true) => {
      let box = document.getElementById('container')
      let p = document.createElement('p')
      p.innerText = msg
      p.className = other ? 'other': 'self'
      box.appendChild(p)
  }
  useEffect(()=>{
    setLoading(true)
    socket.on('receive',data=>{
      let from = data.from
      let content = data.content
      addMessage(from,content)
      // alert('you have a message '+data.content)
      console.log(data)
    })
    getChats();
    setTimeout(()=>setLoading(false), 100);
  },[username])

  const sendMessage = event => {
    event.preventDefault()
    if(msg){
        let cstring = me+'_'+username
        let data = {to:username,content:msg, cID:cstring}
        socket.emit('send', data)
        setMessage('')
    }
    showMessage(msg,false)
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
            <section className='header' style={{backgroundColor:'aliceblue'}}>
                <div className='hstack'>
                    <div className='col-9 hstack'>
                        <div className='img-container mx-5 col-1'>
                            <img src={img} style={{height:'63px',width:'63px'}} className='rounded-circle' alt={username} />
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
            <section className='body' style={{height:'70vh'}}>
                {messages.length ? (<div className='spinner-container'>
                    <div style={{marginTop:'30vh', height:'100px'}}>
                      <p> Send a message to start the conversation</p>
                    </div>
                </div>):(
                  <div className='container' id='container'>
                    
                  </div>
                )}

            </section>
            <section className='footer mt-4'>
                <form className='hstack' onSubmit={sendMessage} style={{position:'relative'}}>
                    <input type='text' className='chat-input' name='message' value={msg} onChange={e=>{setMessage(e.target.value)}} />
                    <span style={{left:'3%',position:'absolute'}}><i className="fa-regular fs-3 fa-face-smile"></i></span>
                    <span style={{left:'84%',position:'absolute'}}><i className={`fa-regular ${msg.length?'d-none':''} fs-3 fa-image`}/></span>
                    <span style={{width:'88%', position:'absolute', fontSize:'large', left:'90%'}}><i className={`fa-solid fs-3 ${msg.length?'d-none':''} fa-paperclip`}></i></span>
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