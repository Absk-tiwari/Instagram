import React, { useEffect }  from 'react';
import { Link } from "react-router-dom";
import pfp from '../../../../assets/icons/profile.png'
import Button from "../../../StateComponents/Button";
import {howLong} from  '../../../../helpers'
import headers from '../../../../APIs/Headers';
import verified from '../../../../assets/icons/verified.png'  
const PostHead = (props) => { 
  let {post,updatePosts,totalPosts} = props
  let me = JSON.parse(localStorage.getItem('userLogin'))
  const refer = e => {
    let elem = e.target;
    elem.closest('.head').querySelector('.linkToProfile').click();
  }
  useEffect(()=>{},[])

  const del =()=> {
	fetch(`http://https://instagram-api-one.vercel.app//api/post/delete/${post._id}`,{
		headers:headers(),
		method:'DELETE'
	})
	.then(r=>r.json())
	.then(res=>{
		console.log(res)
		if(res.status){
			updatePosts(totalPosts.filter(item=>item._id!==post._id))
		}
	})
  }
  const block =()=> {
	console.log('block user',post)
  }
  const save =()=> {
	fetch('http://https://instagram-api-one.vercel.app//api/post/save',{
		method:'POST',
		headers:headers(),
		body:JSON.stringify({post_id:post._id})
	}).then(r=>r.json)
	.then(data=>console.log(data))
  }
  const rep =()=> {
	console.log('report post',post)
  }
  return (
	<> 
    <div className='row d-flex rel'>
      <div className="d-flex head">
      <div className="col-2" onClick={refer}>
        <img className="pfpicture" src={post.profile??pfp} alt={``}/>
      </div>
      <div className="col-6 pt-2" >
        <Link className={`text-decoration-none text-dark fw-bold linkToProfile`} id="link" to={`/profile/${post.username}`}>
           {post.username}
        </Link>
        {post.username==='absk.tiwari' || post.verified ?
           <img height={20} width={20} src={verified} className={`mx-1`} alt={''}/> 
          :'' 
        }
        <small className="text-secondary mx-2">{ howLong(new Date(post.created_at)) }</small> <br/>
        <small className="mb-2">{post.location}</small>
      </div>
	  <div className="col-5">
	  {post.username!==me.username?
		(<Button text={post.shouldFollow?'Follow':'Following'} Class={post.shouldFollow?`followbtn`:'followingbtn'} alt={post.shouldFollow?'Following':'Follow'}/>):''} 
      </div>

	<i className={`fa fa-ellipsis-h dropup`} data-post={JSON.stringify(post)} data-bs-toggle={`dropdown`} />
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