import React from "react";
import camera from "../../../assets/icons/camera.png";
import Photo from "./Photo";

const UserPosts = (props) => {
  const posts = props.posts
  
  const style = {
    height: "4%",
    width: "7%",
    border: "2px solid black ",
    borderStyle: "rounded",
  };
    return (
      <>
        {posts && posts.length===0? (
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
            {posts && posts.map((post,index) => {
                  return ( 
                    <Photo key={index} post={post}/>
                    );
                  })
            }
          </div>
          </div>
        )}
      </>
    );     

};

export default UserPosts;
