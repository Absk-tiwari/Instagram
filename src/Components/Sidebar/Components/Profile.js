import { React, useContext, useEffect, useState } from "react";
import obito from "../../../assets/icons/profile.png";
import { Link } from "react-router-dom";
import UserPosts from "../../Pages/Profile/UserPosts";
import Saved from "../../Pages/Profile/Saved";
import UserTagged from "../../Pages/Profile/UserTagged";
import ProfileContext from "../../../Contexts/Profiles/ProfileContext";
import Loader from "../../StateComponents/Loader";
import headers from "../../../APIs/Headers";

const Profile = () => {
  const [active, setStat] = useState(1);
  const {LoggedIn} = useContext(ProfileContext);
  let user = localStorage.getItem('userLogin')
  user = JSON.parse(user)
  let posts  = localStorage.getItem('myPosts')
  posts = JSON.parse(posts)

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
 const [loaded, setLoad] = useState(false)
  useEffect(()=>{
    let query = window.location.search
    let term = query.split('?')
    console.log(term)
    term = term[1].split('=')[1]
    const getUser= async(term)=>{
      let data= await fetch('http://localhost:1901/api/profile/getuser',{
        method:'POST',
        headers:headers(),
        body:JSON.stringify({username:term})
      })
      return await data.json()
    }
    console.log(getUser(term))
    setTimeout(() => {
      setLoad(true)
    }, 5000);
  },[])

  return (
    <>
    { loaded ?
    (<div className="page Profile" >
      <div className="col-md-12 info-container">
        <div className="col-md-4">
          <div className="container">
            <img src={user.profile??obito} alt="not yet?" style={{objectFit:'cover',width:'60%'}} onClick={preview} />
          </div>
        </div>
        <div className="col-md-8">

          <div className="row">
            <div className="col-md-6">
              <h4>{user.username}</h4>
            </div>
            <div className="col-md-6">
              <Link to={'/edit-profile'} className="btn editprofile text-decoration-none text-dark fw-bold btn-secondary">
                Edit Profile
               </Link>
            </div>
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
              <small>{user.bio??LoggedIn.bio}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="container p-section">

        <ul className="nav align-items-center justify-content-center text-center" style={{ border: "none" }} >
          <li className="text-secondary" onClick={() => setStat(1) } >
            <Link className={`nav-link text-dark ${active === 1 && "active"}`} >
              <i className="fa fa-table text-secondary mx-1"></i> POSTS
            </Link>
          </li>
          <li className="text-secondary" onClick={() => setStat(2) } >
            <Link className={`nav-link text-dark ${active === 2 && "active"}`} >
              <i className="fa fa-bookmark-o text-secondary mx-2"></i> SAVED
            </Link>
          </li>
          <li className="text-secondary" onClick={() => setStat(3) } >
            <Link className={`nav-link text-dark ${active === 3 && "active"}`} >
              <i className="fa fa-tags text-secondary mx-1"></i> TAGGED
            </Link>
          </li>
        </ul>

        <div className="tab-content">
          {active === 1 && <UserPosts /> }
          {active === 2 && <Saved /> }
          {active === 3 && <UserTagged /> }
        </div>
        
      </div>
    </div>):<Loader height={200} left={350}/>
  }
    </>
  );
};

export default Profile;
