import { React, useContext, useEffect, useState } from "react";
import obito from "../../../assets/icons/profile.png";
import { Link } from "react-router-dom";
import UserPosts from "../../Pages/Profile/UserPosts";
import Saved from "../../Pages/Profile/Saved";
import UserTagged from "../../Pages/Profile/UserTagged";
import ProfileContext from "../../../Contexts/Profiles/ProfileContext";
import Loader from "../../StateComponents/Loader";
import headers from "../../../APIs/Headers";
import Chat from '../Components/Messages/Chat'
import { socket } from "../../../socket";

const Profile = () => {
  const [active, setStat] = useState(1);
  const [chatopened, setupChat] = useState(false)
  const {LoggedIn} = useContext(ProfileContext);
  let use = localStorage.getItem('userLogin')
  use = JSON.parse(use)
  const [user, setUser] = useState([])
  let posted  = localStorage.getItem('myPosts')
  posted = JSON.parse(posted)
  const [posts, setPost] = useState(posted)
  const [react, setReact] = useState(false)
  
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
    },2000)
    
  };
  document.body.addEventListener('click',function(event) {
    const appended = document.querySelector('.randomDiv'); 
    if(appended && event.target.classList.contains('random')===false){
      document.body.removeChild(appended);
      document.querySelector('#root').classList.remove('addCover')
    }
  })

  const reaction =  (act,targetUsername)  => {
    let type = act ? 'follow':'unfollow'
    console.log(act,targetUsername,type)
    fetch('http://192.168.119.154:1901/api/post/update',{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({type,targetUsername})
    }).then(res=>{
      return res.json()
    }).then(status=>{
      console.log(status)
      if(status.status){
        if(type === 'follow'){
          console.log('you should notify them now!')
          let data={
            type: 'follow',
            for: targetUsername,
            icon: user.profile??obito,
            user : use.username,
            at : Date.now()
          }
          socket.emit('notify',data)
        }
      }

    })
    setReact(act)
  }
 
 const [loaded, setLoad] = useState(false)
  useEffect(()=>{
    let query = window.location.search
    console.log(query)
    if(query){ 
      let term = query.split('?')
      term = term[1].split('=')[1]
      fetch('http://192.168.119.154:1901/api/profile/getuser',{
        method:'POST',
        headers:headers(),
        body:JSON.stringify({username:term})
      }).then(res=>{
        return res.json();
      }).then(data=>{
        console.log(data)
        setUser(data ??[])
        setLoad(true)
        if(data){
          fetch('http://192.168.119.154:1901/api/post/getPostsOf',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({username:data[0].username})
          }).then(res=>{
            return res.json()
          }).then(data=>{
            console.log('posts of queried user',data)
            setPost(data)
          })
        }
      })
    }else{
      setLoad(true)
      setUser(use)
    }
    
    return ()=>{
      setPost(posted)
      setUser([])
    }
  },[])
  return (
    <>
    { loaded ? chatopened ? (
      <>
      <Chat me={use.username} userImage={user.profile??obito} username={user.username} name={user.name} details={user} launch={false} />
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
            <div className="col-md-6">
              <h4>{user.username??'Instagram User'}</h4>
            </div>
            {user && use.username===user.username?
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
          { (use.username !==user.username)? (
            <div className="row" style={{marginBottom:'30px'}}>
                <div className={`col-sm-4 ${react? 'editprofile':'btn-primary'} btn mx-1 fw-bold`} onClick={()=>reaction(!react,user.username)}>
                  {react? 'Following':'Follow'}
                </div>
                <div className="col-sm-4 editprofile btn mx-3 fw-bold" onClick={()=> setupChat(!chatopened)}>
                  Message
                </div>
            </div>
          ):!Object.entries(use).length ? ('Ye User poori tarah se kaalpanik hai, Iska vastavikta se koi taalukaat nhi hai'):''}

        </div>
      </div>
            
      {  user.username &&
        <div className="container p-section">

        <ul className="nav align-items-center justify-content-center text-center" style={{ border: "none" }} >
          <li className="text-secondary" onClick={() => setStat(1) } >
            <Link className={`nav-link text-dark ${active === 1 && "active"}`} >
              <i className="fa fa-table text-secondary mx-1"></i> POSTS
            </Link>
          </li>
          { use.username===user.username && 
              (<li className="text-secondary" onClick={() => setStat(2) } >
                <Link className={`nav-link text-dark ${active === 2 && "active"}`} >
                  <i className="fa fa-bookmark-o text-secondary mx-2"></i> SAVED
                </Link>
              </li>
          )}
          
          <li className="text-secondary" onClick={() => setStat(3) } >
            <Link className={`nav-link text-dark ${active === 3 && "active"}`} >
              <i className="fa fa-tags text-secondary mx-1"></i> TAGGED
            </Link>
          </li>
        </ul>

        <div className="tab-content">
        { loaded ?
          (<>
          {active === 1 && <UserPosts posts={posts} /> }
          {active === 2 && use.username!==user.username ? <Saved />:'' }
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
