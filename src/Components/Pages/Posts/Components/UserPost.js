import React from "react";
import { Link } from "react-router-dom";

//eslint-disable-next-line
import ProfileData from "../../DataContainer(notInUse)/ProfileData";

const UserPost = (props) => {
  const { pfp, username, posted, location } = props.post;
  return (
    <>
      <div className="col-sm-2">
        <img className="userPost" src={pfp} alt="not yet" />
      </div>
      <div className="col-auto pt-2">
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to={`/profile?username=${username}`}
        >
          <b>{username}</b>
        </Link>
        <small className="text-secondary mx-2">{posted}</small>
        <br />
        <small className="mb-2">{location}</small>
      </div>
      <div className="col-auto">
        <button className="btn btn-sm my-2 border-0 fs-6 text-primary">
          Follow
        </button>
      </div>
      <div className="col-sm-1 offset-sm-2 pt-2 float-sm-right">
        <i className="fa fa-ellipsis-h" />
      </div>
    </>
  );
};

export default UserPost;
