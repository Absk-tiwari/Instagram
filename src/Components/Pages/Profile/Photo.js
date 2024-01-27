import React, { useEffect, useState } from 'react'
import Modal from '../../Modal';
import ob from '../../../assets/icons/itachi.jpg'
import PostFooter from '../Posts/Components/PostFooter';
const Photo = (props) => {
    const post = props.post;
    const [open, setmodal] = useState(false);
    const [state, setState]= useState(false);
    const [src, setsrc]= useState(false);

    const toggleModal = (e) => {
      if(e.target.id==='modal' || e.target.classList.contains('postImg')) setmodal(!open)
    }
    const putContents = e => setsrc(e.target.currentSrc) 
    useEffect(()=>{},[]);

  return (
    <div className="col-md-4 openModal posts-of-logged-in-user" key={post.index} onMouseOver={()=>setState(true)} style={{position:state && 'relative'}}  onMouseLeave={()=>setState(false)}>
        <img className="postImg" key={post.username} onClick={(e)=>{setmodal(!open); putContents(e)}} src={post.content} alt="?" data-content={post.likes} />
        <div className={`text-center ${!state && 'd-none'} hstack gap-2 text-white hovered`}> 
            <i className='fa fa-heart mb-3 fs-5'></i>
            <p >{post.likes?post.likes.length:0}</p>
        </div>
        <Modal isOpen={open} dimens={{height:500 ,width:920 }} onClose={toggleModal}>
          <>
          <div className='container d-flex'>
            <div className='col-6' style={{position:'relative'}}>
              <img src={src} className='imgContainer' style={{ height:'-webkit-fill-available',maxHeight:'456px',marginRight:'24px', width:'-webkit-fill-available',objectFit:'contain'}} alt=''/>
            </div>
            <div className='col-6'>
              <div className='col-12 placeholder-glow mt-3 mx-2' style={{position:'relative'}}>
                <PostFooter post={post} alt={{details:false}} />
                <div className='row comments'>
                  <img src={ob} className='rounded-circle col-1' style={{height:'50px',width:'70px'}} alt='?'/>
                  <p className='col-8'><strong>User.name</strong><br/>Here is some commment; let's see if it wraps</p>
                  <small className='text-secondary'>2 days ago</small>
                </div>
                <hr/>
              </div>
              <div className="col-12 card-body mx-2">
                <p className="card-title placeholder-glow mb-3">
                  <span className="placeholder col-6"></span>
                </p>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-7"></span>
                  <span className="placeholder col-6"></span>
                  <span className="placeholder col-7"></span>
                  <span className="placeholder col-6"></span>
                  <span className="placeholder col-8"></span>
                </p>
                <p className="card-body placeholder-glow">
                  <span className='placeholder col-2'></span>
                  <span className='placeholder col-11'></span>
                  <span className='placeholder col-10'></span>
                  <span className='placeholder col-5'></span>
                </p>
              </div>
            </div>
          </div>
          </>
        </Modal>
    </div>
  )
}

export default Photo