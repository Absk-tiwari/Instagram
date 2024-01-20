import React, {useContext, useEffect}  from "react";
import PostHead from "./Components/PostHead";
// eslint-disable-next-line
import PostContext from "../../../Contexts/Profiles/PostContext";
import PostFooter from "./Components/PostFooter";

const Post = () => {
 const {posts} = useContext(PostContext);
 useEffect(()=>{
  console.log('want posts ?',posts)
 },[])
  return (
    <>
      { posts && posts.length > 0 ? 
        posts.map( post => {
        return (
          <div className="col-md-8 post card mt-5" key={post.username}>
            <div className="card-header profileHead">
              <PostHead post={post} />
            </div>
            <div className="card-body">
              <img className="postContent" src={post.content} alt="." />
            </div>
            <div className="card-footer">
              <PostFooter
                post={{ likes: post.likes, username: post.username }} alt={{details:true}}
              />
            </div>
          </div>
        );
      })
      :  <> 
        <div className="col-md-8 post card mt-5" >
          <div className="card-body">
            <h5 className="card-title placeholder-glow">
              <span className="placeholder col-6" style={{height:'50px',width:'50px',borderRadius:'50%'}}/>&nbsp;
              <span className="placeholder col-6" style={{height:'20px'}}></span>
            </h5>
            <p className="card-text placeholder-glow">
              <span className="placeholder col-12" style={{height:'300px'}}></span>
            </p>
            <span className="placeholder placeholder-glow col-10"></span>
          </div>
        </div> 
        </>
      }
    </>
  );
};

export default Post;
