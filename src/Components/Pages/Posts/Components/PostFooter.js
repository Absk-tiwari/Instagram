import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headers from "../../../../APIs/Headers";
import {socket} from '../../../../socket';
import Modal from "../../../Modal";
import profile from '../../../../assets/icons/profile.png'
import ContextMenu from "../../../StateComponents/ContextMenu";
const PostFooter = (props) => {
  let me = JSON.parse(localStorage.getItem('userLogin'))
  const { post } = props;
  const { alt } = props;
  const [likes, setLikes ]= useState(post.likes.length)
  const [like, reactPost] = useState(post.likes.includes(me.username));
  const [save, savePost] = useState(false);
  const [comment,setComment] = useState(''); // this holds the input text
  const [comments,put] = useState([]); // allover comments 
  const [open, setmodal] = useState(false);
  const [replies, contain] = useState([])
  const [contextMenu, setContext] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    items: [],
    c:''
  });

  const toggle = e => {
    if(e.target.id==='modal' || e.target.classList.contains('postImg')) setmodal(!open)
  }

  const replied = event => {
    event.preventDefault()
    addComment()
    let mine = me.username
    let obj ={}
    obj[mine]= [{profile:me.profile,content:comment, username:me.username}]
    contain(obj) 
    setComment('')
    document.getElementById(event.target.id).classList.add('d-none') 
  }
  const ToReply = id => { 
    document.getElementById(id).classList.remove('d-none') 
  }  
  const submitComment = event => {
    event.preventDefault()
    addComment()
  }
  const addComment = () => {
    fetch('http://localhost:1901/api/post/addComment',{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({username:post.username,comment, postID:post._id})
    }).then(res=>{
      return res.json()
    }).then(resp=>{
      if(resp.status) console.log('comment added!')
      setComment('')
    })
  }
  const updatePost = type => {
    type = type?'unlike':'like'
    console.log(type, post._id)
    reactPost(!like)    
    fetch('http://localhost:1901/api/post/update',{
      method : 'POST',
      headers: headers(),
      body:JSON.stringify({ type:type,postID:post._id})
    }).then(res=>{
      return res.json()
    }).then(data=>{
      if(data.status){
        if(type==='like'){
          setLikes(parseInt(likes)+1)
          socket.emit('notify',{user:me.username, type:'like',label:post.content, for:post.username,about:post._id+me.username});
        }
        else{
          setLikes(parseInt(likes)-1)
          socket.emit('remNotified',{user:me.username, type:'unlike', for:post.username,about:post._id+me.username});
        } 
      }else{
        reactPost(!like)
      }
    })
  }

  const getComments = () => {
    fetch(`http://localhost:1901/api/post/comments/${post._id}`,{
      method:'GET',
      headers:headers()
    }).then(res=>res.json()).then(data=>{
      if(data.length){
        put(data)
      }
      setmodal(!open)
    }) 
  }

  const remove = _id => {
    fetch(`http://localhost:1901/api/post/comment/delete/${_id}`,{
      method:'DELETE',
      headers:headers()
    }).then(res=>{
      return res.json()
    }).then(resp=>{
      if(resp.status){
        let temp = comments
        temp = temp.filter(item=>item._id!==_id)
        put(temp) 
      }
    });
  }

  const onContext = event => { 
    let user = event.target.dataset.index
    user = comments[user]
    let id = user._id
    let items = [ 
        {label:(<i className='fa fa-trash'/>), class:'text-danger', onClick:()=>remove(id)}
      ]
    event.preventDefault()
    const x = event.clientX
    const y = event.clientY + 25
    setContext({
      isVisible : true, 
      x, y ,
      items,
      c:'70px'
    })
  }

  const rem = () => setContext({
    isVisible : false,  
  })

  useEffect(()=>{
    document.addEventListener('click', rem )
    return ()=>{
      document.removeEventListener('click', rem)
    }
  },[])
  return (
    <>
      <ContextMenu {...contextMenu}  />
      <div className="row">
        <div className="col-sm-1">
          <i className={`fa${!like ? '-regular': ''} fa-heart${like ? ' animate': ''} mt-1`} style={{transition: "0.2s",fontSize: "25px",
          color: like ? 'red':''}} onClick={() =>updatePost(like)} title={like?'Unlike':'Like'}/>
        </div>
        <div className="col-sm-1">
           <svg aria-label="Comment" className="_8-yf5 " color="#262626" fill="#262626" 
           height="22" role="img" viewBox="0 0 48 48" width="24" onClick={getComments}> 
            <path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1  
                2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2  
                1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8  
                1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" 
             fillRule="evenodd"/>  
           </svg>
        </div>
        <div className="col-sm-1">
          <svg aria-label="Share Post" className="_8-yf5 " color="#262626" fill="#262626" 
          height="22" role="img" viewBox="0 0 48 48" width="24"> 
            <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5  
              22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z" /> 
          </svg> 
        </div>
        <div className="col-sm-8"></div>
        { alt.details && <div className="col-sm-1">
          <i className={`fa fa-bookmark${save ? '' : '-o'}`} title={save ? "Unsave" : "Save"}
            onClick={() => savePost(!save)} style={{ fontSize: "24px" }}/>
        </div>}
      </div>

      {likes ? (<p className="d-flex mt-2">{likes===1? likes+' like': likes+' likes'}</p>) :''}

      <div className={`row ${!likes && 'mt-2'}`} style={{ lineHeight: "4.2px" }}>
        <div className="col-md-12 mt-1 d-flex">
          <b><Link className={'text-dark text-decoration-none'} to={`/profile?user=${post.username}`}
            >{post.username}</Link></b>
          &nbsp;<p>{post.caption??' It is what it is.'} &#128516;</p>
        </div>
        { alt.details && <div className="col-md-12">
          <span className="text-secondary" style={{cursor:'pointer'}} onClick={getComments}>
            View all comments
          </span>
        </div>}
      </div> 
      { alt.details && <div className="hstack gap-4 mt-2">
        <form id="commentForm" onSubmit={submitComment}>
          <input placeholder="Add a comment..." className="input" value={comment} onChange={e=>setComment(e.target.value)} />
          <button type="submit" className="btn text-primary">
            Add
          </button>
        </form>
      </div> } 
        <Modal isOpen={open} dimens={{height:500 ,width:520 }} onClose={toggle}>
          <>
          <div className='container'>
            <div className='col-12'> 
              <div className="col-md-12 mt-1 d-flex">
                <b><Link className={'text-dark text-decoration-none'} to={`/profile?user=${post.username}`}
                  >{post.username}</Link></b>
                &nbsp;<p>{post.caption??' It is what it is.'} &#128516;</p>
              </div>

              {!comments.length?(
                <div className="col-12 card-body mx-2">
                <p className="card-title placeholder-glow mb-3">
                  <span className="placeholder col-6"/> 
                </p>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-7"/>
                  <span className="placeholder col-6"/>
                  <span className="placeholder col-7"/>
                  <span className="placeholder col-6"/>
                  <span className="placeholder col-8"/>
                </p>
                <p className="card-body placeholder-glow">
                  <span className='placeholder col-2'/>
                  <span className='placeholder col-11'/>
                  <span className='placeholder col-10'/>
                  <span className='placeholder col-5'/>
                </p>
              </div>
             ):comments.map((user,index)=>{
              return (
                <div key={index} className={`row mt-3 openchat`} data-index={comments.indexOf(user)} style={{cursor:'pointer'}} onContextMenu={onContext}>
                  <div className="col-sm-2" data-index={comments.indexOf(user)} style={{position:"relative"}}>
                      <img data-index={`${comments.indexOf(user)}`}
                      src={profile} style={{height:'50px',width:'50px!important'}} className="mx-auto pfpicture" alt=""/> 
                  </div>
                  <div className={`col-sm-10 user`} style={{lineHeight:'1.3'}} data-index={comments.indexOf(user)} >
                    <b>{user.from}</b>
                    <p className={`username text-dark`} style={{fontWeight:'500'}} data-index={comments.indexOf(user)}> 
                    <small data-index={comments.indexOf(user)}>{user.content}</small><br/> <span className="text-secondary" onClick={()=>ToReply(comments.indexOf(user)+'_id')}>Reply</span>
                  {replies[user.from] && replies[user.from].map((cmt,index)=>{
                    return (<div key={index} className="row mt-3 openchat" style={{cursor:'pointer'}} >
                            <div className="col-sm-2" style={{position:"relative"}}>
                              <img data-index={`${comments.indexOf(cmt)}`} src={cmt.profile??profile} style={{height:'50px',width:'50px!important'}} className="mx-auto pfpicture" alt=""/> 
                            </div>
                            <div className={`col-sm-10 user`} style={{lineHeight:'1.3'}} >
                              <b>{cmt.username}</b>
                              <p className={`username text-dark`} style={{fontWeight:'500'}} id={comments.indexOf(user)+'_id'} > {cmt.content}
                              </p>
                            </div>
                        </div> )
                  })}
                  </p>
                  <form className="d-none" id={`${comments.indexOf(user)+'_id'}`} onSubmit={replied}>
                    <input type="text" className="form-control" style={{border:0,borderRadius:0,borderBottom:'0.5px solid black'}} onChange={e=>setComment(e.target.value)} /> 
                    <button type="submit" className="btn text-primary">send</button>
                  </form>
                </div>
              </div> 
            )})}

          </div>
        </div>
        </>
        </Modal>
    </>
  );
};

export default PostFooter;
