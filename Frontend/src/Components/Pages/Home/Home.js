import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Suggestions from "./Suggestions";
import Post from "../Posts/Post";
// eslint-disable-next-line
import Respond from '../../../respond'

function Home() {
 
  useEffect(()=>{
	// Respond();
  },[])
  return (
    <>
      <div className="col-md-6 home">
        <Navbar />
        <Post />
      </div>
      <Suggestions />
    </>
  );
}

export default Home;
