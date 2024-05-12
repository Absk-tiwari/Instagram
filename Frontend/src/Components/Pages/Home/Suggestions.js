import React, { useEffect, useState } from 'react'
import ProfileRow from '../Posts/Components/ProfileRow';
import pfp from '../../../assets/icons/profile.png';
import headers from '../../../APIs/Headers'
import { useDispatch, useSelector } from 'react-redux';
const Suggestions = () => {
  let me = JSON.parse(localStorage.getItem('userLogin'))
  let suggested = useSelector(state=>state.auth.suggested)
  let dispatch = useDispatch()
  const [profiles, setProfiles] = useState(suggested)
  useEffect(()=>{
	if(suggested.length===0)
	{ 
		fetch(`${process.env.REACT_APP_SERVER_URI}/api/profile/getProfiles`,{
			headers:headers()
		}).then(res=>res.json()).then(resp=>{
			setProfiles(resp.profiles)
			dispatch({type:'SET_SUGGESTED', payload:resp.profiles})
		}) 
	}

  },[profiles])
  if(me===null) return null
  return (
   <>
     <div className='col-md-3 rightSide'>
        <div className='mt-5 mb-5'>
          <ProfileRow profile={{profile:me.profile??pfp,username:me.username,url:'',self:true,name:me.name}}/>
        </div>
        <span id='sug'> Suggested for you </span>
        {
          profiles.length ? profiles.map((profile, index )=>{
            return <ProfileRow  key={index} profile={profile}/>
          }) :''
         }
      </div> 
   </>
  )
}

export default Suggestions