import React, { useContext } from 'react'
import PostHead from './Components/PostHead';
import PostContext from '../../../Contexts/Profiles/PostContext';
import PostFooter from './Components/PostFooter';


const Post = () => {
  const posts = useContext(PostContext);
  return (
    <>
    {posts.map((post)=>{
      return (
          <div className='col-md-8 card mt-5' key={post.username}>
            <div className='card-header profileHead'>
                <PostHead post={post}/>
            </div>
            <div className='card-body'>
                <img className='postContent' src={post.content} alt='not yet?'/>
            </div>
            <div className='card-footer'>
                <PostFooter post={{likes:post.likes,username:post.username}}/>
            </div>
        </div>
      )
    })}
    
    </>
  )
}

export default Post