import React, {  useEffect, useState}  from "react";
import PostHead from "./Components/PostHead";
import PostFooter from "./Components/PostFooter";
import headers from "../../../APIs/Headers";
import Loader from "../../StateComponents/Loader";

const Post = () => {
	const  [posts, setPosts] = useState([])
	const [loading, setLoaing] = useState(false)
	const reflection = updatedPosts => setPosts(updatedPosts)
	useEffect(()=>{ 
		let skip = 0
		let stopRequest =false
		const fetchData = async () => { 
		if(!stopRequest){   // continue only if last request had a response 
			setLoaing(true)
			fetch(process.env.REACT_APP_SERVER_URI+'/api/post',{
			   method:'POST',
			   headers:headers(),
			   body:JSON.stringify({skip})
		   })
		   .then(r=>r.json())
		   .then(data=>{  
			   if(data?.length){
				   setPosts(posts=>posts.concat(data)) 
				   skip = skip + 2
			   }else{ 
				stopRequest= true
			   }
			  setTimeout(() => setLoaing(false) , 1000); 
		   });  
		}
	  };
	  fetchData() // call it once without a scroll
	  const handleScroll = () => {  // trigger only when at the bottom of the page
		if(document.documentElement.clientHeight + window.scrollY === document.documentElement.scrollHeight){
		  fetchData();
		}
	  }; 
	  window.addEventListener('scroll', handleScroll);
	  return () => {
		window.removeEventListener('scroll', handleScroll);
	  }; 

 },[])

  return (
    <>
      { posts?.length ? 
        posts.map( (post,index) => {
        return (
          <div className="col-md-8 post card mt-5" key={index}>
            <div className="card-header profileHead">
              <PostHead post={post} totalPosts={posts} updatePosts={reflection} />
            </div>
            <div className="card-body">
              <img className="postContent" src={post.content} alt={``} />
            </div>
            <div className="card-footer">
              <PostFooter post={post} alt={{details:true}} c={true}/>
            </div>
          </div>
        );
	})
	:  <> 
        <div className="col-md-8 post card mt-5" >
          <div className="card-body">
            <h5 className="card-title placeholder-glow">
              <span className="placeholder col-6" style={{height:'50px',width:'50px',borderRadius:'50%'}}/>&nbsp;
              <span className="placeholder col-6" style={{height:'20px'}}/> 
            </h5>
            <p className="card-text placeholder-glow">
              <span className="placeholder col-12" style={{height:'300px'}}/> 
            </p>
            <span className="placeholder placeholder-glow col-10"/> 
          </div>
        </div> 
        </>
      }
	{loading && <Loader height={50}/>}
    </>
  );
};

export default Post;
