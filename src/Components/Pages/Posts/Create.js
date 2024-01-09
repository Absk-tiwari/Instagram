import React, { useEffect, useState } from 'react'
import headers from '../../../APIs/Headers';
import { useNavigate } from 'react-router';

const Create = () => {
  const host = 'http://127.0.0.1:1901';
  const navigator = useNavigate()
  const [post, setPost] = useState('')
  const [fields, setfields] = useState({caption : '', location:''})

  useEffect(()=>{
    let posted = localStorage.getItem('posted');
    setPost(posted)
    //localStorage.removeItem('posted')
  },[post])

  const onchange = e => {
    setfields({...fields, [e.target.name]:e.target.value})
  }

  const handleSubmit = async(event) =>{
    event.preventDefault()
    let body= {
      postContent: post,
      caption:     fields.caption,
      location:    fields.location
    }
      try {
        const resp = await fetch(`${host}/api/post/create`,{
            method : 'POST',
            headers : headers(),
            body : JSON.stringify(body)
        });
        const response = await resp.json();
        if(response.status){
            // Save the auth token 
            alert('was quite good!')
            navigator('/home')
        }else{
            alert('not good!')
            console.log(response)
        }
      } catch (e) {
          alert(e.message)        
      }
  }
  return (
    <>
    <div className='d-flex mt-5 mb-3 mx-1'>
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
            <img src={post} style={{height:`60vh`,width:'32vw',objectFit:'cover', border:'3px solid gray',borderRadius:'8px'}} alt='' />
            <button type='submit' className='btn text-white' style={{position:'absolute', borderRadius:'5px', background:'linear-gradient(to right, #84513f, #ea595f)',top:'75vh',left:`335px`,height:'50px',width:'100px'}}>Post</button>
          </div>
        </div>    
        </form>
    </div>
    </>
  )
}

export default Create