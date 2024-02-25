import React from "react";
import Home from "../assets/icons/home.png";

import Explore from "../assets/icons/explore.png";
import Messages from "../assets/icons/messages.png";
import Reels from "../assets/icons/reels.png";
import Notifications from "../assets/icons/notifications.png";
import Create from "../assets/icons/create.png";
import Profile from "../assets/icons/profile.png";
const me = JSON.parse(localStorage.getItem('userLogin'))
const refer = e => { 
    if (e.target.dataset.refer !== "/search")
      document.querySelector(".close").click();
    let elem = e.target;
    if (elem.children.length ?? false) {
      if (elem.children[1] ?? false) {
        elem.children[1].click();
      }
    }
};
export const SidebarData = [
  {
    title: "Home",
    icon: <img onClick={refer} data-refer={'/'} className="icons" src={Home} alt="not found" />,
    link: "/",
  },
  {
    title: "Search",
    icon: (
      <i
        className="material-icons"
        style={{ fontSize: "33px", paddingBottom: "5px" }} data-bs-toggle="offcanvas" data-bs-target={'#search'}
      >
        {" "}
        search{" "}
      </i>
    ),
    link: "/search",
    modal: "#search",
  },
  {
    title: "Explore",
    icon: <img onClick={refer} data-refer="/explore" className="icons" src={Explore} alt="not found" />,
    link: "/explore",
  },
  {
    title: "Reels",
    icon: <img onClick={refer} data-refer="/reels" className="icons" src={Reels} alt="not found" />,
    link: "/reels",
  },
  {
    title: "Messages",
    icon: <img onClick={refer} data-refer="/messages" className="icons" src={Messages} alt="not found" />,
    add: <span className="badge text-bg-secondary d-none" id="msg-badge">4</span>,
    link: "/messages",
  },
  {
    title: "Notifications",
    icon: <img onClick={refer} className="icons" data-refer="/notifications" src={Notifications} alt="not found" />,
    link: "/notifications",
    modal: "#notifications",
  },
  {
    title: "Create",
    icon: <img onClick={refer} className="icons" src={Create} alt="not found" />,
    link: "#",
  },
  {
    title: "Profile",
    icon: <img onClick={refer} className="pfpicture" src={me && me.profile?me.profile :Profile} style={{height:'30px',width:'30px'}} alt="" data-refer="/profile" />,
    link: "/profile",
  },
];
