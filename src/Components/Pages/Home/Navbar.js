import React, { useContext, useEffect, useState } from "react"; 
import StoryContext from "../../../Contexts/Stories/StoryContext";
import Stories from "./Stories";
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [Loaded, setLoader] = useState(true)
  const {stories, getStories} = useContext(StoryContext);

  useEffect(()=>{
    getStories();
    setTimeout(() => {
      setLoader(false)
    }, 7000); 
  }, [getStories])

  const placeholderStyle = {height:'60px',width:'60px',marginLeft:'40px', borderRadius:'50%'};

  return (
    <>
      <nav className="navbar navbar-expand-lg mt-5 mx-5 navbar">
      { Loaded===false ?
        <div className="container-fluid" style={{ overflow: "auto" }}>
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
            <span className="placeholder col-1" style={placeholderStyle}></span>&nbsp;
          </p>
      }

      </nav>
    </>
  );
};

export default Navbar;
