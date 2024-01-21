import React, { useContext, useEffect, useRef, useState } from "react";
import ProfileContext from "../../../../Contexts/Profiles/ProfileContext";
import msg from "../../../../assets/icons/messenger.jpg";
import Modal from "../../../Modal";
import Loader from "../../../StateComponents/Loader";
import { socket } from '././../../../../socket';
import Chat from '../Messages/Chat'
import profile from '../../../../assets/icons/profile.png'
import headers from "../../../../APIs/Headers";
const Messages = () => {
  const [selectedUser,setUser] = useState({username:'',name:''})
  const [searchParam, setSearchParam] = useState('');
  const [isLoading, setLoading] = useState(false)
  const [userDetail, setDetail] = useState({})
  const [opened, openedChat] = useState(false);
  const [searched, setResults] = useState([])
  const {searchUser,getChats} = useContext(ProfileContext);
  const [launch,set] = useState(false)
  const mapref = useRef(null)
  let user = localStorage.getItem('userLogin')
  user = JSON.parse(user)
  // let chats=[];
  const [change , setchange] = useState(false);
  const [open, setmodal] = useState(false);

  const changeParent = newState => {
    setchange(newState)
  }
  var totalUsers=[]
 
  socket.on('receive',data=>{
    setchange(!change)
  })
  

  let onlines=[];
  socket.on('init',data=>{
    setchange(!change)
    for(let it of data){
      onlines.push(it)
    }
  })
  socket.on('flag',()=>    setchange(!change)
)
  
  // console.log('the chats;',chats)
  useEffect(()=>{
    const init = async() => {
      let data = await getChats(user.username)
      return data  
    }
    let resp = init()
    resp.then(res=>{ 

      let html=''
      if(!res){
        console.log('should you be here?')
      }else{
        res.forEach(chat => { 
          totalUsers[chat.username]=chat
            let active = (onlines && onlines.length) ? onlines[0].includes(chat.username) : false;
            html+=`<div class="row mt-3 openchat" style='cursor:pointer' data-username='${chat.username}' data-name='${chat.name}' data-s='${chat.from!==user.username}'>
              <div class="col-sm-2" data-name='${chat.name}' data-username='${chat.username}' style="position:relative" data-s='${chat.from!==user.username}'>
                <img data-name='${chat.name}' data-username='${chat.username}'
                  src='${chat.profile??profile}' style='height:50px;width:50px!important' class="mx-auto rounded-circle" alt="" data-s='${chat.from!==user.username}' />
                  <h2 class="${active?'':'d-none'}" style="position:absolute;bottom:0px;left:50px;font-size:xxx-large;color:green;font-weight:900" data-s='${chat.from!==user.username}'>.</h2>
              </div>
              <div class="col-sm-10 chatUser" data-username='${chat.username}' data-name='${chat.name}' data-s='${chat.from!==user.username}'>
                <b data-username='${chat.username}' data-name='${chat.name}' data-s='${chat.from!==user.username}'>${chat.username}</b>
                <p class="username ${chat.read?'p':'text-dark'}" style='font-weight:${!chat.read && chat.from!==user.username?'700':'p'}' data-s='${chat.from!==user.username}' data-username='${chat.username}' data-name='${chat.name}'>${chat.from===user.username && chat.sender? chat.sender : chat.last} 
                <small>${(chat.from===user.username)? (chat.read ? 'seen 2h ago' : 'sent 2h ago' ) :'2h'}</small></p>
              </div>
            </div>`; 
            console.log(chat.from, chat)
      })

      setTimeout(() => {          
          let el = document.getElementById('user-row-container')
          if(el){
            el.innerHTML = html
          }
          let classes = document.getElementsByClassName('openchat')
          for(let i of classes){
            i.addEventListener('click', openChat)
          }
        }, 2000);
      }
    })
    console.log('rendered')

  } ,
[change, onlines, user.username])

  
  const toggleModal = e => {   
    if(e.target.id==='modal' || e.target.classList.contains('openModal')) setmodal(!open)
  } 

  const style = {
    height: "15%",
    width: "17%",
    border: "2px solid black ",
    borderStyle: "rounded",
  }; 

  const openChat = event => {
    let ele = event.target
    let username = ele.dataset.username
    let name = ele.dataset.name
    let fire =  JSON.parse(ele.dataset.s)
    set(fire)
    openedChat(true); 
    setDetail(totalUsers[username])
    setUser({username,name})
    setmodal(false)
    setSearchParam('')
  }

  
  const searchChatUser = e => {
    setLoading(true)
    e.preventDefault();
  
    if(searchParam.length > 3){
      fetch('http://192.168.119.154:1901/api/profile/search',{
                method:'POST',
                headers:headers(),
                body:JSON.stringify({param:searchParam})
      }).then(res=>{
        return res.json()
      }).then(data=>{
        setResults(data)
        console.log(data)
        setTimeout(()=>setLoading(false),2000)
      })
    }
 
  }

  return (
    <>
      <div className="page d-flex">
        <div
          className="col-md-4 user-row" ref={mapref} 
          style={{height: "100vh",overflowY: "scroll",borderRight: "1px solid lightgray"}}
        >
          <div className="hstack gap-5 mt-5">
            <h4 className="text-dark">{user.username}</h4>
            <i
              className="fa fa-edit fs-2 offset-sm-4 openModal"
              title="write a message " onClick={toggleModal}
            ></i>
          </div>
          <div className="hstack mt-4 mb-3">
            <strong>Messages</strong>
            <strong className="text-secondary offset-5 px-4">Requests</strong>
          </div>
          <div id="user-row-container"/>
        </div>
        <div className="col-md-8 chat-open-screen" style={{ overflowY: "hidden" }}>
         { !opened ? <div className="text-center d-flex justify-content-center align-items-center min-vh-100">
            <div className="container text-center d-block">
              <img src={msg} alt="?" style={style} className="rounded-circle" />
              <br />
              <p className="fs-5 pt-4">Your Messages</p>
              <p className="pt-1 text-secondary">
                Send private photos and messages to a friend or group
              </p>
              <button className="btn btn-primary openModal" onClick={toggleModal}>
                Send message
              </button>
            </div>
          </div> :  <Chat me={user.username} userImage={selectedUser.image} username={selectedUser.username} name={selectedUser.name} details={userDetail} launch={launch} update={changeParent} />
         }
        </div>
      </div>
      <Modal isOpen={open} dimens={{ height: 410, width: 550 }} onClose={toggleModal} >
        <>
          <div className="searchChat " id="searchChat" >
            <p className="text-center fw-bolder">New message</p>
             <hr />
             <div className="hstack">
              <form onSubmit={searchChatUser} className="col-11">
                <input type="text" className="search_in_chat" name="search_in_chat" onChange={(e)=>{setSearchParam(e.target.value);searchChatUser(e)}} value={searchParam} placeholder="Search..."/>
              </form>
              {isLoading && <Loader height={46}/>}
            </div>
            <hr />
           {isLoading===true ?
            (<p className="placeholder-glow mb-3 mt-3 mx-2">
              <span className="placeholder col-1" style={{height:'40px',width:'40px',borderRadius:'50%'}}></span>&nbsp;
              <span className="placeholder col-3"></span> <br/>
              <span className="placeholder col-6"></span>
            </p>):             
            (searchParam && searched.length ? searched.map((user,index)=>{
              return (<div style={{height:"60px",backgroundColor:"#e9ecef",borderRadius:'10px',width:'300px',display:'flex',marginLeft:'60px',marginTop:'5px',paddingTop:'4px'}} className='open-searched' data-s={false} data-username={user.username} key={index} data-name={user.name} onClick={openChat}>
              <img src={user.profile??profile} class="mx-3 pfpicture" data-s={false} data-username={user.username} data-name={user.name} onClick={openChat} alt=""/>
              <div class="d-block" data-username={user.username} data-s='false' data-name={user.username} onClick={openChat}>
                <b data-username={user.username} data-name={user.name} data-s='false' onClick={openChat}>{user.username}</b> <br/>
                <small data-username={user.username} data-name={user.name} data-s='false' onClick={openChat}>{user.name}</small>
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
