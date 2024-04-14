import React from 'react'
import ProfileContext from './ProfileContext';
import pfp from '../../assets/icons/profile.png';
import headers from '../../APIs/Headers';
import { useNavigate } from 'react-router';

const ProfileState = (props) => {
    let navigator = useNavigate()
     const getChats = async(me)=>{
        let res = await fetch(process.env.REACT_APP_SERVER_URI+'/api/messages',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({username:me})
        })

        let data = await res.json();
        let usernames=[];
        data.forEach(ele => {
            let [user1, user2] = ele._id.split('&')
            if(user1===me){
                usernames.push(user2)
            }else{
                usernames.push(user1)
            }
        });
        let users =await fetch(process.env.REACT_APP_SERVER_URI+'/api/profile/users',{
            method:'POST',
            headers:headers(),
            body:JSON.stringify({users:usernames})
        })
        let userdata = await users.json();
        for(let item of data){
            let [user1, user2] = item._id.split('&')
            let compUser = user1===me? user2: user1
            for(let user of userdata){
                let foundAt = userdata.indexOf(user)
                if(!userdata[foundAt].hasOwnProperty('read') && userdata[foundAt].username===compUser){
                    userdata[foundAt].read = item.read
                    userdata[foundAt].last = item.last
                    userdata[foundAt].from = item.from
                    userdata[foundAt].sender = item.MessageOfSender
                    userdata[foundAt].at = item.at
                }
            } 
        }
        return userdata
   }

   const updateProfile = async(formData, image) => {
        formData.image = image
        fetch(process.env.REACT_APP_SERVER_URI+'/api/profile/update',{
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
        const  profiles= [] 

        const LoggedIn = {
            pfp ,
            posts :0,
            username : 'te.sting8398',
            name : 'Deployment',
            bio : 'Future belongs to those who believe in beauty of their dreams',
            followers:'173',
            following: '98',
            url : '/profile'
        };
 
        const getChatsOf = async(cID) => {
        let res = await fetch(process.env.REACT_APP_SERVER_URI+'/api/messages/of',{
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
            let resp = await fetch(process.env.REACT_APP_SERVER_URI+'/api/profile/search',{
                method:'POST',
                headers:headers(),
                body:JSON.stringify({param})
            })
            if(resp){
                return resp.json()
            }
        }catch(e){
            return e.message
        }
    }

    const updateChat = async(me,username) => {
        let resp = await fetch(process.env.REACT_APP_SERVER_URI+'/api/messages/update',{
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