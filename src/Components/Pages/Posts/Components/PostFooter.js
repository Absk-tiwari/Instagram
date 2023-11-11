import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PostFooter = (props) => {
    const {post} = props
    //console.log(post)
    const [like,reactPost] = useState(false);
    const [save,savePost] = useState(false);

  return (
    <>
    <div className='row'>
        <div className='col-sm-1'>
            <i className={`fa fa-heart${like?' animate':'-o'}`} style={{transition:'0.2s',fontSize: '22px',color:like?'red':''}} onClick={()=>{reactPost(!like)}} title={like?'Unlike':'Like'}></i>
        </div>
        <div className='col-sm-1'>
            <i className="fa fa-comment-o" title='comment' style={{fontSize:'24px'}}/>
        </div>
        <div className='col-sm-1'>
            <i className="fa fa-send-o" title='share post' style={{fontSize:'24px'}}/>
        </div>
        <div className='col-sm-8'></div>
        <div className='col-sm-1'>
            <i className={`fa fa-bookmark${save?'':'-o'}`} title={save?'Unsave':'Save'} onClick={()=>savePost(!save)} style={{fontSize:'24px'}}/>
        </div>
    </div>
     
        
    <p className='d-flex mt-2'>{post.likes} likes</p>
        
    
    <div className="row" style={{lineHeight:'4.2px'}}>
        <div className="col-md-12 mt-1 d-flex">
            <b><Link style={{textDecoration:'none',color:'black'}} to={'/profile?user='}>{post.username}</Link></b>&nbsp;<p> This is the truth &#128516;</p>
        </div> 
        <div className="col-md-12">
            <span className='text-secondary'>View all comments</span>
        </div>  
    </div>
    </>
  )
}

export default PostFooter