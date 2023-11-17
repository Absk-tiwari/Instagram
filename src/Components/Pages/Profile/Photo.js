import React, { useState } from 'react'

const Photo = (props) => {
    const params = props.params
    const [state, setState]= useState(false);
  return (
    <div className="col-md-4" key={params.index} onMouseOver={()=>setState(true)} style={{position:state &&'relative'}}  onMouseLeave={()=>setState(false)}>
        <img
            className="postImg"
            key={params.username}
            src={params.content}
            alt="not yet?"
            data-content={params.likes} 
        />
        <div className={`text-center ${!state && 'd-none'} hstack gap-2 text-white hovered`}> 
            <i className='fa fa-heart mb-3 fs-5'></i>
            <p >{params.likes}</p>
        </div>
    </div>
  )
}

export default Photo