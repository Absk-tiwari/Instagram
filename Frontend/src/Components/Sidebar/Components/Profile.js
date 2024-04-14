import { React, useEffect, useState } from "react";
import obito from "../../../assets/icons/profile.png";
import verified from '../../../assets/icons/verified.png'
import { Link, useLocation } from "react-router-dom";
import UserPosts from "../../Pages/Profile/UserPosts";
import Saved from "../../Pages/Profile/Saved";
import UserTagged from "../../Pages/Profile/UserTagged";
import Loader from "../../StateComponents/Loader";
import headers from "../../../APIs/Headers";
import Chat from '../Components/Messages/Chat'
import { socket } from "../../../socket";

const Profile = () => {
  const location = useLocation()
  const [active, setStat] = useState(1);
  const [chatopened, setupChat] = useState(false)
  const [user, setUser] = useState([])
  const [posts, setPost] = useState([])
  const [react, setReact] = useState(false)
  
  let me = JSON.parse(localStorage.getItem('userLogin')) 

  const preview =  e => {
    let div = document.createElement("div"); 
    div.classList.add('randomDiv') ;
    const img = e.target
    const cloned = img.cloneNode(true)
    cloned.classList.add('random') ;  
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
    fetch('https://instagram-vquy.onrender.com/api/post/update',{
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
          message : `<b>${me.username}</b> started following you` 
        }
        setReact(act)
        
        if(type === 'follow'){
          if(data.user!==data.for){
            socket.emit('notify',data)
          }
        }else{
          socket.emit('remNotified',data)
        }
      }
      
    })
  }
 
 const [loaded, setLoad] = useState(false)
  useEffect(()=>{
    let params = location.pathname.split('/')
    let term
    if(params.length===3){  
      term = params[2] 
    }else{
      term = JSON.parse(localStorage.getItem('userLogin'))
      term = term.username
    }
      fetch('https://instagram-vquy.onrender.com/api/profile/getuser',{
        method:'POST',
        headers:headers(),
        body:JSON.stringify({username:term})
      })
	  .then(res=> res.json())
	  .then(data=>{
        setLoad(true)
        if(data?.user){
          setUser(data.user)
          if(data.isFollowing) setReact(true)
          
          fetch('https://instagram-vquy.onrender.com/api/post/getPostsOf',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({username:data.user.username})
          })
		  .then(res=> res.json())
		  .then(data=>setPost(data))
        }
      })
     
	  fetch('https://instagram-vquy.onrender.com/api/profile/test',{
		headers:headers()
	  }).then(r=>r.json())
	  .then(da=>console.log(da))
	  
  },[react])
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
            <img src={user && user.profile?user.profile:obito} alt="not yet?" style={{objectFit:'cover',width:'60%'}} onClick={preview} />
          </div>
        </div>
        <div className="col-md-8">

          <div className="row">
            <div className="col-md-6 d-flex">
              <h4>{user.username??'Instagram User'}</h4>
			  {user.username==='absk.tiwari' || user.verified ? 
			  	<img height={20} width={20} src={verified} className={`mx-1`} alt={''}/> :''}
            </div>
            {user && me.username===user.username?
            (<div className="col-md-6">
              <Link to={'/edit-profile'} className="btn editprofile text-decoration-none text-dark fw-bold btn-secondary">
                Edit Profile
               </Link>
            </div>
            ):''}
          </div>

          <div className="row">
            <div className="col-sm-3 stats">
              <strong>{posts ? posts.length : 0}</strong> posts
            </div>
            <div className="col-sm-4 stats">
              <strong >{user.followers}</strong> followers
            </div>
            <div className="col-sm-4 stats">
              <strong>{user.following}</strong> following
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <p style={{fontFamily:'monospace'}}>{user.name}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <small>{user.bio??''}</small>
            </div>
          </div>
          { (me.username !==user.username)? (
            <div className="row" style={{marginBottom:'30px'}}>
                <div className={`col-sm-4 ${react? 'editprofile':'btn-primary'} btn mx-1 fw-bold`} onClick={()=>reaction(!react,user.username)}>
                  {react? 'Following':'Follow'}
                </div>
                <div className="col-sm-4 editprofile btn mx-3 fw-bold" onClick={()=> setupChat(!chatopened)}>
                  Message
                </div>
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
          {active === 1 && <UserPosts posts={posts} /> }
          {active === 2 && me.username!==user.username ? <Saved />:'' }
          {active === 3 && <UserTagged /> }
          </>):(<Loader height={100} left={350}/>)
        }
        </div>
        
      </div>}
    </div>
    ):<Loader height={200} left={350}/>
  }
    </>
  );
};

export default Profile;
