import React, { useContext } from "react"; 
import StoryContext from "../../../Contexts/Stories/StoryContext";
import Stories from "./Stories";
import { Link } from 'react-router-dom'

const Navbar = () => {
  const stories = useContext(StoryContext);
  return (
    <>
      <nav className="navbar navbar-expand-lg mt-5 mx-5 navbar">
        <div className="container-fluid" style={{ overflow: "auto" }}>
          {stories.map((story) => {
            return <Link key={story.sno} to={`/stories/${story.username}/view`}><Stories img={story.cover}  ></Stories></Link>;
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
