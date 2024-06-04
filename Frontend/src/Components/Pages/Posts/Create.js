import React, { useEffect, useState } from 'react'
import {toast} from '../../../toast'
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux'; 
import Loader from '../../StateComponents/Loader'
import axios from 'axios';
const Create = () => {
  const post = useSelector(state=> state.image.imageURL) 
  const navigator = useNavigate()
  const [orgPost, setPost] = useState('')
  const [fields, setfields] = useState({caption : '', location:''})
  const [isLoading, setLoading] = useState(false)

  useEffect(()=>{
	  try{
    var fileReader = new FileReader()
    fileReader.onload = e=>setPost(e.target.result) 
    fileReader.readAsDataURL(post); // Change to readAsDataURL  
    //console.log(typeof post, post)
	  }catch(err){
		toast('Something went wrong')
		return navigator('/')	  
	  }
    return ()=>null
  },[post])

  const onchange = e => setfields({...fields, [e.target.name]:e.target.value})

  const handleSubmit = async(event) =>{
    event.preventDefault()
	setLoading(true)
  	let body= new FormData()
	body.append('post',post)
	body.append('caption',fields.caption)
	body.append('location',fields.location)
  
	axios.post(`/post/create`, body )
	.then((res)=>{
		let resp= res.data
		if(resp.status){
			setTimeout(() => {
				navigator('/')
				toast('Posted')
			}, 2500);
		}else{
			toast(resp.message)
		}
	})
  }
  return (
    <>
    <div className='d-flex mt-5 mb-3 mx-1 postCreateDiv'>
      <form onSubmit={handleSubmit} style={{display:'flex'}}>
        <div className='col-lg-8 col-sm-12'>
            <div className='col-md-12 col-sm-12'>
              <h2>New Post</h2>
              <textarea placeholder='Write a caption...' style={{width:'100%',height:'145px',borderRadius:'8px',paddingTop:'10px',paddingLeft:'10px',marginTop:'21px'}} name='caption' onChange={onchange} value={fields.caption} />
            </div>
            <div className='col-md-12 col-sm-12 mt-3 mx-1'>
              <h4> Add Location </h4>
              <input type='text' placeholder='Location' style={{width:'60%',height:'40px',paddingLeft:'10px',marginLeft:'10px',borderRadius:'5px'}} name='location' value={fields.location} onChange={onchange}/>
            </div>
        </div>    
        <div className='col-lg-4 mx-5'>
          <div style={{position:'relative'}}>
            <h4>Preview</h4><br/>
            <img src={orgPost} className={`postPreview`} alt='' />
			{isLoading? <Loader />:
            <button type='submit' className={'btn text-white postCreateButton'}>Post</button>}
          </div>
        </div>    
        </form>
    </div>
    </>
  )
}

export default Create
