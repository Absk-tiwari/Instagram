import React from 'react'
import ProfileContext from './ProfileContext';
import pfp from '../../assets/icons/pfp.png';

const ProfileState = (props) => {
    const profiles = [
        {
            pfp : pfp,
            username : 'testing.user',
            url : ''
        },
        {
            pfp : pfp,
            username : 'testing.user2',
            url : ''
        },
        {
            pfp : pfp,
            username : 'testing.user3',
            url : ''
        },
        {
            pfp : pfp,
            username : 'testing.user4',
            url : ''
        },
    ]
    
  return (
    <ProfileContext.Provider value={profiles}>
        {props.children}
    </ProfileContext.Provider>
  )
}

export default ProfileState