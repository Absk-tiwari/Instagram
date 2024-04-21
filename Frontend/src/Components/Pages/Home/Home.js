import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Suggestions from "./Suggestions";
import Post from "../Posts/Post";
// eslint-disable-next-line
import Respond from '../../../respond'
import { useNavigate } from "react-router-dom";

function Home() {
  const navigator = useNavigate()
  useEffect(()=>{
	if(!localStorage.getItem('token')) return navigator('/login')
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
