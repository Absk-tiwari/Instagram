import React from "react";
import { Link } from "react-router-dom";

//eslint-disable-next-line
import ProfileData from "../../DataContainer(notInUse)/ProfileData";
import Button from "../../../StateComponents/Button";

const PostUser = (props) => {
  const { pfp, username, posted, location } = props.post;
  
  const refer = e => {
    let elem = e.target;
    console.log(elem.closest('.head'))
  }
  return (
    <>
    <div className="d-flex head">
      <div className="col-2" onClick={refer}>
        <img className="userPost" src={pfp} alt="?"/>
      </div>
      <div className="col-3 pt-2" >
        <Link className="text-decoration-none text-dark fw-bold" id="link" to={`/profile?username=${username}`}>
           {username}
        </Link>
        <small className="text-secondary mx-2">{posted}</small> <br/>
        <small className="mb-2">{location}</small>
      </div>
      <div className="col-6">
        <Button text={'Follow'} alt={'Following'} />
      </div>
      <i className="fa fa-ellipsis-h mx-4" />
      </div>
    </>
  );
};

export default PostUser;
