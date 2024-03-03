import React, { useEffect, useState } from 'react'
import Modal from '../../Modal';
import ob from '../../../assets/icons/itachi.jpg'
import PostFooter from '../Posts/Components/PostFooter';
import headers from '../../../APIs/Headers';
import profile from '../../../assets/icons/profile.png'
import { howLong } from '../../../helpers';
const Photo = (props) => {
    const post = props.post;
    const [open, setmodal] = useState(false);
    const [state, setState]= useState(false);
    const [src, setsrc]= useState(false);
	const [comment,setComment] = useState(''); // this holds the input text
	const [comments,setComments] = useState([])
	// const [contextMenu, setContext] = useState({isVisible: false,x: 0,y: 0,items: [],c:''})
	const me = JSON.parse(localStorage.getItem('userLogin'))

    const toggle = e => {
      if(e.target.id==='modal' || e.target.classList.contains('postImg')) setmodal(!open)
    }
	const getComments = ()=> {
		fetch(`http://localhost:1901/api/post/comments/${post._id}`,{
			method:'GET',
			headers:headers()
		})
		.then(r=>r.json())
		.then(data=>{
			setComments(data)
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
			setComments(temp) 
		  }
		});
	}
	// const onContext = event => { 
	// 	let user = event.target.dataset.index
	// 	user = comments[user]
	// 	let id = user._id
	// 	let items = [ 
	// 		{label:(<i className='fa fa-trash'/>), class:'text-danger', onClick:()=>remove(id)}
	// 		]
	// 	event.preventDefault()
	// 	const x = event.clientX
	// 	const y = event.clientY + 25
	// 	setContext({isVisible : true, x, y ,items,c:'70px'})
	// }
	// const rem = () => setContext({isVisible : false})
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
		fetch('http://localhost:1901/api/post/addComment',{
		  method:'POST',
		  headers:headers(),
		  body:JSON.stringify({username:post.username,comment, postID:post._id,reply})
		})
		.then(r=>r.json())
		.then(resp=>{
		  if(resp.status)
		  setComment('')
		  getComments()
		})
	}
    useEffect(()=>{},[]);

  return (
    <div className="col-md-4 col-lg-4 col-sm-4 openModal posts-of-logged-in-user" key={post.index} onMouseOver={()=>setState(true)} style={{position:state && 'relative'}}  onMouseLeave={()=>setState(false)}>
        <img className="postImg" key={post.username} onClick={(e)=>{setmodal(!open); putContents(e)}} src={post && post.content} alt="?" data-content={post && post.likes} />
        <div className={`text-center ${!state && 'd-none'} hstack gap-2 mx-4 text-white hovered`}> 
            <i className='fa fa-heart mb-3 fs-5'/>
            <p >{post && post.likes?post.likes.length:0}</p>
        </div>
        <Modal isOpen={open} dimens={{height:500 ,width:920,overflow:'hidden' }} onClose={toggle}>
          <>
          <div className='container d-flex'>
            <div className='col-6' style={{position:'relative'}}>
              <img src={src} className='imgContainer' style={{ height:'-webkit-fill-available',maxHeight:'456px',marginRight:'24px', width:'-webkit-fill-available',objectFit:'contain'}} alt=''/>
            </div>
            <div className='col-6'>
              <div className='col-12 placeholder-glow mt-3 mx-2' style={{position:'relative'}}>
                <PostFooter post={post} alt={{details:false}} c={false} />
				<form id="commentForm" onSubmit={submitComment}>
					<input placeholder="Add a comment..." className="input" value={comment} onChange={e=>setComment(e.target.value)} />
					<button type="submit" className="btn text-primary">
						Add
					</button>
				</form>
                <div className='row comments'>
                  <img src={ob} className='rounded-circle col-1' style={{height:'50px',width:'70px'}} alt='?'/>
                  <p className='col-8'><strong>User.name</strong><br/>Here is some commment; let's see if it wraps</p>
                  <small className='text-secondary'>2 days ago</small>
                </div>
                <hr/>
              </div>
			  <div className={`row mt-3 openchat`} style={{cursor:'pointer'}}>
			  {comments.length ? comments.map((user,index)=>{
              return (
				<div className='d-flex' key={index} style={{marginBottom:'20px',marginLeft:'30px'}}>
                  <div className="col-sm-2" data-index={index} style={{position:"relative"}} onContextMenu={'onContext'}>
                      <img data-index={`${index}`}
                      src={profile} style={{height:'40px',width:'40px!important'}} className="mx-auto pfpicture" alt=""/> 
                  </div>
                  <div className={`col-sm-10 user`} style={{lineHeight:'1.3'}} data-index={index} >
                    <b>{user.from}</b>
                    <p className={`username text-dark`} style={{fontWeight:'500'}} data-index={index}> 
                    <small data-index={index}>{user.content} </small>  
					<small className="text-secondary">{howLong(user.at)}</small> <br/> 
					<span className="text-secondary" onClick={()=>ToReply(index+'_id')}>Reply</span>&nbsp;&nbsp;
					<span className="text-secondary" onClick={()=>showReplies(user._id)}>View replies</span>
                  </p>
                  <form className="d-none" id={`${comments.indexOf(user)+'_id'}`} onSubmit={replied}>
                    <input type="text" className="form-control" style={{border:0,borderRadius:0,borderBottom:'0.5px solid black'}} onChange={e=>setComment(e.target.value)} /> 
                    <button type="submit" className="btn text-primary">send</button>
                  </form>
				  {user.replies && (user.replies).map((cmt,index)=>{
					return (<div key={index} className="row mt-3 d-none" style={{cursor:'pointer'}} id={user._id}>
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
            )}): (<div className="col-12 card-body mx-2">
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
		   </div>)
			  }
              </div> 
            </div>
          </div>
          </>
        </Modal>
    </div>
  )
}

export default Photo