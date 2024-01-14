import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Suggestions from "./Suggestions";
import Post from "../Posts/Post";
import Respond from '../../../respond'

function Home() {
 
  useEffect(()=>{
     Respond();
  },[])
  return (
    <>
      <div className="col-md-6">
        <Navbar />
        <Post />
      </div>
      <Suggestions />
    </>
  );
}

export default Home;
