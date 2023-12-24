import React from "react";
import Home from "../assets/icons/home.png";

import Explore from "../assets/icons/explore.png";
import Messages from "../assets/icons/messages.png";
import Reels from "../assets/icons/reels.png";
import Notifications from "../assets/icons/notifications.png";
import Create from "../assets/icons/create.png";
import Profile from "../assets/icons/profile.png";

export const SidebarData = [
  {
    title: "Home",
    icon: <img className="icons" src={Home} alt="not found" />,
    link: "/home",
  },
  {
    title: "Search",
    icon: (
      <i
        className="material-icons"
        style={{ fontSize: "33px", paddingBottom: "5px" }}
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
    icon: <img className="icons" src={Explore} alt="not found" />,
    link: "/explore",
  },
  {
    title: "Reels",
    icon: <img className="icons" src={Reels} alt="not found" />,
    link: "/reels",
  },
  {
    title: "Messages",
    icon: <img className="icons" src={Messages} alt="not found" />,
    link: "/messages",
  },
  {
    title: "Notifications",
    icon: <img className="icons" src={Notifications} alt="not found" />,
    link: "/notifications",
    modal: "#notifications",
  },
  {
    title: "Create",
    icon: <img className="icons" src={Create} alt="not found" />,
    link: "#",
  },
  {
    title: "Profile",
    icon: <img className="icons" src={Profile} alt="not found" />,
    link: "/profile",
  },
];
