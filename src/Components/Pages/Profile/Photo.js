import React, { useEffect, useState } from 'react'
import Modal from '../../Modal';

const Photo = (props) => {
    const params = props.params;
    const [open, setmodal] = useState(false);
    const [state, setState]= useState(false);
    const toggleModal = (e) => {
      if(e.target.id==='modal' || e.target.classList.contains('postImg')) setmodal(!open)
 
    }
    const putContents = e => {
      // document.querySelector('.imgContainer').setAttribute('src', e.target.getAttribute('src'))
    }

    useEffect(()=>{ console.log('chala ai?') },[]);

  return (
    <div className="col-md-4 openModal posts-of-logged-in-user" key={params.index} onMouseOver={()=>setState(true)} style={{position:state &&'relative'}}  onMouseLeave={()=>setState(false)}>
        <img className="postImg" key={params.username} onClick={(e)=>{setmodal(!open); putContents(e)}} src={params.content} alt="not yet?"
            data-content={params.likes} />
        <div className={`text-center ${!state && 'd-none'} hstack gap-2 text-white hovered`}> 
            <i className='fa fa-heart mb-3 fs-5'></i>
            <p >{params.likes}</p>
        </div>
        <Modal isOpen={open} dimens={{height:500 ,width:920 }} onClose={toggleModal}>
          <>
          <div className='container d-flex'>
            <div className='col-6'>
              <img src={''} className='imgContainer' alt='?'/>
              <p className='text-center'>Hello would you work ?</p>
            </div>
            <div className='col-6'>
              <div className='col-12 placeholder-glow mt-3 mx-2'>
                <p className='placeholder col-4'></p>
                <p className='placeholder col-10'></p>
                <p className='placeholder col-2'></p>
              </div>
              <div className="col-12 card-body mx-2">
                <p className="card-title placeholder-glow mb-3">
                  <span className="placeholder col-6"></span>
                </p>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-7"></span>
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-6"></span>
                  <span className="placeholder col-8"></span>
                </p>
                <p className="card-body placeholder-glow">
                  <span className='placeholder col-2'></span>
                  <span className='placeholder col-9'></span>
                  <span className='placeholder col-8'></span>
                  <span className='placeholder col-10'></span>
                  <span className='placeholder col-5'></span>
                  <span className='placeholder col-8'></span>
                  <span className='placeholder col-5'></span>
                  <span className='placeholder col-9'></span>
                  <span className='placeholder col-4'></span>
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