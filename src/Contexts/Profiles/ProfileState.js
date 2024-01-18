import React from 'react'
import ProfileContext from './ProfileContext';
import pfp from '../../assets/icons/pfp.png';
import headers from '../../APIs/Headers';
import { useNavigate } from 'react-router';

const ProfileState = (props) => {
    let navigator = useNavigate()
     const getChats = async(username)=>{
        let res = await fetch('http://localhost:1901/api/messages',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({username})
        })

        let data = await res.json();
        let usernames=[];
        data.forEach(ele => {
            let [user1, user2] = ele._id.split('&')
            if(user1===username){
                usernames.push(user2)
            }else{
                usernames.push(user1)
            }
        });
        let users =await fetch('http://localhost:1901/api/profile/users',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({users:usernames})
        })
        let userdata = await users.json();
        for(let i=0;i < userdata.length;i++){
            let [user1, user2] = data[i]._id.split('&')
            let compUser = user1===username?user2:user1
            if(userdata[i].username===compUser){
                userdata[i].read = data[i].read
                userdata[i].last = data[i].last
                userdata[i].from = data[i].from
                userdata[i].sender = data[i].MessageOfSender
                userdata[i].at = data[i].at
            }
        }
        console.log(userdata)
        return userdata
   }

   const updateProfile = async(formData, image) => {
    console.log(formData)
        formData.image = image
        fetch('http://localhost:1901/api/profile/update',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify(formData)
        }).then(res=>{
            if(!res.status){
                throw new Error(res)
            }else{
                localStorage.setItem('userLogin',JSON.stringify(res))
                navigator('/')
                setTimeout(() => window.location.reload(), 4000);
            }
        }).catch(err=>alert(err.message))
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
    <ProfileContext.Provider value={{profiles, LoggedIn, chats, getChats,getChatsOf,searchUser,updateChat, updateProfile}}>
        {props.children}
    </ProfileContext.Provider>
  )
}

export default ProfileState