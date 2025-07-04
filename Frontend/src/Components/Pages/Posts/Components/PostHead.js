import React, { useEffect }  from 'react';
import { useNavigate } from "react-router-dom";
import pfp from '../../../../assets/icons/profile.png'
import Button from "../../../StateComponents/Button";
import {howLong} from  '../../../../helpers'
import verified from '../../../../assets/icons/verified.png'  
import { toast } from '../../../../toast';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
const PostHead = (props) => { 
  let dispatch = useDispatch()
  let navigator = useNavigate()
  let {post,updatePosts,totalPosts} = props
  const {profileInfo} = useSelector(state=>state.auth)
  let me = profileInfo
  const refer = e => {
    let elem = e.target;
    dispatch({ type:'SEARCH_PROFILE', payload:post.username })
    navigator('/profile');
  }

  const actOn = evt => {
    dispatch({ type:'ACCOUNT_ACTIVITY', payload:{ type:post.shouldFollow,targetUsername:post.username } })
    evt.preventDefault()
  }
  useEffect(()=>{},[])
  if(me===null) return null
  const del =()=> {
	axios.delete(`post/delete/${post._id}`)
	.then(res=>{
		if(res.data.status)
    {
			toast(`Post deleted!`)
			updatePosts(totalPosts.filter(item=>item._id!==post._id))
		}
	})
  }
  const block =()=> {
	  toast(`in development`)
  }
  const save =()=> {
	axios.post('/post/save',{post_id:post._id}) 
	.then(data=>console.log(data))
  }
  const rep =()=> {
	  toast(`In development`)
  }
  return (
	<> 
    <div className='row d-flex'>
      <div className="d-flex head">
      <div className="col-2" onClick={refer}>
        <img className="pfpicture" src={post.profile??pfp} alt={``}/>
      </div>
      <div className="col-6 pt-2" >
        <span className={`text-decoration-none text-dark fw-bold linkToProfile`} onClick={refer}>
           {post.username}
        </span>
        { post.verified ?
           <img height={20} width={20} src={verified} className={`mx-1`} alt={''}/> 
          :'' 
        }
        <small className="text-secondary mx-1">{ howLong(new Date(post.created_at)) }</small> <br/>
        <small className="mb-2">{post.location}</small>
      </div>
	  <div className="col-4">
	  {post.username!==me.username?
		(       
      <Button text={post.shouldFollow?'Follow':'Following'} Class={post.shouldFollow?`followbtn`:'followingbtn'} alt={post.shouldFollow?'Following':'Follow'}/>
    ):''} 
      </div>

	<i className={`fa fa-ellipsis-vertical mt-3 dropup`} data-post={JSON.stringify(post)} data-bs-toggle={`dropdown`} style={{position:'static'}} />
        <ul className={`dropdown-menu absoluteAtPoint`}>
          <li>
            <span className={`dropdown-item px-4`} onClick={rep} > Report </span>
          </li>
          <li>
            <span className={`dropdown-item px-4`} onClick={save} > Save Post </span>
          </li>
		  {me.username===post.username?
			<li>
			  <span className={`dropdown-item px-4 text-danger`} onClick={del} > Delete Post </span>
			</li>
		   :<li>
		  	  <span className={`dropdown-item px-4 text-danger`} onClick={block} > Block </span>
		   </li>}
        </ul>
      </div>
    </div>
	</>
  )
}

export default PostHead
