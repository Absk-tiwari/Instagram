import React, { useContext, useEffect, useState } from "react";
import ProfileContext from "../../../../Contexts/Profiles/ProfileContext";
import msg from "../../../../assets/icons/messenger.jpg";
import Modal from "../../../Modal";
import Loader from "../../../StateComponents/Loader";
import { socket } from '././../../../../socket';
import Chat from '../Messages/Chat'
import obito from '../../../../assets/icons/obito.jpg'
const Messages = () => {
  const [selectedUser,setUser] = useState({username:'',name:''})
  const [searchParam, setSearchParam] = useState('');
  const [isLoading, setLoading] = useState(false)
  const [opened, openedChat] = useState(false);
  const {chats,searchUser} = useContext(ProfileContext);
  let user = localStorage.getItem('userLogin')
  user = JSON.parse(user)
  // let chats=[];
  const [open, setmodal] = useState(false);
  const [chatLen, setLen] = useState(false)
  let messages = [];
  const addMessage = (from, content) => {
    !messages.some(msg=> msg.from=== from) && messages.push({from,content})
  }

  // const init = async() => {
  //   let chats = await getChats(user.username)
  //   if(chats.length){
  //     setLen(true)
  //     let c = chats.map(c=>{return c.name})
  //     console.log(c)
  //   }
  // }
 
  socket.on('receive',data=>{
    localStorage.setItem('cstring',data.connectionID)
    let from = data.from
    let content = data.content
    addMessage(from,content)
  })
  
  socket.on('notification',data=>{
    console.log(data)
  }) 
  
  // console.log('the chats;',chats)
  useEffect(()=>{
    socket.on('init',data=>{
      console.log('called from socket behaviour..')
      console.log(data)
    })
  },[chatLen])

  
  const toggleModal = e => {   
    if(e.target.id==='modal' || e.target.classList.contains('openModal')) setmodal(!open)
  } 

  const style = {
    height: "15%",
    width: "17%",
    border: "2px solid black ",
    borderStyle: "rounded",
  }; 

  const openChat = e => {
    let ele = e.target
    let username = ele.dataset.username
    let name = ele.dataset.name
    openedChat(true); 
    setUser({username,name})
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
    if(searchParam.length>4){
      results= searchUser(searchParam)
    }
    if(results){
        setLoading(false);
        setLen(true)
        results.then(res=>{
          let html = res.map((result,index)=>{
            return `<div style='height:60px;background-color:#e9ecef;border-radius:10px;width:300px;display:flex;margin-left:60px;margin-top:5px;padding-top:4px' onclick="openChat(event)" data-username='${result.username}' data-name='${result.name}'>
              <img src='${obito}' class="mx-3 rounded-circle" style='height:52px' data-username='${result.username}' data-name='${result.name}' alt=""/>
              <div class="d-block" style="" data-username='${result.username}' data-name='${result.username}'>
                <b data-username='${result.username}' data-name='${result.name}'>${result.username}</b> <br/>
                <small data-username='${result.username}' data-name='${result.name}'>${result.name}</small>
              </div>
            </div>`
          })
          document.getElementById('searchChat').innerHTML += html.join('')
        })
    }
  }

  return (
    <>
      <div className="page d-flex">
        <div
          className="col-md-4 user-row"
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
          {chats.length &&
            chats.map((chat,index) => {
              return (
                <div className="row mt-3" style={{cursor:'pointer'}} onClick={openChat} data-username={chat.username} data-name={chat.name} key={index}>
                  <div className="col-sm-2" data-name={chat.name} data-username={chat.username}>
                    <img data-name={chat.name} data-username={chat.username}
                      src={chat.pfp} style={{height:"50px"}} className="mx-auto rounded-circle" alt=""
                    />
                  </div>
                  <div className="col-sm-10 chatUser" data-username={chat.username} data-name={chat.name}>
                    <strong data-username={chat.username} data-name={chat.name} >{chat.username}</strong>
                    <p className="username" data-username={chat.username} data-name={chat.name}>{chat.username}</p>
                  </div>
                </div>
              );
            })}
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
          </div> :  <Chat me={user.username} username={selectedUser.username} name={selectedUser.name}/>
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
