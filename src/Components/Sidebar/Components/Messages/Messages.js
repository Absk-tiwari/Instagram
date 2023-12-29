import React, { useContext,   useState } from "react";
import ProfileContext from "../../../../Contexts/Profiles/ProfileContext";
import msg from "../../../../assets/icons/messenger.jpg";
import Modal from "../../../Modal";
import Loader from "../../../StateComponents/Loader";
import Chat from "./Chat";

const Messages = () => {
  const { chats, LoggedIn } = useContext(ProfileContext);
  const [isLoading, setLoading] = useState(false)
  const [searchParam, setSearchParam] = useState('');
  const [open, setmodal] = useState(false);
  const [opened, openedChat] = useState(false);
  const toggleModal = e => {   
      console.log((e.target.id)) 
      if(e.target.id==='modal' || e.target.classList.contains('openModal')) setmodal(!open)
  };

  const [selectedUser,setUser] = useState('')

  // useEffect(()=>{
  //   console.log('clicked')
  // },[selectedUser])
  const style = {
    height: "15%",
    width: "17%",
    border: "2px solid black ",
    borderStyle: "rounded",
  }; 

  const openChat = e => {
    let ele = e.target
    let username = ele.dataset.username
    openedChat(true); 
    setUser(username)
  }
  const searchChatUser = e => {
    setLoading(true)
    e.preventDefault();
    console.log(searchParam)
    setTimeout(() => {
      setLoading(false);
      setSearchParam('')
    }, 3000);
  }
  return (
    <>
      <div className="page d-flex">
        <div
          className="col-md-4 user-row"
          style={{
            height: "100vh",
            overflowY: "scroll",
            borderRight: "1px solid lightgray",
          }}
        >
          <div className="hstack gap-5 mt-5">
            <h4 className="text-dark">{LoggedIn.username}</h4>
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
            chats.map((chat) => {
              return (
                <div className="row mt-3" style={{cursor:'pointer'}} onClick={openChat} data-username={chat.username} key={chat.username}>
                  <div className="col-sm-2" data-username={chat.username}>
                    <img
                      src={chat.pfp} style={{ height: "50px" }} className="mx-auto rounded-circle" alt="?"
                    />
                  </div>
                  <div className="col-sm-10 chatUser" data-username={chat.username}>
                    <strong data-username={chat.username}>{chat.username}</strong>
                    <p className="username" data-username={chat.username}>{chat.username}</p>
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
          </div> :  <Chat username={selectedUser}/>
         }
        </div>
      </div>
      <Modal isOpen={open} dimens={{ height: 410, width: 550 }} onClose={toggleModal} >
        <>
          <div className="searchChat " >
            <p className="text-center fw-bolder">New message</p>
             <hr />
             <div className="hstack">
              <form onSubmit={searchChatUser} className="col-11">
                <input type="text" className="search_in_chat" name="search_in_chat" onChange={(e)=>setSearchParam(e.target.value)} value={searchParam} placeholder="Search..."/>
              </form>
              {isLoading && <Loader height={46}/>}
            </div>
            <hr />
           {isLoading && <p className="placeholder-glow mb-3 mt-3 mx-2">
              <span className="placeholder col-1" style={{height:'40px',width:'40px',borderRadius:'50%'}}></span>&nbsp;
              <span className="placeholder col-3"></span> <br/>
              <span className="placeholder col-6"></span>
            </p>}
          </div>
        </>
      </Modal>
    </>
  );
};

export default Messages;
