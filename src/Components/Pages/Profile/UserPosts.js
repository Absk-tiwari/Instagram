import React, { useContext } from "react";
import camera from "../../../assets/icons/camera.png";
import PostContext from "../../../Contexts/Profiles/PostContext";

const UserPosts = () => {
  const style = {
    height: "4%",
    width: "7%",
    border: "2px solid black ",
    borderStyle: "rounded",
  };
  // eslint-disable-next-line
  const posts = useContext(PostContext);
  //  console.log(posts);
  const getContent = (e) => {
    //const data = e.target.dataset;
    //console.log(data);
  };
  //console.log(posts);
  return (
    <>
      {!posts ? (
        <div id="menu1" className={`container`}>
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
      ) : (
        <div className="container" style={{ overflowY: "scroll" }}>
          <div className="row d-flex">
            {posts.map((post) => {
              return (
                <img
                  className="col-md-4 postImg"
                  key={post.username}
                  src={post.content}
                  alt="not yet?"
                  data-content={post.likes}
                  onMouseOver={getContent}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default UserPosts;
