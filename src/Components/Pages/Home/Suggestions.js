import React, { useContext } from 'react'
import ProfileRow from '../Posts/Components/ProfileRow';
import ProfileContext from '../../../Contexts/Profiles/ProfileContext';
import pfp from '../../../assets/icons/itachi.jpg';
const Suggestions = () => {
  const context = useContext(ProfileContext)
  const { profiles }= context;
  return (
   <>
     <div className='col-md-3 rightSide'>
        <div className='mt-5 mb-5'>
          <ProfileRow profile={{pfp:pfp,username:'absk.tiwari',url:'',self:true,name:'Abhishek'}}/>
        </div>
        <span id='sug'> Suggested for you </span>
        {
          profiles.map((profile, index )=>{
            return <ProfileRow  key={index} profile={profile}/>
          })
         }
      </div> 
   </>
  )
}

export default Suggestions