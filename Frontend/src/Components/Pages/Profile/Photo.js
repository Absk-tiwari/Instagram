import React, { useEffect, useState } from 'react'
import Modal from '../../StateComponents/Modal'; 
import PostFooter from '../Posts/Components/PostFooter';
import profile from '../../../assets/icons/profile.png'
import { howLong } from '../../../helpers';
import Placeholder from '../../StateComponents/Placeholder'; 
import axios from 'axios';
const Photo = (props) => {
	const isPhone = window.screen.width < 500 
    const post = props.post;
    const [open, setmodal] = useState(false);
    const [state, setState]= useState(false);
    const [src, setsrc]= useState(false);
	const [comment,setComment] = useState(''); // this holds the input text
	const [comments,setComments] = useState([])
	const [isLoading, setLoading] = useState(true)
	// const [contextMenu, setContext] = useState({isVisible: false,x: 0,y: 0,items: [],c:''})
	const me = JSON.parse(localStorage.getItem('userLogin'))

    const toggle = e => {
      if(e.target.id==='modal' || e.target.classList.contains('postImg')) setmodal(!open)
    }
	const getComments = ()=> {
		axios.get(`/post/comments/${post._id}`)
		.then(({data})=>{
			setComments(data)
			setTimeout(() => {
				setLoading(false)
			}, 300);
		})
	}
  
	const putContents = e =>{
		setsrc(e.target.currentSrc) 
		if(open===false){
			getComments()
		}
	}

	const replied = event => {
		event.preventDefault()
		addComment(true)
		let mine = me.username
		let obj ={}
		obj[mine]= [{profile:me.profile,content:comment, username:me.username}]
		setComment('')
		document.getElementById(event.target.id).classList.add('d-none') 
	}

	const ToReply = id => document.getElementById(id).classList.remove('d-none') 
	const showReplies = id => document.getElementById(id)?.classList?.remove('d-none')

	const submitComment = event => {
		event.preventDefault()
		addComment()
	}

	const addComment = (reply=false) => {
		axios.post('/post/addComment',{
			username:post.username,
			comment, 
			postID:post._id,
			reply 
		})
		.then(({data})=>{
		  if(data.status)
		  setComment('')
		  getComments()
		})
	}
    useEffect(()=>{},[]);

  return (
    <div className={`col-md-4 col-lg-4 col-sm-4 openModal posts-of-logged-in-user ${state?'rel':''}`} key={post.index} onMouseOver={()=>setState(true)} onMouseLeave={()=>setState(false)}>
        <img className={`postImg`} key={post.username}
		 onClick={e=>{setmodal(!open); putContents(e)}}
		 src={post && post.content} alt={``}
		 data-content={post && post.likes} 
		/>
        <div className={`text-center ${!state && 'd-none'} hstack gap-2 mx-4 text-white hovered`}> 
            <i className={`fa fa-heart mb-3 fs-5`}/>
            <p >{post && post.likes?post.likes.length:0}</p>
        </div>
        <Modal isOpen={open} dimens={{height:500 ,width:920 }} onClose={toggle}>
          <>
          <div className='container d-flex'>
            <div className={isPhone?'col-12 rel text-center':'col-6 rel'}>
              <img src={src} className='imgContainer' style={{ height:'-webkit-fill-available',maxHeight:'456px',marginRight:isPhone?'':'24px', width:'-webkit-fill-available',objectFit:'contain'}} alt=''/>
            </div>
            <div className={isPhone?'col-12':'col-6'} >
              <div className='col-12 placeholder-glow mt-3 mx-2 rel' >
                <PostFooter post={post} alt={{details:false}} c={false} />
				<form id="commentForm" onSubmit={submitComment}>
					<input placeholder="Add a comment..." className="input" value={comment}
					 onChange={e=>setComment(e.target.value)} />
					<button type="submit" className="btn text-primary">
						Add
					</button>
				</form>
                 
                <hr/>
              </div>
			  <div className={`row mt-3 openchat cpo`} style={{height:'300px'}}>
			  {isLoading ? <Placeholder/> :
			  comments?.length ? comments.map((user,index)=>{
              return (
				<div className='d-flex' key={index} style={{marginBottom:'20px',marginLeft:'30px'}}>
                  <div className="col-sm-2 rel" data-index={index} >
                      <img data-index={index}
                      src={profile} style={{height:'40px',width:'40px!important'}} className={`mx-auto pfpicture`} alt={``}/> 
                  </div>
                  <div className={`col-sm-10 user`} style={{lineHeight:'1.3'}} data-index={index} >
                    <b>{user.from}</b>
                    <p className={`username text-dark`} style={{fontWeight:'500'}} data-index={index}> 
                    <small data-index={index}>{user.content} </small>  
					<small className={`text-secondary`}>{howLong(user.at)}</small> <br/> 
					<span className={`text-secondary`} onClick={()=>ToReply(index+'_id')}>Reply</span>&nbsp;&nbsp;
					{user.replies.length?(<span className={`text-secondary`} onClick={()=>showReplies(user._id)}>View replies</span>):''}
                  </p>
                  <form className={`d-none`} id={`${comments.indexOf(user)+'_id'}`} onSubmit={replied}>
                    <input 
						type="text" 
						className="form-control"
						style={{border:0,borderRadius:0,borderBottom:'0.5px solid black'}}
						onChange={e=>setComment(e.target.value)} 
					/> 
                    <button type="submit" className={`btn text-primary`}> send </button>
                  </form>
				  {user.replies && (user.replies).map((cmt,index)=>{
					return (<div key={index} className="row mt-3 d-none cpo" id={user._id}>
                            <div className="col-sm-2" >
                              <img data-index={`${index}`} src={cmt.profile??profile} style={{height:'35px',width:'35px!important'}} className="mx-auto pfpicture" alt=""/> 
                            </div>
                            <div className={`col-sm-10 user`} style={{lineHeight:'1.3'}} >
                              <b>{cmt.from}</b>
                              <p className={`username text-dark`} style={{fontWeight:'500'}} > 
							  <small> {cmt.content} </small> <br/>
							  <span className="text-secondary" onClick={()=>ToReply(index+'rep_id')}>Reply</span> 
                              </p>
							  <form className="d-none" id={index+'rep_id'} onSubmit={replied}>
								<input type="text" className="form-control" style={{border:0,borderRadius:0,borderBottom:'0.5px solid black'}} onChange={e=>setComment(e.target.value)} /> 
								<button type="submit" className="btn text-primary">send</button>
							  </form>
							</div>
                        </div> )
                  	})}
                	</div>
                </div>
            )}): <div className={`text-center`}>No Comments</div>}
              </div> 
            </div>
          </div>
          </>
        </Modal>
    </div>
  )
}

export default Photo