import React from 'react'
import ProfileContext from './ProfileContext';
import pfp from '../../assets/icons/pfp.png';

const ProfileState = (props) => {
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
    ];

    const LoggedIn = {
            pfp ,
            username : 'te.sting8398',
            name : 'Deployment',
            bio : 'Future belongs to those who believe in beauty of their dreams',
            followers:'173',
            following: '98',
            url : '/profile'
        };
     
        const chats = [
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
            }
        ]
    
  return (
    <ProfileContext.Provider value={{profiles, LoggedIn, chats}}>
        {props.children}
    </ProfileContext.Provider>
  )
}

export default ProfileState