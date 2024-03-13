import React, { useContext, useEffect, useState } from 'react'
import ProfileContext from '../../../Contexts/Profiles/ProfileContext'
import Modal from '../../StateComponents/Modal';
import LoadingBar from "react-top-loading-bar";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const ProfileSetting = () => {
  let navigator = useNavigate()
  let user = JSON.parse(localStorage.getItem('userLogin'))
  const [file,setFile] = useState('')
  const {LoggedIn} = useContext(ProfileContext);
  const [open, setmodal] = useState(false);
  const [progress,setProgress] = useState(0)
  const [image,setImage] = useState(user.profile??LoggedIn.pfp)
  const [fields, setFields] = useState({bio: user.bio?? LoggedIn.bio , website:''})
  useEffect(()=>{
    setProgress(100)
  },[])
  const toggleModal = e => {
    if(e.target.id === 'modal' || e.target.classList.includes('openModal')) setmodal(!open)
  }

  const submitFile = event => { 
      var selectedFile = event.target.files[0]
	  setFile(selectedFile)
      var fileReader = new FileReader();

      fileReader.onload = function (e) {
        setImage(e.target.result)
      };

      // Read the file as text, binary, etc. depending on your needs
      fileReader.readAsDataURL(selectedFile); // Change to readAsDataURL f

  }
  
  const handleClick = event => {
    event.preventDefault() 
	let formData = new FormData()
	formData.append('image', file)
	formData.append('bio', fields.bio)
	fetch('http://localhost:1901/api/profile/update',{
		method:'POST',
		headers:{
			'auth-token':localStorage.getItem('token')
		},
		body:formData
	}).then(res=>{
		if(!res.status){
			throw new Error(res)
		}else{
			localStorage.setItem('userLogin',JSON.stringify(res))
			navigator('/')
			toast.success('Profile updated!')
			setTimeout(() => window.location.reload(), 4000);
		}
	}).catch(err=>alert(err.message)) 
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
                    <img src={image} className='rounded-circle img-fluid' style={{height:'10vh',width:'5vw'}} alt='nhi dikha?' />
                </div>
                <div className='col-md-7' style={{lineHeight:'0.5'}}>
                    <p className='text-dark fw-bold px-3 pt-3'>{user.username}</p>
                    <label htmlFor='pfpUpdate' className='fw-bold px-3 text-primary cpo'>Change Profile Photo</label>
                    <input type='file' id='pfpUpdate' className='d-none' onChange={submitFile}/>
                </div>
     
            </div>
        </div>
        <div className='row offset-1 mt-4 '>
            <div className='col-md-12 d-flex' >
                <div className='col-md-1'>
                    <p className='fw-bold pt-2'>Website</p>
                </div>
                <div className='col-md-9 mx-3'>
                    <input type='text' name='website' autoComplete='false' placeholder='Website' className='form-control searchbox' value={fields.website} onChange={(e)=>setFields({...fields,[e.target.name]:e.target.value})} id='website' />
                </div>
            </div>
        </div>
        <div className='row offset-1 mt-4 '>
            <div className='col-md-12 d-flex' >
                <div className='col-md-1'>
                    <p className='fw-bold pt-2'>Bio</p>
                </div>
                <div className='col-md-9 mx-3'>
                    <textarea  autoComplete='false' name='bio' placeholder='Bio' value={fields.bio} onChange={(e)=>setFields({...fields,[e.target.name] : e.target.value})} className='form-control searchbox' id='website' />
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
                    <select type='text' placeholder='Prefer not to say' className='form-control searchbox' onClick={()=>toggleModal} >
                        <option value={''}>choose</option>
                        <option value={'male'}>Male</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div className='row offset-1 mt-4 '>
            <div className='col-md-12 d-flex' >
                <div className='col-md-3'>
                    <button className='btn btn-primary' text={'Submit'} onClick={handleClick} >Save Changes</button>
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