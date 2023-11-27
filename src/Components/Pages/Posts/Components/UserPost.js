import React from "react";
import { Link } from "react-router-dom";

//eslint-disable-next-line
import ProfileData from "../../DataContainer(notInUse)/ProfileData";
import Button from "../../../StateComponents/Button";

const UserPost = (props) => {
  const { pfp, username, posted, location } = props.post;
  
  const refer = ( link) => {
    console.log(link)
     
  }
  return (
    <>
      <div className="col-sm-2" onClick={()=>refer(username)}>
        <img className="userPost" src={pfp} alt="not yet" />
      </div>
      <div className="col-auto pt-2" onClick={()=>refer(`/profile?username=${username}`)}>
        <Link
          style={{ textDecoration: "none", color: "black" }}
          id="link"
        >
        <b >{username}</b>
        </Link>
        <small className="text-secondary mx-2">{posted}</small>
        <br />
        <small className="mb-2">{location}</small>
      </div>
      <div className="col-auto">
         <Button text={'Follow'} alt={'Following'} />
      </div>
      <div className="col-sm-1 offset-sm-2 pt-2 float-sm-right">
        <i className="fa fa-ellipsis-h" />
      </div>
    </>
  );
};

export default UserPost;
