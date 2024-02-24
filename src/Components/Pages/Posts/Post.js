import React, {  useEffect, useState}  from "react";
import PostHead from "./Components/PostHead";
import PostFooter from "./Components/PostFooter";
import headers from "../../../APIs/Headers";

const Post = () => {
const [posts, setPosts] = useState([])
const [skip,setCount] = useState(0)
 useEffect(()=>{ 
	 const fetchData = async () => { 
 		fetch('http://localhost:1901/api/post',{
			method:'POST',
			headers:headers(),
			body:JSON.stringify({skip})
		}).then(res=>{
			return res.json()
		}).then(data=>{  
			if(data.length){
				setPosts(posts=>posts.concat(data)) 
				setCount(skip=>skip+2)
			}
		});  
	  };
  
	  const handleScroll = () => {
		if(window.innerHeight + document.documentElement.scrollTop ===document.documentElement.offsetHeight){
		  fetchData();
		}
	  }; 
	  window.addEventListener('scroll', handleScroll);
	  return () => {
		window.removeEventListener('scroll', handleScroll);
	  }; 

 },[skip])

  return (
    <>
      { posts && posts.length > 0 ? 
        posts.map( (post,index) => {
        return (
          <div className="col-md-8 post card mt-5" key={index}>
            <div className="card-header profileHead">
              <PostHead post={post} />
            </div>
            <div className="card-body">
              <img className="postContent" src={post.content} alt="." />
            </div>
            <div className="card-footer">
              <PostFooter post={post} alt={{details:true}}/>
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
