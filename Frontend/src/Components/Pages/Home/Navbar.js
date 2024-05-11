import React, { useEffect, useState } from "react"; 
import Stories from "./Stories";
import ob from '../../../assets/icons/profile.png'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  let me = JSON.parse(localStorage.getItem('userLogin'))
  const stories = useSelector(state=>state.auth.stories)
  const [Loaded, setLoader] = useState(stories.length===0)
  const dispatch = useDispatch()
  const addToStory = ()=> {}
  useEffect(()=>{
	if(stories.length===0)
	{
		dispatch({type:'GET_STORIES'})
	}
    setTimeout(() => setLoader(false), 2000); 
  }, [])

  const placeholderStyle = {height:'60px',width:'60px',marginLeft:'40px', borderRadius:'50%'};

  return (
    <>
      <nav className="navbar-expand-lg mt-4 mx-4" style={{position:'static'}}> 
      { Loaded===false ?
        <div className="stories" >
         <div className={`myStory`} style={{position:'relative', marginBottom:'15px'}} onClick={addToStory}>
            <Link to={`/stories/itachi/view`} style={{marginBottom:`auto`}} ><Stories img={me.profile??ob}/></Link>
            <div className="userStory"><i className="fa fa-plus text-white" /></div>
         </div>
         { stories.map((story,key)=> {
            return <Link key={key} to={`/stories/${story.username}/view`}><Stories img={story.cover}/></Link>;
          }) }
        </div>
        : 
          <p className="placeholder-glow mb-3 mx-2 d-flex">
            <span className="placeholder col-1" style={placeholderStyle}></span>&nbsp;
            <span className="placeholder col-1" style={placeholderStyle}></span>&nbsp;
            <span className="placeholder col-1" style={placeholderStyle}></span>&nbsp;
            <span className="placeholder col-1" style={placeholderStyle}></span>&nbsp;
          </p>
      }

      </nav>
    </>
  );
};

export default Navbar;
