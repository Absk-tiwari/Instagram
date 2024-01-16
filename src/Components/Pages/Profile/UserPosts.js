import React, {useState, useContext ,useEffect} from "react";
import camera from "../../../assets/icons/camera.png";
import Photo from "./Photo";

const UserPosts = () => {
  const [active, set] = useState(false)
  let user = localStorage.getItem('userLogin')
  user = JSON.parse(user)
  let myPosts = localStorage.getItem('myPosts');
  myPosts = JSON.parse(myPosts)
  const style = {
    height: "4%",
    width: "7%",
    border: "2px solid black ",
    borderStyle: "rounded",
  };
  // eslint-disable-next-line
  //  console.log(posts);
  // const getContent = id => { 
  //   console.log(id);
  //   document.querySelector(`#${id}`).classList.remove('d-none');
  // }; 
 
  setTimeout(() => {
    if(active){  
    }
    console.log(myPosts)
    console.log('executed')
  }, 12000);
    return (
      <>
        {!myPosts? (
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
            {myPosts && myPosts.map((post) => {
                  return ( 
                    <Photo key={post.user_id} params={{index:post.user_id,username:post.username,content:post.content, likes:4 }}/>
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
