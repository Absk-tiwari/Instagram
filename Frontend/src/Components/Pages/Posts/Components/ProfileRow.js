import React  from 'react'
import Button from '../../../StateComponents/Button';
import pfp from '../../../../assets/icons/profile.png'

const ProfileRow = (props) =>{  
  const {profile} = props;
  return (
    <div className='row mx-0 mt-1 my-1 profileRow d-block' >
        <div className='d-flex mt-3'>
       <div className='col-sm-3'>
        <img className='pfpicture' style={{  height: profile.self && '70px', width:profile.self && '70px'}} src={profile.profile??pfp} alt='' />
       </div>
       <div className='col-sm-9 d-flex' >
            <div className='col-sm-8' style={{lineHeight:!profile.self && 1}}>
                <p style={{fontSize:!profile.self && '16px', fontWeight:profile.self && 600 }}>{profile.username}
                    <br/>
                <span id='sug' style={{fontSize:'12px'}}>{profile.name} </span>
                </p>
            </div> 
            <div className='col-sm-4'>
                {  profile.self ?              
                  <button className={'btn-sm btn followingbtn mt-4'} >Log out</button>
                    : <Button text={'Follow'} Class={'followbtn'}  alt={'Following'}/>
                }             
            </div>
       </div>
       </div>
    </div>
  )
}

export default ProfileRow