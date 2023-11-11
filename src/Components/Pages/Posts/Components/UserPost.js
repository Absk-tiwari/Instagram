import React from 'react';
import {  Link  } from 'react-router-dom';

//eslint-disable-next-line
import ProfileData from '../../DataContainer(notInUse)/ProfileData';

const UserPost = (props) => {
  const {pfp, username ,posted,location} = props.post;
  return (
    <>
      <div className='col-sm-2'>
        <img className='userPost' src={pfp} alt='not yet' />
      </div>
      <div className='col-sm-8 pt-2'>
        <Link style={{textDecoration:'none',color:'black'}} to={`/profile?username=${username}`}><b>{username}</b></Link>
        <small className='text-secondary mx-2'>{posted}</small><br/>
        <small className='mb-2'>{location}</small>
      </div>
      <div className='col-sm-1 mx-3 pt-2' > 
        <i className='fa fa-ellipsis-h'/>
      </div>
    </>
  )
}

export default UserPost