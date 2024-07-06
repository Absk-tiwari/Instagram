import React from "react";
import Home from "../../assets/icons/home.png";
import Explore from "../../assets/icons/explore.png";
import Messages from "../../assets/icons/messages.png";
import Reels from "../../assets/icons/reels.png";
import Create from "../../assets/icons/create.png";
import Profile from "../../assets/icons/profile.png";
import { init } from "../../socket";
const me = await init()
const pfp = me?.profile??Profile
const refer = e => { 
    if (e.target.dataset.refer !== "/search")
      document.querySelector(".close").click();
    let elem = e.target;
    enhance(e)
    if (elem.children.length ?? false) {
      if (elem.children[1] ?? false) {
        elem.children[1].click();
      }
    }
};
const enhance = (e) => {
  document.querySelectorAll('.custom-sidebarList i[data-bs-toggle="offcanvas"],img[data-refer]').forEach(e=>e.classList.remove(`icon-active`))
  e.target.classList.add('icon-active')
}
export const SidebarData = [
  {
    title: "Home",
    icon: <img onClick={refer} data-refer={'/'} className="icons" src={Home} alt={``} />,
    link: "/",
  },
  {
    title: "Search",
    icon: (
      <i
        className="material-icons"
        style={{ fontSize: "30px", paddingBottom: "5px" }} data-bs-toggle="offcanvas" data-bs-target={'#search'}
        onClick={enhance}
      >
        {" "}search{" "}
      </i>
    ),
	link: "#",
    modal: "#search",
  },
  {
    title: "Explore",
    icon: <img onClick={refer} data-refer="/explore" className="icons" src={Explore} alt={``} />,
    link: "/explore",
  },
  {
    title: "Reels",
    icon: <img onClick={refer} data-refer="/reels" className="icons" src={Reels} alt={``} />,
    link: "/reels",
  },
  {
    title: "Messages",
    icon: <img onClick={refer} data-refer="/messages" className="icons" src={Messages} alt={``} />,
    add: <span className="badge text-bg-secondary d-none" id="msg-badge">4</span>,
    link: "/messages",
  },
  {
    title: "Notifications",
    icon: <i onClick={refer}
      className="icons fa-regular fa-heart fs-3" 
      data-bs-toggle="offcanvas" 
      data-bs-target="#notifications" 
      data-refer="/notifications" 
      style={{ fontSize: "20px" }}
    />,
    link: "/notifications",
    modal: "#notifications",
  },
  {
    title: "Create",
    icon: <img onClick={refer} className="icons" src={Create} alt={``} data-refer={`#create`} />,
    link: "#create",
  },
  {
    title: "Profile",
    icon: <img onClick={refer} className="pfpicture" src={pfp} style={{height:'27px',width:'27px'}} alt="" data-refer="/profile" />,
    link: "/profile",
  },
];
