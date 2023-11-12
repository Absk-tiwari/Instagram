import React from "react";
import { Link } from "react-router-dom";
import camera from "../../../assets/icons/camera.png";

const UserPosts = () => {
  const style = {
    height: "4%",
    width: "7%",
    border: "2px solid black ",
    borderStyle: "rounded",
  };
  return (
    <>
      <div id="menu1" className={`container `}>
        <br />

        <img
          src={camera}
          className="img-fluid rounded-circle mx-auto d-block mt-5 "
          style={style}
          alt="not yet?"
        />
        <small className="mx-auto d-block text-center pt-5">
          When you share photos, they will appear on your profile
        </small>
        <p className="text-primary link-underline-light mx-auto d-block text-center pt-2">
          Share your first photo
        </p>
      </div>
    </>
  );
};

export default UserPosts;
