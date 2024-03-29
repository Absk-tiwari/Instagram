import React from "react";
import PostContext from "../../Contexts/Profiles/PostContext";
 
import headers from "../../APIs/Headers";

const PostState = (props) => {
    
    const createPost = async(obj) => {
      let resp = await fetch(`http://localhost:1901/api/post/create`,{
        method:'POST',
        headers:headers(),
        body:JSON.stringify(obj)
      })
      if(resp.status){
        let till = localStorage.getItem('myPosts')
        till = JSON.parse(till)
        till.push(resp.post)
        localStorage.setItem('myPosts',JSON.stringify(till))
        return true
      }
      return false

     }

  return (
    <>
      <PostContext.Provider value={{createPost}}>
        {props.children}
      </PostContext.Provider>
    </>
  );
};

export default PostState;
