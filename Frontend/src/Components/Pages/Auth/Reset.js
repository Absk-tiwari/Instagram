import React, { useState } from 'react'
import LoadingBar from 'react-top-loading-bar';
import { toast, ToastContainer } from 'react-toastify';
import logo from "../../../assets/icons/insta.svg"; 
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Reset() {
	if(document.querySelector('.App'))
	{ 
		document.querySelector('.App').style.height='100vh'
	}
	let navigator = useNavigate()
	let location = useLocation()
	const [passwords, setPassword] = useState({pass1:'',pass2:''})
	const [progress, setProgress] = useState(0)
	const doneReset = event => {
		event.preventDefault()
		const token = location.pathname.split('/')[2]
		axios.post(`/auth/changePassword`, {tokenedID:token, password:passwords.pass1})
		.then(({data})=>{
			console.log('after reset',data)
			if(data.status){
				toast.success(data.message)
				setTimeout(() => {
					navigator('/login')
				}, 2500);
			}
		})
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

   		     <form onSubmit={doneReset}>
				<div className="form-floating mb-3">
				<input type="password" onChange={e=>setPassword({...passwords, [e.target.name]:e.target.value})} name="pass1" value={passwords.pass1} className="form-control" id="pass1" placeholder="choose a password" />

				<label htmlFor="username">
				Create a Password
				</label>
			</div>
			<div className="form-floating mb-3">
				<input type="password" onChange={e=>setPassword({...passwords, [e.target.name]:e.target.value})} name="pass2" value={passwords.pass2} className="form-control" id="pass2" placeholder="confirm password" />

				<label htmlFor="username">
				Confirm Password
				</label>
			</div>
		    <input type='submit' className='btn col-12 btn-primary mb-3 fw-bold'
			value={`Log in`} disabled={passwords.pass1.length < 7 || passwords.pass1.length < 7 } onClick={()=>setProgress(100)} />
		</form> 
		 </div>
		 </div>
	 	</div>
	 </div>
	 </div>
	 </div>
	</>
  )
}

export default Reset