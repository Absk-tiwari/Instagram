import React from 'react';
// eslint-disable-next-line
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Suggestions from './Suggestions';
import Post from '../Posts/Post';

function Home (){
  return (
    <>
    <div className='col-md-6'>
      <Navbar/>  
      <Post/> 
    </div>
    <Suggestions/>
    </>
    
  )
}

export default Home