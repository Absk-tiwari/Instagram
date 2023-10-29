import React from "react";
import profile from "../../../assets/icons/profile.png";

function Profile() {
  return (
    <div className="side-item mt-3 d-flex">
      <img
        className="mx-3 mt-2"
        style={{ height: "27px" }}
        src={profile}
        alt="not found"
      />
      <p className="mt-2"> Profile </p>
    </div>
  );
}

export default Profile;
