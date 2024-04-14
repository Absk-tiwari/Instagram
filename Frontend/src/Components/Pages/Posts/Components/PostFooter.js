import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headers from "../../../../APIs/Headers";
import {socket} from '../../../../socket';
import Modal from "../../../StateComponents/Modal";
import profile from '../../../../assets/icons/profile.png'
import ContextMenu from "../../../StateComponents/ContextMenu";
import Placeholder from "../../../StateComponents/Placeholder";
import { howLong } from "../../../../helpers";
const PostFooter = (props) => {
  let me = JSON.parse(localStorage.getItem('userLogin'))
  const { post,alt, c } = props;
  const [isLoading, setLoading] = useState(true)
   // c is for whether to show the comment icon or not
  const [likes, setLikes ]= useState(post.likes.length)
  const [like, reactPost] = useState(post.likes.includes(me.username));
  const [save, savePost] = useState(false);
  const [comment,setComment] = useState(''); // this holds the input text
  const [addAnthorComment,addAnother] = useState(''); // this holds the input text
  const [comments,put] = useState([]); // allover comments 
  const [open, setmodal] = useState(false);
  const [repliedTo, setreply] = useState([])
  const [contextMenu, setContext] = useState({isVisible: false,x: 0,y: 0,items: [],c:''})

  const toggle = e => {
    if(e.target.id==='modal' || e.target.classList.contains('postImg')) setmodal(!open)
  }

  const replied = event => {
    event.preventDefault()
    addComment(true) 
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

  const submitAnthrComment = event => {
	event.preventDefault()
	addComment(false,true)
	addAnother('')
  }
  const addComment = (reply=false,another=false) => {
	let cmt = another? addAnthorComment : reply ? repliedTo : comment
    fetch(`${process.env.REACT_APP_SERVER_URI}/api/post/addComment`,{
      method:'POST',
      headers:headers(),
      body:JSON.stringify({username:post.username,comment:cmt, postID:post._id,reply})
    })
	.then(r=>r.json())
	.then(resp=>{
      if(resp.status)
      setComment('')
	  let data={ 
		type:'comment',
		for: post.username,
		label: post.content??'',
		user : me.username ,
		about:post._id+me.username,
		comment:comment??addAnthorComment
	  }
	  socket.emit('notify', data )
	  getComments(false)
    })
  }
  const updatePost = type => {
    type = type?'unlike':'like'
    reactPost(!like)    
    fetch(`${process.env.REACT_APP_SERVER_URI}/api/post/update`,{
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

  const getComments = (outside=true) => {
    fetch(`${process.env.REACT_APP_SERVER_URI}/api/post/comments/${post._id}`,{
      method:'GET',
      headers:headers()
    }).then(res=>res.json()).then(data=>{
      if(data.length){
        put(data)
      }
	  setTimeout(() => {
		setLoading(false)
	  }, 500);
      if(outside) setmodal(!open)
    }) 
  }

  const remove = _id => {
    fetch(`${process.env.REACT_APP_SERVER_URI}/api/post/comment/delete/${_id}`,{
      method:'DELETE',
      headers:headers()
    }).then(res=>res.json())
	.then(resp=>{
      if(resp.status){
        let temp = comments 
        put(temp.filter(item=>item._id!==_id)) 
      }
    });
  }

  const showReplies=className=>{
	let set = document.getElementsByClassName(className)
	for(let i in set){
		set[i]?.classList?.remove('d-none')
	}
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
    setContext({isVisible : true, x, y ,items,c:'70px'})
  }

  const rem = () => setContext({isVisible : false})

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
		{c && <div className="col-sm-1">
           <svg aria-label="Comment" className="_8-yf5 " color="#262626" fill="#262626" 
           height="22" role="img" viewBox="0 0 48 48" width="24" onClick={getComments}> 
            <path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1  
                2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2  
                1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8  
                1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" 
             fillRule="evenodd"/>  
           </svg>
        </div>}
        {c && (<><div className="col-sm-1">
          <svg aria-label="Share Post" className="_8-yf5 " color="#262626" fill="#262626" 
          height="22" role="img" viewBox="0 0 48 48" width="24"> 
            <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5  
              22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z" /> 
          </svg> 
        </div> 
        <div className="col-sm-7"/>
        <div className="col-sm-2">
          <i className={`fa${save ? '' : 'r'} fa-bookmark`} title={save ? "Unsave" : "Save"}
            onClick={() => savePost(!save)} style={{ fontSize: "24px" }}/>
        </div></>)
		}
      </div>

      {likes ? (<p className="d-flex mt-2">{likes===1? likes+' like': likes+' likes'}</p>) :''}

      <div className={`row ${!likes && 'mt-2'}`} style={{ lineHeight: "4.2px" }}>
        <div className="col-md-12 mt-1 d-flex">
          <b><Link className={'text-dark text-decoration-none'} to={`/profile?user=${post.username}`}
            >{post.username}</Link></b>
          &nbsp;<p>{post.caption??' It is what it is.'} &#128516;</p>
        </div>
        { c && <div className="col-md-12">
          <span className="text-secondary cpo" onClick={getComments}>
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
                &nbsp;<p>{post.caption??' It is what it is.'} &#128516;</p> <br/>
              </div>
				<div className={`card-head`}>
					<form id={`commentForm`} onSubmit={submitAnthrComment}>
						<input placeholder="Add a comment..." className="input" value={addAnthorComment} onChange={e=>addAnother(e.target.value)} />
						<button type="submit" className="btn text-primary">
							Add
						</button>
					</form>
				</div>
              {isLoading ?(
                <Placeholder/>
              ):''}
			 {comments?.length? comments.map((user,ind)=>{
				return (
				  <div key={ind} className={`row mt-3 cpo`} data-index={ind} onContextMenu={onContext}>
					<div className="col-sm-2 rel" data-index={ind} >
						<img data-index={ind}
						src={profile} style={{height:'50px',width:'50px!important'}} className="mx-auto pfpicture" alt=""/> 
					</div>
					<div className={`col-sm-10 user`} style={{lineHeight:'1.3'}} data-index={ind} >
					  <b>{user.from}</b>
					  <p className={`username text-dark`} style={{fontWeight:'500'}} data-index={ind}> 
					  <small data-index={ind}>{user.content}</small><br/> <span className="text-secondary" onClick={()=>ToReply(ind+'_id')}>Reply</span>
					  {user.replies.length?(
  					  	<small className={`mx-2 text-secondary cpo`}
					   	onClick={()=>showReplies(ind+'_replies')}>View replies</small>):''}
					  <small className={`text-secondary mx-5`}>{howLong(user.at)}</small>
					</p>
					<form className="d-none" id={ind+'_id'} onSubmit={replied}>
					  <input type="text" className="form-control" style={{border:0,borderRadius:0,borderBottom:'0.5px solid black'}} onChange={e=>setreply(e.target.value)} /> 
					  <button type="submit" className="btn text-primary">send</button>
					</form>
					{user.replies && (user.replies).map((cmt,index)=>{
					return (<div key={index} className={`row mt-3 d-none ${ind+'_replies'} cpo`}>
							  <div className={`col-sm-2 rel`} >
								<img data-index={index} src={cmt.profile??profile} style={{height:'50px',width:'50px!important'}} className="mx-auto pfpicture" alt=""/> 
							  </div>
							  <div className={`col-sm-10 user`} style={{lineHeight:'1.3'}} >
								<b>{cmt.from}</b>
								<p className={`username text-dark`} style={{fontWeight:'500'}} > 
								<small> {cmt.content} </small> <br/>
								<span className="text-secondary" onClick={()=>ToReply(index+'rep_id')}>Reply</span> 
								</p>
								<form className="d-none" id={index+'rep_id'} onSubmit={replied}>
								  <input type="text" className="form-control" style={{border:0,borderRadius:0,borderBottom:'0.5px solid black'}} onChange={e=>setreply(e.target.value)} /> 
								  <button type="submit" className="btn text-primary">send</button>
								</form>
							  </div>
						  </div> )
						})}
				  </div>
				</div> 
			  )}):(
				 <div className={`col-auto mx-auto aligns-items-center justify-content-center mt-5`}>
					<h3 className={`text-center mt-5`}>No comments yet</h3>
				 </div>
				)}

          </div>
        </div>
        </>
        </Modal>
    </>
  );
};

export default PostFooter;
