import React, { useContext, useEffect, useState } from "react"; 
import StoryContext from "../../../Contexts/Stories/StoryContext";
import Stories from "./Stories";
import ob from '../../../assets/icons/profile.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [Loaded, setLoader] = useState(true)
  let user = localStorage.getItem('userLogin')
  user = JSON.parse(user)
  const {stories, getStories} = useContext(StoryContext);
  const addToStory = ()=> {}
  useEffect(()=>{
    getStories();
    setTimeout(() => {
      setLoader(false)
    }, 2000); 
  }, [getStories])

  const placeholderStyle = {height:'60px',width:'60px',marginLeft:'40px', borderRadius:'50%'};

  return (
    <>
      <nav className="navbar navbar-expand-lg mt-5 mx-4" style={{position:'static'}}> 
      { Loaded===false ?
        <div className="stories" >
		 <div style={{position:'relative', marginBottom:'15px'}} onClick={addToStory}>
          <Link to={`/stories/itachi/view`} style={{marginBottom:`auto`}} ><Stories img={user.profile??ob}/></Link>
          <div className="userStory"><i className="fa fa-plus text-white" ></i></div>
        </div>
         { stories.map(story => {
            return <Link key={story.sno} to={`/stories/${story.username}/view`}><Stories img={story.cover}/></Link>;
          }) }
        </div>
        : 
          <p className="placeholder-glow mb-3 mx-2">
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
