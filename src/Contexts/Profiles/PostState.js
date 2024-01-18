import React from "react";
import PostContext from "../../Contexts/Profiles/PostContext";
import obito from "../../assets/icons/obito.jpg";
import itachi from "../../assets/icons/pfp.png";
import profile from "../../assets/icons/profile.png";
import dots from "../../assets/icons/dots.png";
import headers from "../../APIs/Headers";

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

    const personalPosts = async() => {
      let resp = await fetch('http://localhost:1901/api/post/getuserPosts',{
        method:'GET',
        headers:headers()
      })
      const data = await resp.json()
      return data;
    };

    let myPosts = []
    function getMyposts(){
      let data = personalPosts()
      data.then(item=>{
        if(!item.error && item.length){
          for(let i of item){
            myPosts.push(i)
          }
        }else{
          throw new Error('Maybe it\'s unauthorised!')
          navigator('/')
        }
        localStorage.setItem('myPosts',JSON.stringify(myPosts))
      }).catch(err=>console.log(err)) 
    }
    getMyposts()
    const createPost = async(obj) => {
      let resp = await fetch(`http://localhost:1901/api/post/create`,{
        method:'POST',
        headers:headers(),
        body:JSON.stringify(obj)
      })
      if(resp.status){
        let till = localStorage.getItem('myPosts')
        till = JSON.parse(till)
        till.push(resp.post)
        localStorage.setItem('myPosts',JSON.stringify(till))
        return true
      }
      return false

     }

  return (
    <>
      <PostContext.Provider value={{posts,getMyposts,createPost, personalPosts,myPosts}}>
        {props.children}
      </PostContext.Provider>
    </>
  );
};

export default PostState;
