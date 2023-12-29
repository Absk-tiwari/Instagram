import React, { useEffect , useState } from 'react'
import img from "../../../../assets/icons/itachi.jpg" ;


function Chat(props) {
  const {username} = props    
  
  const iconStyle ={
    fontSize:'25px',
    marginLeft:'40px',
    cursor:'pointer'
  }

  const getChats = ()=>{}
  const [isLoading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    getChats();
    setTimeout(() => {
        setLoading(false)
    }, 100);
  },[username])

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
                            <p>te.sting8398</p>
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
                <div className='spinner-container'>
                    <div className='spinner' style={{marginTop:'30vh', height:'100px', width:'100px'}}></div>
                </div>
            </section>
            <section className='footer mt-5'>
                <div className='hstack' style={{position:'relative'}}>
                    <input type='text' className='chat-input'/>
                    <span style={{left:'3%',position:'absolute'}}><i class="fa-regular fs-3 fa-face-smile"></i></span>
                    <span style={{left:'86%',position:'absolute'}}><i class="fa-regular fs-3 fa-image"/></span>
                    <span style={{width:'88%', position:'absolute', fontSize:'large', left:'90%'}}><i className="fa-solid fs-3 fa-paperclip"></i></span>
                    <span className='text-primary fs-5 d-none fw-bold' style={{width:'90%', marginLeft:'15px',position:'absolute', left:'88%',fontFamily:'monospace'}} > Send </span>
                </div>
            </section>
        </div>
        </>
        )
     }
    </>
  )
}

export default Chat