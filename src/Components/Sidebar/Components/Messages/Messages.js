import React, { useContext, useEffect, useRef, useState } from "react";
import ProfileContext from "../../../../Contexts/Profiles/ProfileContext";
import msg from "../../../../assets/icons/messenger.jpg";
import Modal from "../../../Modal";
import Loader from "../../../StateComponents/Loader";
import { socket } from '././../../../../socket';
import Chat from '../Messages/Chat'
import profile from '../../../../assets/icons/profile.png'
const Messages = () => {
  const [selectedUser,setUser] = useState({username:'',name:''})
  const [searchParam, setSearchParam] = useState('');
  const [isLoading, setLoading] = useState(false)
  const [opened, openedChat] = useState(false);
  const {searchUser,getChats} = useContext(ProfileContext);
  const [launch,set] = useState(false)
  const mapref = useRef(null)
  let user = localStorage.getItem('userLogin')
  user = JSON.parse(user)
  // let chats=[];
  const [online , setOnline] = useState(false);
  const [open, setmodal] = useState(false);
  let messages = [];
  const addMessage = (from, content) => {
    !messages.some(msg=> msg.from=== from) && messages.push({from,content})
  }

  let chatt;
  const init = async() => {
    let data =  getChats(user.username)
    return await data.then(res=>{return res})  
  }

 
  socket.on('receive',data=>{
    localStorage.setItem('cstring',data.connectionID)
    let from = data.from
    let content = data.content
    addMessage(from,content)
  })
  
  socket.on('notification',data=>{
    console.log(data)
  }) 
  let onlines=[];
  socket.on('init',data=>{
    setOnline(!online)
    console.log('emit from socekt server..')
    console.log(data)
    for(let it of data){
      onlines.push(it)
    }
  })
  socket.on('flag',()=>setOnline(!online))
  
  // console.log('the chats;',chats)
  useEffect(()=>{
    let resp =  init()
    resp.then(res=>{ 
      chatt = res;
      let html=''
        chatt.forEach(chat => { 
 
            let active = onlines.includes(chat.username);
            html+=`<div class="row mt-3 openchat" style='cursor:pointer' data-username='${chat.username}' data-name='${chat.name}' data-s='${chat.from!==user.username}'>
              <div class="col-sm-2" data-name='${chat.name}' data-username='${chat.username}' style="position:relative" data-s='${chat.from!==user.username}'>
                <img data-name='${chat.name}' data-username='${chat.username}'
                  src='${profile}' style='height:50px' class="mx-auto rounded-circle" alt="" data-s='${chat.from!==user.username}' />
                  <h2 class="${active?'':'d-none'}" style="position:absolute;bottom:0px;left:50px;font-size:xxx-large;color:green;font-weight:900" data-s='${chat.from!==user.username}'>.</h2>
              </div>
              <div class="col-sm-10 chatUser" data-username='${chat.username}' data-name='${chat.name}' data-s='${chat.from!==user.username}'>
                <b data-username='${chat.username}' data-name='${chat.name}' data-s='${chat.from!==user.username}'>${chat.username}</b>
                <p class="username ${chat.unread?'text-dark':'p'}" style='font-weight:${chat.unread && chat.from!==user.username?'700':'p'}' data-s='${chat.from!==user.username}' data-username='${chat.username}' data-name='${chat.name}'>${chat.from==user.username && chat.MessageOfSender? chat.MessageOfSender : chat.last} </p>
              </div>
            </div>`; 
        })
        let el = document.getElementById('user-row-container')
        if(el){
          el.innerHTML = html
        }
        setTimeout(() => {          
          let classes = document.getElementsByClassName('openchat')
          for(let i of classes){
            i.addEventListener('click', openChat)
          }
        }, 2000);
    })
    console.log('rendered')

  },[online])

  
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
    console.log(ele)
    let username = ele.dataset.username
    let name = ele.dataset.name
    let fire = ele.dataset.s
    set(fire)
    openedChat(true); 
    setUser({username,name})
    setmodal(false)
    setSearchParam('')
  }

  
  let results;
  const searchChatUser = e => {
    setLoading(true)
    e.preventDefault();
    console.log(searchParam)
    // setTimeout(() => {
    //   setLoading(false);
    //   setSearchParam('')
    // }, 3000);
    if(searchParam.length>3){
      results= searchUser(searchParam)
    }
    if(results){
        setLoading(false);
        let html=''
        results.then(res=>{
          res.forEach(result=>{
           html += `<div style='height:60px;background-color:#e9ecef;border-radius:10px;width:300px;display:flex;margin-left:60px;margin-top:5px;padding-top:4px' class='open-searched' data-username='${result.username}' data-name='${result.name}'>
              <img src='${profile}' class="mx-3 rounded-circle" style='height:52px' data-username='${result.username}' data-name='${result.name}' alt=""/>
              <div class="d-block" style="" data-username='${result.username}' data-name='${result.username}'>
                <b data-username='${result.username}' data-name='${result.name}'>${result.username}</b> <br/>
                <small data-username='${result.username}' data-name='${result.name}'>${result.name}</small>
              </div>
            </div>`
          })
          document.getElementById('searchChat').innerHTML += html
          
          let classes = document.getElementsByClassName('open-searched')
          if(classes){
            for(let el of classes){
              el.addEventListener('click', openChat)
            }
          }
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
          </div> :  <Chat me={user.username} username={selectedUser.username} name={selectedUser.name} launch={launch}/>
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
            </p>): ''}
          </div>
        </>
      </Modal>
    </>
  );
};

export default Messages;
