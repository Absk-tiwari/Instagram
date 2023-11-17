import React from "react";
import PostContext from "../../Contexts/Profiles/PostContext";
import obito from "../../assets/icons/obito.jpg";
import itachi from "../../assets/icons/pfp.png";
import profile from "../../assets/icons/profile.png";
import dots from "../../assets/icons/dots.png";

const PostState = (props) => {
  const posts = [
    {
      index:0,
      content: itachi,
      comments: "31K",
      likes: "1.1M",
      shares: "321K",
      posted: "2w",
      location: "Faizabad",
      username: "obito",
      name: "Abesh Mishra",
      link: "profile/max_avesh",
      pfp: obito,
      action: dots,
      data: {},
    },
    {
      index:1,
      content: itachi,
      comments: "31K",
      likes: "1.1M",
      shares: "321K",
      posted: "2w",
      location: "Faizabad",
      username: "obito2",
      name: "Abesh Mishra",
      link: "profile/max_avesh",
      pfp: obito,
      action: dots,
      data: {},
    },
    {
      index:2,
      content: itachi,
      comments: "31K",
      likes: "1.1M",
      shares: "321K",
      posted: "2w",
      location: "Faizabad",
      username: "obito3",
      name: "Nobita Mishra",
      link: "profile/max_avesh",
      pfp: obito,
      action: dots,
      data: {},
    },
    {
      index:3,
      content: obito,
      comments: "32K",
      likes: "1.2M",
      shares: "154K",
      posted: "2d",
      location: "Lucknow",
      username: "whatever",
      name: "whatever Tiwari",
      link: "profile/whatever",
      pfp: itachi,
      action: dots,
      data: {},
    },
    {
      index:4,
      content: profile,
      comments: "32K",
      likes: "1.2M",
      shares: "154K",
      posted: "2d",
      location: "Lucknow",
      username: "whatever2",
      name: "whatever Tiwari",
      link: "profile/whatever2",
      pfp: profile,
      action: dots,
      data: {},
    },
  ];

  //   const personalPosts = () => {
  //     console.log("calling...");
  //   };
  return (
    <>
      <PostContext.Provider value={posts}>
        {props.children}
      </PostContext.Provider>
    </>
  );
};

export default PostState;
