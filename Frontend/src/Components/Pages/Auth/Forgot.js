import React, { useState } from 'react'
import logo from "../../../assets/icons/insta.svg"; 
import { toast, ToastContainer } from 'react-toastify'
import LoadingBar from 'react-top-loading-bar'
import headers from '../../../APIs/Headers' 

function Forgot() {
  const [message, setMessage] = useState('')
  const [sent, setStage] = useState(false)
  const [progress, setProgress] = useState(0) 
  const host = 'https://instagram-vquy.onrender.com';
  const [input, setInput] = useState('')

  const sendMail = async event => {
	event.preventDefault()
	fetch(`${host}/api/auth/forgotPassword`,{
		method:'POST',
		headers:headers(),
		body:JSON.stringify({email:input})
	}).then(res=>res.json()).then(data=>{
		if(data.status){ 
			toast.success('a verification mail has been sent to '+input)
			setStage(!sent)
		}else{
			toast.error(data.message)
			alert(data.message)
		}
	})
  }

  const validate = () => {
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if(emailRegex.test(input)){
		setMessage('')
	}else{
		setMessage('This time? ...seriously?')
	}
  }

  return (
	<>
      <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)}/>
      <ToastContainer position='top-center' autoClose={2500} hideProgressBar={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme='dark' />           
       <div className="container-fluid justify-contents-center">
        <div className="container d-flex mt-5">
          <div className="col-md-5 offset-4 mt-3">
            <div className="card d-flex" style={{ zIndex: 4 }}>
              <div className="formTitle align-items-center text-center mt-3">
                <img src={logo} alt="not?" style={{ height: "15vh",width: "25vw" }}/>
              </div>
              <div className='loginBody mb-5 mt-3'>
                <div className='container'>
				  {sent?
				  'Password reset link has been sent to '+input
 				  :
				  <form onSubmit={sendMail}>
                    <div className="form-floating mb-3">
                      <input type="text" onChange={e=>setInput(e.target.value)} name="email" value={input} onBlur={validate} className="form-control" id="input" placeholder="" />

                      <label htmlFor="input">
                        Enter your email
                      </label>
					  <small className='text-danger mx-3'>{message}</small>
                    </div>
					<input type='submit' className='btn col-12 btn-primary mb-3 fw-bold'
					value={`Send password reset link`} onClick={()=>setProgress(100)} />
	          
                  </form> 
				  }
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
	</>
	 
  )
}

export default Forgot