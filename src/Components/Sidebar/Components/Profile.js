import { React, useContext, useState } from "react";
import obito from "../../../assets/icons/pfp.png";
import { Link } from "react-router-dom";
import UserPosts from "../../Pages/Profile/UserPosts";
import Saved from "../../Pages/Profile/Saved";
import UserTagged from "../../Pages/Profile/UserTagged";
import ProfileContext from "../../../Contexts/Profiles/ProfileContext";

const Profile = () => {
  const [active, setStat] = useState(1);
  const {LoggedIn} = useContext(ProfileContext);

  const preview = (e) => {
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
  return (
    <div className="page Profile" >
      <div className="col-md-12 info-container">
        <div className="col-md-4">
          <div className="container">
            <img src={obito} alt="not yet?" onClick={preview} />
          </div>
        </div>
        <div className="col-md-8">

          <div className="row">
            <div className="col-md-6">
              <h4>te.sting8398</h4>
            </div>
            <div className="col-md-6">
              <Link to={'/edit-profile'} className="btn editprofile text-decoration-none text-dark fw-bold btn-secondary">
                Edit Profile
               </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-3 stats">
              <strong>{LoggedIn.posts}</strong> posts
            </div>
            <div className="col-sm-4 stats">
              <strong >{LoggedIn.followers}</strong> followers
            </div>
            <div className="col-sm-4 stats">
              <strong>{LoggedIn.following}</strong> following
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <strong>{LoggedIn.name}</strong>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <small>{LoggedIn.bio}</small>
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
    </div>
  );
};

export default Profile;
