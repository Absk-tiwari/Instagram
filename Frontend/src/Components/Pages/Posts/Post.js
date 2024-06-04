import React, {  useEffect, useState}  from "react";
import PostHead from "./Components/PostHead";
import PostFooter from "./Components/PostFooter";
import Loader from "../../StateComponents/Loader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "../../../toast";

const Post = () => {
	const dispatch = useDispatch()
	const reflection = updatedPosts => setPosts(updatedPosts)
	const state = useSelector(state=>state.posts)
	const {totalPosts,skip,call} = state
	const [posts, setPosts] = useState(totalPosts??[])
	const [loading, setLoaing] = useState(false)
	useEffect(()=>{ 
		let skipp = skip
		let stopRequest =call
		const fetchData = async () => { 
		if(!stopRequest){   // continue only if last request had a response 
			setLoaing(true)
			axios.post('/post', {skip:skipp})
		   .then(({data}) =>{  
			   if(data?.length){
				   setPosts(posts=>posts.concat(data)) 
				   skipp = skipp + 2
				   let tillPosts = totalPosts
				   dispatch({type:'SKIP_POSTS',payload:skipp})
				   dispatch({type:'SET_POSTS',payload:tillPosts.concat(data)})
			   }else{ 
				dispatch({type:'STOP_CALLS'})
				toast('No posts to show!')
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
	  return () => window.removeEventListener('scroll', handleScroll);

 },[call])

  return (
    <>
      { posts.length ? 
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
            <h5 className="card-title placeholder-glow mx-3">
              <span className="placeholder col-6" style={{height:'50px',width:'50px',borderRadius:'50%'}}/>&nbsp;
              <span className="placeholder col-6" style={{height:'20px'}}/> 
            </h5>
            <p className="card-text placeholder-glow">
              <span className="placeholder col-12" style={{height:'300px'}}/> 
            </p>
            <small className="placeholder placeholder-glow col-10 mx-3"/> 
          </div>
        </div> 
        </>
      }
	{loading ? <Loader height={50}/>:null}
    </>
  );
};

export default Post;
