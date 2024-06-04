import React from 'react'
import ProfileContext from './ProfileContext'; 
import headers from '../../APIs/Headers';
import { useNavigate } from 'react-router';

const ProfileState = (props) => {
    let navigator = useNavigate()
     

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
    <ProfileContext.Provider value={{profiles, chats, getChatsOf,searchUser,updateChat, updateProfile}}>
        {props.children}
    </ProfileContext.Provider>
  )
}

export default ProfileState