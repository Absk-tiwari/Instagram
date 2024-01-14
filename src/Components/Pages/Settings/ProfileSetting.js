import React, { useContext, useEffect, useState } from 'react'
import ProfileContext from '../../../Contexts/Profiles/ProfileContext'
import Button from '../../StateComponents/Button';
import Modal from '../../Modal';
import LoadingBar from "react-top-loading-bar";

const ProfileSetting = () => {
  let user = localStorage.getItem('userLogin')
  user = JSON.parse(user)
  const {LoggedIn} = useContext(ProfileContext);
  const [open, setmodal] = useState(false);
  const [progress,setProgress] = useState(0)
  const [fields, setFields] = useState({bio:LoggedIn.bio})
  useEffect(()=>{
    setProgress(100)
  },[])
  const toggleModal = e => {
    if(e.target.id === 'modal' || e.target.classList.includes('openModal')) setmodal(!open)
  }

  return (
    <>
   <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)}/>
    <div className='container mt-4 d-flex' style={{ flexDirection:'column' }}>
        <div className='row offset-1 mt-3 mb-3'>
            <h2 className='fw-bold'>Edit Profile</h2>
        </div>
        <form>

        <div className='row offset-1 mt-2'>
            <div className='col-md-12 d-flex'>
                <div className='col-md-1'>
                    <img src={LoggedIn.pfp} className='rounded-circle img-fluid' style={{height:'10vh',width:'5vw'}} alt='nhi dikha?' />
                </div>
                <div className='col-md-7' style={{lineHeight:'0.5'}}>
                    <p className='text-dark fw-bold px-3 pt-3'>{user.username}</p>
                    <label htmlFor='pfpUpdate' className='fw-bold px-3 text-primary'>Change Profile Photo</label>
                    <input type='file' id='pfpUpdate' className='d-none' />
                </div>
     
            </div>
        </div>
        <div className='row offset-1 mt-4 '>
            <div className='col-md-12 d-flex' >
                <div className='col-md-1'>
                    <p className='fw-bold pt-2'>Website</p>
                </div>
                <div className='col-md-9 mx-3'>
                    <input type='text' autoComplete='false' placeholder='Website' className='form-control searchbox' id='website' />
                </div>
            </div>
        </div>
        <div className='row offset-1 mt-4 '>
            <div className='col-md-12 d-flex' >
                <div className='col-md-1'>
                    <p className='fw-bold pt-2'>Bio</p>
                </div>
                <div className='col-md-9 mx-3'>
                    <textarea  autoComplete='false' name='bio' placeholder='Bio' value={fields.bio} onChange={(e)=>setFields([...e.target.name] , e.target.value)} className='form-control searchbox' id='website' />
                    <small >{LoggedIn.bio.length} / 150 characters</small>
                </div>
            </div>
        </div>
        <div className='row offset-1 mt-4 '>
            <div className='col-md-12 d-flex' >
                <div className='col-md-1'>
                    <p className='fw-bold pt-2'>Gender</p>
                </div>
                <div className='col-md-9 mx-3'>
                    <input type='text' placeholder='Prefer not to say' className='form-control searchbox' onClick={()=>toggleModal} />
                </div>
            </div>
        </div>
        
        <div className='row offset-1 mt-4 '>
            <div className='col-md-12 d-flex' >
                <div className='col-md-1'>
                    <Button text={'Submit'}  Class={'bg-primary'} Size={'col-md-12'}/>
                </div>
            </div>
        </div>
        </form>
    </div>
    <Modal isOpen={open} onClose={toggleModal}>
        <div className='container'>
        </div>
    </Modal>
    </>
  )
}

export default ProfileSetting