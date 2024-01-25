import React, { useState } from "react";
import { Link } from "react-router-dom";
import headers from "../../../../APIs/Headers";

const PostFooter = (props) => {
  let me = JSON.parse(localStorage.getItem('userLogin'))
  const { post } = props;
  const { alt } = props;
  const [likes, setLikes ]= useState(post.likes.length)
  const [like, reactPost] = useState(post.likes.includes(me._id));
  const [save, savePost] = useState(false);
  console.log(post.likes)
  const updatePost = ( type,postID)=> {
    type = type?'unlike':'like'
    console.log(type, postID)
    reactPost(!like)    
    fetch('http://192.168.119.154:1901/api/post/update',{
      method : 'POST',
      headers: headers(),
      body:JSON.stringify({ type:type,postID:postID})
    }).then(res=>{
      return res.json()
    }).then(data=>{
      if(data.status){
        if(type==='like') setLikes(parseInt(likes)+1)
        else setLikes(parseInt(likes)-1)
      }else{
        reactPost(!like)
      }
    })
  }

  return (
    <>
      <div className="row">
        <div className="col-sm-1">
          <i className={`fa${!like ? '-regular': ''} fa-heart${like ? ' animate': ''} mt-1`} style={{transition: "0.2s",fontSize: "25px",
          color: like ? 'red':''}} onClick={() =>updatePost(like,post.id)} title={like?'Unlike':'Like'}></i>
        </div>
        <div className="col-sm-1">
           <svg aria-label="Comment" className="_8-yf5 " color="#262626" fill="#262626" 
           height="22" role="img" viewBox="0 0 48 48" width="24"> 
            <path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1  
                                        2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11  
                                        47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2  
                                        1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2  
                                        1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8  
                                        1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7  
                                        3.5 24 3.5 44.5 12.7 44.5 24z" 
             fillRule="evenodd"> </path> 
           </svg>
        </div>
        <div className="col-sm-1">
        <svg aria-label="Share Post" className="_8-yf5 " color="#262626" fill="#262626" 
        height="22" role="img" viewBox="0 0 48 48" width="24"> 
                                    <path
                                        d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9  
                                        3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5  
                                        22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3  
                                        1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2  
                                        6.1h35.5L18 18.7 5.2 6.1zm18.7  
                                        33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"> 
                                    </path> 
                                </svg> 
        </div>
        <div className="col-sm-8"></div>
        { alt.details && <div className="col-sm-1">
          <i className={`fa fa-bookmark${save ? '' : '-o'}`} title={save ? "Unsave" : "Save"}
            onClick={() => savePost(!save)} style={{ fontSize: "24px" }}/>
        </div>}
      </div>

      {likes && (<p className="d-flex mt-2">{likes} likes</p>) }

      { alt.details && <div className={`row ${!likes && 'mt-2'}`} style={{ lineHeight: "4.2px" }}>
        <div className="col-md-12 mt-1 d-flex">
          <b><Link className={'text-dark text-decoration-none'} to={"/profile?user="}
            >{post.username}</Link></b>
          &nbsp;<p>{post.caption??' This is the truth'} &#128516;</p>
        </div>
        <div className="col-md-12">
          <span className="text-secondary">View all comments</span>
        </div>
      </div> }
      <div className="hstack gap-4 mt-2">
        <form id="commentForm">
          <input placeholder="Add a comment..." id="input" />
          <button type="button" className="btn text-primary ">
            Add
          </button>
        </form>
      </div>
    </>
  );
};

export default PostFooter;
