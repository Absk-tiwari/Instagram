import React, { useEffect, useState } from 'react'
import ProfileRow from '../Posts/Components/ProfileRow';
import pfp from '../../../assets/icons/profile.png';
import headers from '../../../APIs/Headers'
const Suggestions = () => {
  let me = JSON.parse(localStorage.getItem('userLogin'))
  const [profiles, setProfiles] = useState([])
  useEffect(()=>{

	fetch(`http://localhost:1901/api/profile/getProfiles`,{
		headers:headers()
	}).then(res=>res.json()).then(resp=>{
		console.log(resp)
		setProfiles(resp.profiles)
	}) 

  },[])
  return (
   <>
     <div className='col-md-3 rightSide'>
        <div className='mt-5 mb-5'>
          <ProfileRow profile={{profile:me.profile??pfp,username:me.username,url:'',self:true,name:me.name}}/>
        </div>
        <span id='sug'> Suggested for you </span>
        {
          profiles.length && profiles.map((profile, index )=>{
            return <ProfileRow  key={index} profile={profile}/>
          })
         }
      </div> 
   </>
  )
}

export default Suggestions