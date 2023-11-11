import React  from 'react';
import UserPost from './UserPost';

const PostHead = (props) => { 
    
  return (
    <div className='row d-flex'>
        <UserPost post={props.post}/>
    </div>
  )
}

export default PostHead