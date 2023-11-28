import React  from 'react'
import Button from '../../../StateComponents/Button';

const ProfileRow = (props) =>{  
    const {profile} = props;
  return (
    <div className='row mx-0 mt-1 my-1 profileRow d-block' >
        <div className='d-flex mt-3'>
       <div className='col-sm-3'>
        <img className='pfpicture' style={{  height: profile.self ?'70px':'',width:profile.self ?'70px':''}} src={profile.pfp} alt='not found' />
       </div>
       <div className='col-sm-9 d-flex' >
            <div className='col-sm-8'>
                <p>{profile.username}
                    <br/>
                <span id='sug'>{!profile.self  ? 'Suggested for you':profile.name} </span>
                </p>
            </div> 
            <div className='col-sm-4'>
                {  profile.self ?              
                  <Button text={'Switch'}/>
                    : <Button text={'Follow'} alt={'Following'}/>
                }                  

            </div>
       </div>
       </div>
    </div>
  )
}

export default ProfileRow