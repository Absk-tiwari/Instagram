import React, { useEffect, useState } from 'react';
import obito from '../../../assets/icons/obito.jpg'
import video from '../../../assets/goals.mp4'
import PostFooter from '../../Pages/Posts/Components/PostFooter';
import { useNavigate } from 'react-router-dom';
const Reels = () => {
  let navigator = useNavigate()
  const icon = {color:'white',fontSize:'30px', height:'40px', marginTop:'8px', fontWeight:'600'}
  useEffect(()=>{
    let vids = document.getElementsByTagName('video')
    for(let i=0; i<vids.length; i++){
      vids[i].addEventListener('dblclick', e=>{  e.preventDefault()
        const like = document.querySelector('.fa-regular')
        if(like){
          like.click()
        }
        
      })
    }
  },[])
  const [like, reactPost] = useState(false);
  const [sound, setsound] = useState(true)
  const add = e => {
    setsound(!sound)
    e.target.muted = sound;
  }
  return (
    <>
      <div className={`col-md-6 reelDiv ${window.screen.width > 500?'rel':''}`}>
        <div className='bg-secondary' onClick={()=>navigator(-1)} style={{zIndex:window.screen.width < 500? 2000:''}}>
        <video height={650} onClick={add} autoPlay="autoplay" loop>
          <source src={video} type="video/ogg"/>
        </video>
        <div className={'d-flex abs'} style={{flexDirection:'column'}}>
          <i className={`fa-solid fa-arrow-left`} style={{top:'30px',position:'fixed',left:'30px',color:'white'}}/> 
          <i className={`${like ? ' fa':'fa-regular'} fa-heart${like ? ' animate':''}`} style={{transition: "0.2s",fontSize: "25px",
          color: like ?'red':'white'}} onClick={() =>reactPost(!like)}></i>
          <p className='text-white px-1'>34</p>
          <svg aria-label="Comment" className="_8-yf5 " style={icon} color="white" fill="white" 
           height="22" role="img" viewBox="0 0 48 48" width="24"> 
            <path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1  
                  2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11  
                  47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2  
                  1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2  
                  1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8  
                  1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7  
                  3.5 24 3.5 44.5 12.7 44.5 24z" 
             fillRule="evenodd"/> 
           </svg>
           <p className='text-white px-2'>8</p>
           <svg aria-label="Share Post" style={icon} color="white" fill="white" 
              height="22" role="img" viewBox="0 0 48 48" width="24"> 
              <path
                  d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9  
                  3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5  
                  22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3  
                  1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2  
                  6.1h35.5L18 18.7 5.2 6.1zm18.7  
                  33.6l-4.4-18.4L42.4 8.6 23.9 39.7z" /> 
            </svg> 
            <p className='text-white px-2'>3</p>
        </div>
        <div className='account d-flex'>
          <img src={obito} className='rounded-circle' style={{height:'50px',width:'50px'}} alt='?' />
		  <small className={'text-white uname'} >Obito.uchiha</small>
          <button className='btn text-white btn-round mt-2 mx-3 bg-transparent btn-sm' style={{height:'29px', border:'1px solid white'}}>follow</button>
        </div>
        </div>
      </div>
      <div className='col-md-4 reelParallel'>
		<div className={`col-auto mx-3 mt-4`}>
	 		<PostFooter post={{likes:['max_avnish']}} alt={{details:true}} c={false}/> 
		</div>
      </div>
    </>
  )
}

export default Reels
