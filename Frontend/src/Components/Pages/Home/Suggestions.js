import React, { useEffect, useState } from 'react'
import ProfileRow from '../Posts/Components/ProfileRow';
import Default from '../../../assets/icons/profile.png';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Button from '../../StateComponents/Button';
import { useNavigate } from 'react-router-dom';
const Suggestions = () => {
  let {suggested, profileInfo} = useSelector(state=>state.auth)
  let me = profileInfo
  let dispatch = useDispatch()
  const [profiles, setProfiles] = useState(suggested)
  const navigateTo = useNavigate()
  const refer = e => {
	dispatch({type:'SEARCH_PROFILE',payload:profiles[e.target.dataset.index].username})
	navigateTo('/profile')
  }
  useEffect(()=>{
	if(suggested.length===0)
	{ 
		axios.get(`/profile/getProfiles`)
		.then(res=>{
			let resp= res.data
			setProfiles(resp.profiles)
			dispatch({type:'SET_SUGGESTED', payload:resp.profiles})
		}) 
	}

  },[profiles])
  if(me===null) return null
  return (
    <>
	{ window.screen.width > 500 ? 
      <div className='col-md-3 rightSide' style={{overflow:'auto',height:'100vh'}}>
        <div className='mt-5 mb-5'>
          <ProfileRow profile={{profile:me.profile??Default,username:me.username,url:'',self:true,name:me.name}}/>
        </div>
        <span id='sug'> Suggested for you </span>
        {
          profiles.length ? profiles.map((profile, index )=>{
            return <ProfileRow  key={index} profile={profile}/>
          }) :''
		}
      </div> 
	  :
	  <div className='mt-3'>
		<div className='followingbtn' style={{zIndex:1, overflow:'auto'}}>
		<h6 className='mx-4 mt-3'> Suggested For you </h6>
		<div className='d-flex'>
		{profiles.map((pfp,index)=>{
			return (
				<div className='text-center col mx-2 mt-2 p-3' key={index} 
					style={{
						zIndex:10,
						width:'auto',
						minWidth:175,
						background:'white',
						borderRadius:'15px'
					}}
					data-index={index}
				>
					<img 
						src={pfp.profile??Default} 
						className='pfpicture' 
						style={{height:120,width:120}}
						alt='' 
						onClick={refer}
						data-index={index}
					/><br/>
					<b>{pfp.username}</b> <br/>
					<small className='text-secondary'>{pfp.name}</small><br/>
					<Button text={'Follow'} Class={`followbtn w-50`} alt={'Following'}/>
				</div>)
		})}
		</div>
		</div>
	  </div>
	  }
    </>
  )
}

export default Suggestions