import React  from 'react';
import PostUser from './PostUser';

const PostHead = (props) => { 
    
  return (
    <div className='row d-flex'>
        <PostUser post={props.post}/>
    </div>
  )
}

export default PostHead