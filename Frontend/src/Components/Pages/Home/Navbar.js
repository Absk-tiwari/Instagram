import React, { useEffect, useState } from "react"; 
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
  if(me===null) return null

	const placeholderStyle = {
		height:'60px',
		width:'60px',
		marginLeft:'20px', 
		borderRadius:'50%'
	};

  return (
    <>
      <nav className="navbar-expand-lg mt-4" style={{position:'static'}}> 
      { Loaded===false ?
        <div className="stories" >
         <div className={`myStory`} 
		 	style={{position:'relative', marginBottom:'15px',marginLeft:'22px'}} 
			onClick={addToStory}
		 >
            <span onClick={addToStory} style={{marginBottom:`auto`}} >
				<div className='story' style={{backgroundImage:`url(${me.profile??ob}`}} /> 
			</span>
            <div className="userStory"><i className="fa fa-plus text-white" /></div>
         </div>
         { stories.map((story,key)=> {
            return <Link key={key} to={`/stories/${story.username}/view`}>
				<div className='story' style={{backgroundImage:`url(${story.cover??ob}`}} />
			</Link>;
          }) }
        </div>
        : 
          <div className="mx-4">
			<p className="placeholder-glow mb-3 mx-2 d-flex">
            <span 
				className="placeholder col-1" 
				style={{...placeholderStyle,marginLeft:'40px'}}
			/>&nbsp;
            <span className="placeholder col-1" style={placeholderStyle}/>&nbsp;
            <span className="placeholder col-1" style={placeholderStyle}/>&nbsp;
            <span className="placeholder col-1" style={placeholderStyle}/>&nbsp;
            <span className="placeholder col-1" style={placeholderStyle}/>&nbsp;
          </p>
		  </div>
      }

      </nav>
    </>
  );
};

export default Navbar;
