import React, { useContext } from "react";
import camera from "../../../assets/icons/camera.png";
import PostContext from "../../../Contexts/Profiles/PostContext";
import Photo from "./Photo";

const UserPosts = () => {
  const style = {
    height: "4%",
    width: "7%",
    border: "2px solid black ",
    borderStyle: "rounded",
  };
  // eslint-disable-next-line
  const {posts} = useContext(PostContext); 
  //  console.log(posts);
  // const getContent = id => { 
  //   console.log(id);
  //   document.querySelector(`#${id}`).classList.remove('d-none');
  // }; 
  return (
    <>
      {!posts ? (
        <div id="menu1" className={`container`}>
          <br />

          <img src={camera}
            className="img-fluid rounded-circle mx-auto d-block mt-5 "
            style={style} alt="?"
          />
          <small className="mx-auto d-block text-center pt-5">
            When you share photos, they will appear on your profile
          </small>
          <p className="text-primary link-underline-light mx-auto d-block text-center pt-2">
            Share your first photo
          </p>
        </div>
      ) : (
        <div className="container" style={{ overflowY: "scroll" }}>
          <div className="row d-flex">
            {posts.map((post) => {
              return ( 
                <Photo key={post.index} params={{index:post.index,username:post.username,content:post.content, likes:post.likes }}/>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default UserPosts;
