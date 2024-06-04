import React, { useState } from 'react'
import logo from "../../../assets/icons/insta.svg"; 
import { toast } from '../../../toast'
import LoadingBar from 'react-top-loading-bar'
import { Link } from 'react-router-dom';
import axios from 'axios';

function Forgot() {
  const [message, setMessage] = useState('')
  const [sent, setStage] = useState(false)
  const [progress, setProgress] = useState(0) 
  const [input, setInput] = useState('')
  const isPhone = window.screen.width < 500
  const sendMail = async event => {
	event.preventDefault()
	axios.post(`/auth/forgotPassword`,{email:input})
	.then(({data})=>{
		if(data.status){ 
			toast('a verification mail has been sent to '+input)
			setStage(!sent)
		}else{
			toast(data.message) 
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
       <div className="container-fluid justify-contents-center">
        <div className="container d-flex mt-5">
          <div className={` ${isPhone >500 ?'col-md-5  mt-3 offset-4':'col-12'}`}>
            <div className="card d-flex" style={{ zIndex: 4 }}>
              <div className="formTitle align-items-center text-center mt-3">
                <img src={logo} alt="not?" style={{ height: "15vh",width: isPhone <500?'60vw':"25vw" }}/>
              </div>
              <div className='loginBody mb-5 mt-3'>
                <div className='container'>
				  {sent?
				  'Password reset link has been sent to '+input
 				  :
				  <form onSubmit={sendMail} className='text-center'>
                    <div className="form-floating mb-3">
                      <input type="text" onChange={e=>setInput(e.target.value)} name="email" value={input} onBlur={validate} className={isPhone?"form-control mx-2":'form-control'} id="input" placeholder="" style={{width:isPhone?'100%!important':'auto'}} />

                      <label htmlFor="input">
                        Enter your email
                      </label>
					  <small className='text-danger mx-3'>{message}</small>
                    </div>
					<input type='submit' className='btn col-12 btn-primary mb-3 fw-bold'
					value={`Send password reset link`} style={{width:isPhone?'100%!important':''}} onClick={()=>setProgress(100)} />
	          		<p className="text-center pt-3">
						Back to &nbsp;
						<Link className="fw-bold text-decoration-none"  onClick={() => setProgress(100)} to={"/login"}>
							Login
						</Link>
                	</p>
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