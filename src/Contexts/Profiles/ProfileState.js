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
        return await users.json();
   }

    const profiles = [
        {
            pfp : pfp,
            username : 'testing.user',
            url : '',
            name : 'Mr.Testing'
        },
        {
            pfp : pfp,
            username : 'testing.user2',
            url : '',
            name : 'Mr.Testing'
        },
        {
            pfp : pfp,
            username : 'testing.user3',
            url : '',
            name : 'Mr.Testing'
        },
        {
            pfp : pfp,
            username : 'testing.user4',
            url : '',
            name : 'Mr.Testing'
        },
        {
            pfp : pfp,
            username : 'testing.user5',
            url : 'hastings',
            name : 'Mr.Testings'
        },
    ];

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
    const chats = [
        {
            pfp : pfp,
            username : 'te.sting8398',
            url : '',
            name : 'Deployment'
        },
        {
            pfp : pfp,
            username : 'absk.tiwari',
            url : '',
            name : 'Abhishek'
        }
    ];

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

  return (
    <ProfileContext.Provider value={{profiles, LoggedIn, chats, getChats,getChatsOf,searchUser}}>
        {props.children}
    </ProfileContext.Provider>
  )
}

export default ProfileState