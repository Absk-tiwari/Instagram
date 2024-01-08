import React, { useEffect, useState } from 'react'

const Create = () => {
  const [post, setPost] = useState('')
  useEffect(()=>{
    let posted = localStorage.getItem('posted');
    console.log(posted)
    setPost(posted)
    //localStorage.removeItem('posted')
  },[])

  return (
    <>
    <div className='d-flex mt-3 mb-3 mx-1'>
        <div className='col-lg-8 col-sm-12'>
            <div className='col-md-12 col-sm-12'>
                <h2>New Post</h2>
                <textarea placeholder='Write a caption...' style={{width:'100%',height:'145px',borderRadius:'8px',paddingTop:'10px',paddingLeft:'10px',marginTop:'21px'}} />
            </div>
            <div className='col-md-12 col-sm-12 mt-3 mx-1'>
                <h4>Add Location</h4>
                <input type='text' placeholder='Location' style={{width:'60%',paddingLeft:'6px', marginLeft:'10px', borderRadius:'5px'}} />
            </div>
        </div>    
        <div className='col-lg-4 mx-2'>
          <div style={{position:'relative'}}>
            <h4>Preview</h4><br/>
            <img src={post} style={{height:`60vh`,width:'42vw',border:'3px solid gray',borderRadius:'8px'}} alt='' />
            <button type='button' className='btn text-white' style={{position:'absolute', borderRadius:'5px', background:'linear-gradient(to right, #84513f, #ea595f)',top:'75vh',left:`33rem`,height:'50px',width:'100px'}}>Post</button>
          </div>
        </div>    
    </div>
    </>
  )
}

export default Create