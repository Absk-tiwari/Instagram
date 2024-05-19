import { React, useEffect, useState } from "react";
import obito from "../../../assets/icons/profile.png";
import verified from '../../../assets/icons/verified.png'
import { Link, useNavigate } from "react-router-dom";
import UserPosts from "../../Pages/Profile/UserPosts";
import Saved from "../../Pages/Profile/Saved";
import UserTagged from "../../Pages/Profile/UserTagged";
import Loader from "../../StateComponents/Loader";
import headers from "../../../APIs/Headers";
import Chat from '../Components/Messages/Chat'
import { socket } from "../../../socket";
import Modal from "../../StateComponents/Modal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../../toast";

const Profile = () => {
  const navigator = useNavigate() 
  const dispatch = useDispatch()
  const isPhone = window.screen.width < 500
  let me = JSON.parse(localStorage.getItem('userLogin')) 
  const searchedProfile = useSelector(state=>state.auth.searchProfile)
  console.log(searchedProfile)
  let state = useSelector(state=>state.auth)  // post of searched user
//   let myPosts = useSelector(state=>state.auth.myPosts) // for searched user
  let userInfo // = useSelector(state=>state.auth.userInfo)  // post of searched user
  let userPosts //= useSelector(state=>state.auth.userPosts) // for searched user
  let isLoaded;
  if(searchedProfile===me?.username)
  {
	userInfo = state.myInfo
	userPosts = state.myPosts
	isLoaded = state.myPostsLoaded
  }else{
	userInfo = state.userInfo
	userPosts = state.userPosts
	isLoaded = state.userPostsLoaded
  }
  const [active, setStat] = useState(1);
  const [chatopened, setupChat] = useState(false)
  const [user, setUser] = useState(userInfo)
  const [posts, setPost] = useState(userPosts)
  const [open, setmodal] = useState(false);
  const lstyle = { listStyleType: "none" };
  const [react, setReact] = useState(false)
  const [loggedOut, out] = useState(false)
  
  const toggleModal = e => {
    if(e.target.id==='modal' || e.target.classList.contains('openModal')) setmodal(!open)
  };
  const preview =  e => {
    let div = document.createElement("div"); 
    div.classList.add('randomDiv') ;
    const img = e.target
    const cloned = img.cloneNode(true)
	if(isPhone) cloned.classList.add('random-phone') ;  
	else cloned.classList.add('random') ;  
    document.querySelector('#root').classList.add('addCover') 
    div.appendChild(cloned); 
    setTimeout(()=>{
      document.body.appendChild(div);
    },500)
    
  };
  document.body.addEventListener('click',function(event) {
    const appended = document.querySelector('.randomDiv'); 
    if(appended && event.target.classList.contains('random')===false){
      document.body.removeChild(appended);
      document.querySelector('#root').classList.remove('addCover')
    }
  })

  const reaction =  (act,targetUsername)  => {  // update profile based on follow btn change
    let type = act ? 'follow':'unfollow'
    fetch(`${process.env.REACT_APP_SERVER_URI}/api/post/update`,{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({type,targetUsername})
    })
	.then(r=> r.json())
	.then(resp=>{
      if(resp.status){
        let data={
          type: 'follow',
          for: targetUsername,
          icon: user.profile??obito,
          user : me.username ,
          about:me.username,
          message : `<b>${me.username}</b> ${user.private?'requested to follow you':'started following you'}` 
        }
        setReact(act)
        
        if(type === 'follow')
	{
  	  toast(`following `+data.for)
          if(data.user!==data.for)
	  {
            socket.emit('notify',data)
          }
        }else{
  	  toast(`unfollowed `+data.for)
          socket.emit('remNotified',data)
        }
      }
      
    })
  }
  const logout = () => {
	localStorage.clear()
	setLoad(false)
	toast(`Logged out!`)
	setTimeout(() => {
		out(true)
		dispatch({ type:'LOGOUT',payload:null })
	}, 2000);
  }
 const [loaded, setLoad] = useState(isLoaded)
  useEffect(()=>{
	  
  let term = searchedProfile
	if(me===undefined || loggedOut) return navigator('/login');
	  
	const init = () => 
	{
		fetch(`${process.env.REACT_APP_SERVER_URI}/api/profile/getuser`,{
			method:'POST',
			headers:headers(),
			body:JSON.stringify({username:term})
		})
		.then(res=> res.json())
		.then(data=>{
			setLoad(true)
			if(data?.user){
				setUser(data.user)
				if(term===me.username)
				{
					dispatch({type:'SET_MY_INFO',payload:data.user}) 
				}else{
					dispatch({type:'SET_USER',payload:data.user})
				}
				if(data.isFollowing) setReact(true)
				
				fetch(`${process.env.REACT_APP_SERVER_URI}/api/post/getPostsOf`,{
					method:'POST',
					headers:headers(),
					body:JSON.stringify({username:data.user.username})
				})
				.then(res=> res.json())
				.then(data=>{
					setPost(data)
					if(term===me.username)
					{
						dispatch({type:'MY_POSTS_LOADED',payload:true})
						dispatch({ type:'SET_MY_POSTS', payload:data })
					}else
					{ 
						dispatch({type:'SEARCH_USER_POSTS_LOADED',payload:true})
						dispatch({ type:'SET_PROFILE_POSTS', payload:data })
					}
				})
			}
		})
	}
	if(term!==me?.username)
	{
		init()
	}else{
		if(Object.keys(userInfo).length===0)
		{
			init()
		}
	}
	return () =>  null 
  },[react,searchedProfile,loggedOut])
  return (
    <>
     { loaded ? chatopened ? (
      <>
      <Chat me={me.username} userImage={user.profile??obito} username={user.username} name={user.name} details={user} launch={false} />
      </>
    ):(<div className="page Profile" >
      <div className="col-md-12 info-container">
        <div className="col-md-4">
          <div className="container">
            <img src={user && user.profile?user.profile:obito} alt="not yet?" style={{objectFit:'cover',width:'60%'}} className={`pictureAtProfile`} onClick={preview} />
          </div>
        </div>
        <div className="col-md-8">

          <div className="row col-12">
            <div className="col-6 d-flex">
              <h4>{user?.username??'Instagram User'}</h4>
			{user.verified ? 
			  	<img height={20} width={20} src={verified} className={`mx-1`} alt={''}/> :''}
            </div>
            {user && me?.username===user.username?
            (<div className="col-6">
              <Link to={'/edit-profile'} className="btn editprofile text-decoration-none text-dark fw-bold btn-secondary">
                Edit Profile
               </Link>
            </div>
            ):''}
          </div>

          <div className="row col-12">
            <div className="col-4 stats">
              <strong>{posts ? posts.length : 0}</strong> posts
            </div>
            <div className="col-4 stats">
              <strong >{user.followers}</strong> followers
            </div>
            <div className="col-4 stats">
              <strong>{user.following}</strong> following
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <p style={{fontFamily:'monospace'}}>{user.name}</p>
            </div>
          </div>
          
            <div className="col-sm-12 mb-3">
              <small>{user?.bio??''}</small>
            </div>
          
          { (me.username !==user.username)? (
            <div className="row" style={{marginBottom:'30px'}}>
                <div className={` ${react? 'editprofile col-sm-4':'btn-primary col-sm-4'} btn mx-1 fw-bold`} onClick={()=>reaction(!react,user.username)}>
                  { react? (user.private?'Following':'Requested') : 'Follow' }
                </div>
               {(user.private && react ) || user.private===false ? 
	        <div className="col-sm-4 editprofile btn mx-3 fw-bold" onClick={()=> setupChat(!chatopened)}>
                  Message
                </div>:""}
            </div>
          ):!Object.entries(me).length ? ('Ye User poori tarah se kaalpanik hai, Iska vastavikta se koi taalukaat nhi hai'):''}

        </div>
      </div>
            
      {  user.username &&
        <div className="container p-section">

        <ul className="nav align-items-center justify-content-center text-center" style={{ border: "none" }} >
          <li className="text-secondary" onClick={() => setStat(1) } >
            <span className={`nav-link text-dark ${active === 1 && "active"}`} >
              <i className="fa fa-table text-secondary mx-1"></i> POSTS
            </span>
          </li>
          { me.username===user.username && 
              (<li className="text-secondary" onClick={() => setStat(2) } >
                <span className={`nav-link text-dark ${active === 2 && "active"}`} >
                  <i className="fa fa-bookmark-o text-secondary mx-2"></i> SAVED
                </span>
              </li>
          )}
          
          <li className="text-secondary" onClick={() => setStat(3) } >
            <span className={`nav-link text-dark ${active === 3 && "active"}`} >
              <i className="fa fa-tags text-secondary mx-1"></i> TAGGED
            </span>
          </li>
        </ul>

        <div className="tab-content">
        { loaded ?
          (<>
          {active === 1 && 
            <UserPosts 
              privateAccount={user.private} 
              isMe={me.username===user.username}
              posts={(user.private && react ) || !user.private? posts:[]} 
            /> 
          }
          {active === 2 && me.username!==user.username ? <Saved />:'' }
          {active === 3 && <UserTagged /> }
          </>):(<Loader height={100} left={350}/>)
        }
        </div>
        
      </div>}
    </div>
    ):<Loader height={200} left={350} Class={`outer`}/>
  }
  {loaded ?
  (<>
  <div id="moreOnProfile" className="dropdown custom-row" data-bs-toggle="dropdown" aria-expanded="false">
	<div id="icon" style={{height:`20px`,marginTop:'40px',left:'35vw',fontSize:'20px'}}>
	 &#x2630;</div> 
    <ul className={"dropdown-menu"} style={{position:'absolute',left:'70vw'}}> 
      <li><Link className="dropdown-item px-4 text-danger openModal" to="/profile" onClick={setmodal}> Log out </Link></li>
    </ul>
  </div>
  <Modal isOpen={open} dimens={{ height: 250, width: 360 }} onClose={toggleModal} className="profiler">
    <h3 className="text-center">Are you sure?</h3>
    <li style={lstyle} className="text-center mt-5 mb-4" >
      <Link onClick={logout} className="text-primary text-decoration-none fs-4">Logout</Link>
    </li>
    <li style={lstyle}>
      <hr className="dropdown-divider" />
    </li>
    <li style={lstyle} className="text-center align-items-center justify-contents-center"onClick={()=>setmodal(false)} >
      <Link className="text-secondary text-decoration-none">Cancel</Link>
    </li>
  </Modal>
  </>
  ):null
  }
  </>
  );
};

export default Profile;
