import React, { useContext } from "react";
import Story from "./Story";
import StoryContext from "../../../Contexts/Stories/StoryContext";
const Navbar = () => {
  const stories = useContext(StoryContext);
  return (
    <>
      <nav className="navbar navbar-expand-lg mt-5 mx-5 navbar">
        <div className="container-fluid" style={{ overflow: "auto" }}>
          {stories.map((story) => {
            return <Story img={story.cover} key={story.sno} />;
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
