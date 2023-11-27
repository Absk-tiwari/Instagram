import React, { useContext, useState } from "react";
import ProfileContext from "../../../Contexts/Profiles/ProfileContext";
import msg from "../../../assets/icons/messenger.jpg";
import Modal from "../../Modal";

const Messages = () => {
  const { chats, LoggedIn } = useContext(ProfileContext);
  const [open, setmodal] = useState(false);
  const toggleModal = e => {   
      if(e.target.id==='modal' || e.target.classList.contains('openModal')) setmodal(!open)
  };

  const style = {
    height: "15%",
    width: "17%",
    border: "2px solid black ",
    borderStyle: "rounded",
  };
  console.log(chats);
  // const inviteUser = () => {

  // }
  return (
    <>
<<<<<<< HEAD
    <div className='container d-flex'>  
      <div className='col-md-4' style={{height:'100vh', overflowY:'scroll', borderRight:'1px solid lightgray'}}>
        <div className='hstack gap-5 mt-5'>
          <h4 className='text-dark'>{LoggedIn.username}</h4>
          <i className='fa fa-edit fs-2 offset-sm-4' title='write a message'></i>
        </div>
        <div className='hstack mt-4 mb-3'>
          <strong>Messages</strong>
          <strong className='text-secondary offset-5 px-4'>Requests</strong>
        </div>
       {chats.length && chats.map(chat => {
        return <div className='row mt-3' key={chat.username}>
                  <div className='col-sm-2'>
                      <img src={chat.pfp} style={{height:'50px'}} className='mx-auto rounded-circle' alt='not?' /></div>
                  <div className='col-sm-10 chatUser'>
                    <strong>{chat.username}</strong>
                    <p>{chat.username}</p>
                  </div>
               </div>
       })} 

      </div>
      <div className='col-md-8' style={{overflowY:'hidden'}}>
        <div className='text-center d-flex justify-content-center align-items-center min-vh-100'>
          <div className='container text-center d-block'>
            <img src={msg} alt='not?' style={style} className='rounded-circle'/>
            <br/>
            <p className='fs-5 pt-4'>Your Messages</p>
            <p className='pt-1 text-secondary'>Send private photos and messages to a friend or group</p>
            <button className='btn btn-primary openModal' onClick={toggleModal}>Send message</button>
          </div>
        </div>'
      </div>
    </div>
    <Modal isOpen={open} dimens={{ height: 410, width: 550 }} onClose={toggleModal} >
            <>
            <div className='searchChat'>
              <p className="text-center fw-bolder">New message</p>
              <hr/>
              <input type='text' className='search_in_chat' name='search_in_chat' placeholder='Search...' />
              <hr/>
=======
      <div className="container d-flex">
        <div
          className="col-md-4"
          style={{
            height: "100vh",
            overflowY: "scroll",
            borderRight: "1px solid lightgray",
          }}
        >
          <div className="hstack gap-5 mt-5">
            <h4 className="text-dark">{LoggedIn.username}</h4>
            <i
              className="fa fa-edit fs-2 offset-sm-4"
              title="write a message"
            ></i>
          </div>
          <div className="hstack mt-4 mb-3">
            <strong>Messages</strong>
            <strong className="text-secondary offset-5 px-4">Requests</strong>
          </div>
          {chats.length &&
            chats.map((chat) => {
              return (
                <div className="row mt-3" key={chat.username}>
                  <div className="col-sm-2">
                    <img
                      src={chat.pfp}
                      style={{ height: "50px" }}
                      className="mx-auto rounded-circle"
                      alt="not?"
                    />
                  </div>
                  <div className="col-sm-10 chatUser">
                    <strong>{chat.username}</strong>
                    <p>{chat.username}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="col-md-8" style={{ overflowY: "hidden" }}>
          <div className="text-center d-flex justify-content-center align-items-center min-vh-100">
            <div className="container text-center d-block">
              <img
                src={msg}
                alt="not?"
                style={style}
                className="rounded-circle"
              />
              <br />
              <p className="fs-5 pt-4">Your Messages</p>
              <p className="pt-1 text-secondary">
                Send private photos and messages to a friend or group
              </p>
              <button className="btn btn-primary" onClick={toggleModal}>
                Send message
              </button>
>>>>>>> af5a25ac0882fd17d472153d71acb09b46bce6dc
            </div>
          </div>
          '
        </div>
      </div>
      <Modal
        isOpen={open}
        dimens={{ height: 410, width: 550 }}
        onClose={toggleModal}
      >
        <>
          <div className="searchChat">
            <p className="text-center fw-bolder">New message</p>
            <hr />
            <input
              type="text"
              className="search_in_chat"
              name="search_in_chat"
              placeholder="Search..."
            />
            <hr />
          </div>
        </>
      </Modal>
    </>
  );
};

export default Messages;
