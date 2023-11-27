import React, { useEffect, useState } from 'react'

const Photo = (props) => {
    const params = props.params
    const [state, setState]= useState(false);
    useEffect(()=>{
      let posts = document.getElementsByClassName('posts-of-logged-in-user');
      for(let i=0; i < posts.length ; i++){
        posts[i].addEventListener('click',()=>{
            console.log(posts[i])
        })
      }
    })
  return (
    <div className="col-md-4 posts-of-logged-in-user" key={params.index} onMouseOver={()=>setState(true)} style={{position:state &&'relative'}}  onMouseLeave={()=>setState(false)}>
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