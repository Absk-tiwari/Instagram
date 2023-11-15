import { React, useState } from "react";
import obito from "../../../assets/icons/pfp.png";
import { Link } from "react-router-dom";
import UserPosts from "../../Pages/Profile/UserPosts";
import Saved from "../../Pages/Profile/Saved";
import UserTagged from "../../Pages/Profile/UserTagged";
import { act } from "react-dom/test-utils";

const Profile = () => {
  const [active, setStat] = useState(1);

  const preview = (e) => {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.appendChild(e.target);
    console.log(div);
    document.body.appendChild(div);
  };
  return (
    <div className="container Profile" style={{}}>
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
              <button className=" text-dark editprofile">
                <strong>Edit Profile</strong>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <strong>2</strong> posts
            </div>
            <div className="col-sm-4">
              <strong>173</strong> followers
            </div>
            <div className="col-sm-4">
              <strong>99</strong> following
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <strong>Deployment</strong>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <small>
                The future belongs to those who believe in the beauty of their
                dreams
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="container p-section">
        <ul
          className="nav align-items-center justify-content-center text-center"
          style={{ border: "none" }}
        >
          <li
            className="text-secondary"
            onClick={() => {
              setStat(1);
            }}
          >
            <Link
              className={`nav-link text-dark ${active === 1 ? "active" : ""}`}
            >
              <i className="fa fa-table text-secondary mx-1"></i>
              POSTS
            </Link>
          </li>
          <li
            className="text-secondary"
            onClick={() => {
              setStat(2);
            }}
          >
            <Link
              className={`nav-link text-dark ${active === 2 ? "active" : ""}`}
            >
              <i className="fa fa-bookmark-o text-secondary mx-2"></i> SAVED
            </Link>
          </li>
          <li
            className="text-secondary"
            onClick={() => {
              setStat(3);
            }}
          >
            <Link
              className={`nav-link text-dark ${active === 3 ? "active" : ""}`}
            >
              <i className="fa fa-tags text-secondary mx-1"></i> TAGGED
            </Link>
          </li>
        </ul>

        <div className="tab-content">
          {active === 1 ? <UserPosts /> : ""}
          {active === 2 ? <Saved /> : ""}
          {active === 3 ? <UserTagged /> : ""}
        </div>
      </div>
    </div>
  );
};

export default Profile;
