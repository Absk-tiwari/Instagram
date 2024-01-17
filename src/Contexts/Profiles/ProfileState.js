import React from 'react'
import ProfileContext from './ProfileContext';
import pfp from '../../assets/icons/pfp.png';
import headers from '../../APIs/Headers';

const ProfileState = (props) => {
     const getChats = async(username)=>{
        let res = await fetch('http://localhost:1901/api/messages',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({username})
        })

        let data = await res.json();
        let usernames=[];
        data.forEach(ele => {
            usernames.push(ele._id)
        });
        let users =await fetch('http://localhost:1901/api/profile/users',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({users:usernames})
        })
        let userdata = await users.json();
        for(let i=0;i<userdata.length;i++){
            if(userdata[i].username===data[i]._id){
                userdata[i].unread = data[i].unread
                userdata[i].last = data[i].last
                userdata[i].from = data[i].from
                userdata[i].sender = data[i].MessageOfSender
                userdata[i].at = data[i].at
            }
        }
        return userdata
   }

    const profiles = [];

        const LoggedIn = {
            pfp ,
            posts : profiles.length,
            username : 'te.sting8398',
            name : 'Deployment',
            bio : 'Future belongs to those who believe in beauty of their dreams',
            followers:'173',
            following: '98',
            url : '/profile'
        };
 
        const getChatsOf = async(cID) => {
        let res = await fetch('http://localhost:1901/api/messages/of',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({cID})
        })

        let data = await res.json()
        return data;
        }
    const chats = [];

    const searchUser = async (param)=>{
        try{
            let resp = await fetch('http://localhost:1901/api/profile/search',{
                method:'POST',
                headers:headers(),
                body:JSON.stringify({param})
            })
            if(resp){
                return resp.json()
            }
        }catch(e){
            console.log(e.message)
        }
    }

    const updateChat = async(me,username) => {
        let resp = await fetch('http://localhost:1901/api/messages/update',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({me,username})
        })
        return resp.status ? true :false
    }
  return (
    <ProfileContext.Provider value={{profiles, LoggedIn, chats, getChats,getChatsOf,searchUser,updateChat}}>
        {props.children}
    </ProfileContext.Provider>
  )
}

export default ProfileState