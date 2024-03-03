import React, { useContext, useEffect, useRef, useState } from "react";
import ProfileContext from "../../../../Contexts/Profiles/ProfileContext";
import msg from "../../../../assets/icons/messenger.jpg";
import Modal from "../../../Modal";
import Loader from "../../../StateComponents/Loader";
import { socket } from '././../../../../socket';
import Chat from '../Messages/Chat'
import profile from '../../../../assets/icons/profile.png'
import headers from "../../../../APIs/Headers";
import ContextMenu from "../../../StateComponents/ContextMenu";
import { howLong } from "../../../../helpers";

const Messages = () => {
  const [isTyping ,setTyping] = useState([])
  const [totalChats, setChats] = useState([])
  const [selectedUser,setUser] = useState({username:'',name:''})
  const [searchParam, setSearchParam] = useState('');
  const [isLoading, setLoading] = useState(false)
  const [userDetail, setDetail] = useState({})
  const [opened, openedChat] = useState(false);
  const [searched, setResults] = useState([])
  const {getChats} = useContext(ProfileContext);
  const [launch,set] = useState(false)
  const mapref = useRef(null)
  let user = JSON.parse(localStorage.getItem('userLogin'))
  // let chats=[];
  const [change , setchange] = useState(false);
  const [onlines , setOnline] = useState([]);
  const [open, setmodal] = useState(false);
  const [dump, putMessage] = useState([])
  const [contextMenu, setContext] = useState({ isVisible: false, x: 0, y: 0, items: [] })

  const deleteChat = username => {  // handle delete chat
    if(username){
      let me = user.username
      fetch(`http://localhost:1901/api/messages/clear`,{
		method:'POST',
		headers:headers(),
		body:JSON.stringify({me,username})
	  })
	  .then(r=> r.json())
	  .then(res=>{
        if(res.status){
          setChats(totalChats.filter(c=>c.username!==username))
		  if(selectedUser.username===username) openedChat(!opened)
        }
      })
    }
  }
  const block = () => {}

  const onContext = event => {
    event.preventDefault()
	let elem = document.getElementById(event.target.dataset.pick).dataset.detail
	elem = JSON.parse(elem)
    const x = event.clientX - 100
    const y = event.clientY  
    setContext({
      isVisible : true, 
      x, y ,
      items : [
        {label:'Delete', onClick:()=>deleteChat(elem.username)},
        {label:'Block', class:'text-danger', onClick:()=>block(elem.username)}
      ]
    })
  }
  const changeParent = newState => setchange(newState)
  let tillMessages={};

   

  socket.on('flag',()=>setchange(!change))
  socket.on('isTyping', who=>{
    setTyping([...isTyping, who])
    setchange(!change)
  }) 

  socket.on('hasStopped', who => {
    let now = isTyping.filter(them=>them!==who)
    setTyping(now)
  })
  useEffect(()=>{

    socket.on('init',data=>{
      setOnline(data)
    })

	socket.on('receive',data=>{
		let cloned = dump
		cloned[data.from] = data.replaceMsg
		console.log(data)
		putMessage(cloned)
		setchange(!change)
		let og = document.getElementById('msg-badge')
		let added
		if(og.innerHTML){
			let oggy = og.innerHTML 
			let oggyHas = og.dataset.garbage
			if(oggyHas){
				let users = JSON.parse(oggyHas)
				let exists = users.indexOf(data.from) 
				if(exists < 0){
					added = JSON.parse(oggy) + 1
				}
			}
		}else{
			added = 1
		} 
		og.innerHTML=added
		og.classList.remove('d-none')
	  })
    document.addEventListener('click',function(){
        setContext({
          isVisible : false,  
        })
    })
    socket.emit('users')
    const init = async() => {
      let texts = await getChats(user.username)
      return texts  
    }
    let resp = init()
    resp.then(res=>{  
      if(res){
        setChats(res)
        for(let i of res){
          let key = i.username
          let key2 = i.username+'_seen'
          let key3 = i.username+'_last'
          tillMessages[key] = i.last          
          tillMessages[key2] = i.read?' seen '+howLong(i.at):' sent '+howLong(i.at)          
          tillMessages[key3] = i.sender // its the message by sender(anyone)          
        }
        putMessage(tillMessages)     
      } 
    })
	return ()=>{
		socket.off('receive')  
	}
  } ,
[ getChats, user.username])

  
  const toggleModal = e => {   
    if(e.target.id==='modal' || e.target.classList.contains('openModal')) setmodal(!open)
  } 

  const openChat = event => {
    let ele = event.target
	if(ele && ele.dataset.pick){
		let element = document.getElementById(ele.dataset.pick) 
		let data = JSON.parse(element.dataset.detail)
	    let username = data.username
		let name = data.name
		let fire = JSON.parse(element.dataset.s)
		set(fire)
		openedChat(true); 
		let thisUser = totalChats.filter(chat=>chat.username===username)
		if(!thisUser.length){
			let clone = totalChats
			thisUser = searched.filter(chat=>chat.username===username)
			clone.unshift(thisUser[0]) // filtered result is array
			setChats(clone) // this will update the chat list 
		}
		setDetail(thisUser)
		setUser({username,name})
		setmodal(false)
		setSearchParam('')
	}else{
		event.preventDefault() // dont want to see cannot read #~@! of "undefined"
	}
  }

  
  const searchChatUser = e => {
    setLoading(true)
    e.preventDefault();
 
      fetch('http://localhost:1901/api/profile/search',{
                method:'POST',
                headers:headers(),
                body:JSON.stringify({param:searchParam})
      }).then(res=>{
        return res.json()
      }).then(data=>{
        setResults(data)
        setTimeout(()=>setLoading(false),200)
      })
  
 
  }

  return (
    <>
      <ContextMenu {...contextMenu} />
      <div className="page d-flex">
        <div className="col-md-4 user-row" ref={mapref} >
          <div className="hstack gap-5 mt-5">
            <h4 className="text-dark">{user.username}</h4>
            <i className="fa fa-edit fs-2 offset-sm-4 openModal"
              title="write a message" onClick={toggleModal} /> 
          </div>
          <div className="hstack mt-4 mb-3">
            <strong>Messages</strong>
            <strong className="text-secondary offset-5 px-4">Requests</strong>
          </div>
          <div id="user-row-container"> 
          {totalChats && totalChats.map((chatuser,index)=>{
            let active = (onlines && onlines.length) ? onlines.includes(chatuser.username) : false;
            return (
            <div key={index} className={`row mt-3 openchat`} id={chatuser._id} style={{cursor:'pointer'}} data-detail={JSON.stringify(chatuser)} data-s={chatuser.from && chatuser.from!==user.username} onContextMenu={onContext} onClick={openChat} data-pick={chatuser._id}>
              <div className="col-sm-2" style={{position:"relative"}} onClick={openChat}>
                  <img
                  src={chatuser.profile??profile} style={{height:'50px',width:'50px!important'}} className="mx-auto pfpicture" alt="" onClick={openChat} data-pick={chatuser._id}/>
                  <h2 className={active?'online':'d-none'} onClick={openChat} data-pick={chatuser._id}>.</h2>
              </div>
              <div className={`col-sm-10 chatUser`} onClick={openChat} data-pick={chatuser._id}>
                <b onClick={openChat} data-pick={chatuser._id}>{chatuser.username}</b>
                <p className={`username ${chatuser.read?'p':'text-dark'}`} style={{fontWeight:!chatuser.read && chatuser.from!==user.username?'700':'p'}} onClick={openChat} data-pick={chatuser._id}>
					{isTyping.includes(chatuser.username)?'typing...':
					(chatuser.from && chatuser.from===user.username && chatuser.sender? dump[chatuser.username+'_last'] : dump[chatuser.username]??'')} 
					{!isTyping.includes(chatuser.username) && 
					<small onClick={openChat} data-pick={chatuser._id}>
						{(chatuser.from && chatuser.from===user.username)? dump[chatuser.username+'_seen'] :''}
					</small>}
				</p>
              </div>
            </div> 
            )
            })
          }
          </div>
        </div>
        <div className="col-md-8 chat-open-screen">
         { !opened ? <div className="text-center d-flex justify-content-center align-items-center min-vh-100">
            <div className="container text-center d-block">
              <img src={msg} alt="?" className="rounded-circle style" />
              <br />
              <p className="fs-5 pt-4">Your Messages</p>
              <p className="pt-1 text-secondary">
                Send private photos and messages to a friend or group
              </p>
              <button className="btn btn-primary openModal" onClick={toggleModal}>
                Send message
              </button>
            </div>
          </div> :  <Chat me={user.username} userImage={selectedUser.image} username={selectedUser.username} name={selectedUser.name} details={userDetail} launch={launch} till={dump} changeMsg={putMessage} update={changeParent} />
         }
        </div>
      </div>
      <Modal isOpen={open} dimens={{ height: 410, width: 550 }} onClose={toggleModal} >
        <>
          <div className="searchChat" id="searchChat" >
            <p className="text-center fw-bolder">New message</p>
             <hr />
             <div className="hstack">
              <form onSubmit={searchChatUser} className="col-11">
                <input type="text" className="search_in_chat" name="search_in_chat" onChange={(e)=>{setSearchParam(e.target.value);searchChatUser(e)}} autoComplete="off" value={searchParam} placeholder="Search..."/>
              </form>
              {isLoading && <Loader height={46}/>}
            </div>
            <hr />
           {isLoading===true ?
            (<p className="placeholder-glow mb-3 mt-3 mx-2">
              <span className="placeholder col-1" style={{height:'40px',width:'40px',borderRadius:'50%'}}/>&nbsp;
              <span className="placeholder col-3" /><br/>
              <span className="placeholder col-6" />
            </p>):             
            (searchParam && searched.length ? searched.map((user,index)=>{
              return (
              <div className='open-searched' data-s={false} data-pick={user._id} key={index} id={user._id} onClick={openChat} data-detail={JSON.stringify(user)}>
              <img src={user.profile??profile} className="mx-3 pfpicture" data-s={false} data-pick={user._id} onClick={openChat} alt=""/>
              <div className="d-block" data-s='false' data-pick={user._id}onClick={openChat}>
                <b data-pick={user._id} data-s='false' onClick={openChat}>{user.username}</b> <br/>
                <small data-pick={user._id} data-s='false' onClick={openChat}>{user.name}</small>
              </div>
            </div>)
            }):(
             searchParam.length ? ( 
                <b className="mx-3">No results found..</b>  
                ):''
            ))}
          </div>
        </>
      </Modal>
    </>
  );
};

export default Messages;
