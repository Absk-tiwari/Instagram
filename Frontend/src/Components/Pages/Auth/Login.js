import React, { useState,useEffect } from "react";
import logo from "../../../assets/icons/insta.svg";
import { Link, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import 'react-toastify/dist/ReactToastify.css'
import { toast } from '../../../toast'
import { useDispatch } from "react-redux";
import axios from "axios";
import headers from "../../../APIs/Headers";
import { init } from "../../../socket";
import { RotatingLines } from 'react-loader-spinner'
const Login =  () => {
  const dispatch = useDispatch()
  if(document.querySelector('.App'))
  { 
  	document.querySelector('.App').style.height='100vh'
  }
  const [progress, setProgress] = useState(0)
  let navigator = useNavigate();
	useEffect(()=>{
	   if( localStorage.getItem(`token`) )
	   {
	     return navigator('/');
	   }
	//    return () => document.querySelector('.App').style.height='initial'
	},[]);
  
  const login = async({username, password}) =>{
	try {
		axios.post(`/auth/login`,{username, password})
		.then((res)=>{
			let response = res.data
			if(response.status){
				// Save the auth token 
				localStorage.setItem('token', response.authToken);
				toast('Logged in successfully!')
				axios.defaults.headers.common=headers()
				init().then( res =>{
					dispatch({type:'LOGIN', payload:{token:response.authToken, info:res}})
				})
			  	setTimeout(() => navigator('/'), 2500);
			}else{
				toast(response.message) 
			}

		}).catch((err)=>dispatch({type:'ERROR',payload:{error:err.message}}))
		.finally(()=>{
			setLoading(false)
		})
	} catch (err) {
		toast(err.message); 
		setLoading(false)
	}
}

  const [fields, setfields] = useState({username:"", password : ""})
  const [isLoading, setLoading] = useState(false)

  const process = e => {
    setLoading(!isLoading)
    e.preventDefault();
    setTimeout(() => {
      login(fields) 
    }, 2000);
    setLoading(!isLoading)
  }
  const onchange = e => {
    setfields({...fields, [e.target.name]:e.target.value})
  }
  return (
    <>
      <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)}/>
       <div className="container-fluid justify-contents-center">
        <div className="container">
          <div className="col-md-5 loginContainer">
            <div className="card d-flex" style={{ zIndex: 4 }}>
              <div className="formTitle align-items-center text-center mt-3">
                <img src={logo} alt="not?" style={{ height: "15vh",width: "25vw" }}/>
              </div>
              <div className="loginBody mb-5">
                <div className="container">
                  <form onSubmit={process}>
                    <div className="form-floating mb-3">
                      <input type="text" onChange={onchange} name="username" value={fields.username} className="form-control" id="username" placeholder="username" />

                      <label htmlFor="username">
                        Phone number, username, or email
                      </label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="password" className="form-control" id="password"
                        placeholder="password" name="password" value={fields.password}
                        onChange={onchange} />
                      <label htmlFor="password">Password</label>
                    </div>
                    <button
                      	type="submit" 
						className="btn col-12 btn-primary mb-3 fw-bold"
						disabled={fields.username.length < 5 || fields.password.length < 7 || isLoading} 
						onClick={()=>setProgress(100)} >
							{isLoading ? 
							<RotatingLines
								visible={true}
								height="30"
								width="30"
								strokeColor="white"
								strokeWidth="4"
								animationDuration="0.75"
								ariaLabel="rotating-lines-loading"
								wrapperStyle={{}}
								wrapperClass=""
							/>
							:`Log in`}
					</button>
 
						

                    <center className="text-secondary mt-5">
                      Forgot password? Click 
					  <Link to={'/forgotPassword'} className='fw-bold text-decoration-none'>
						&nbsp;Here 
					  </Link> to reset
                    </center>
                  </form>
                </div>
              </div>
            </div>
            <div className="card mt-3" style={{ zIndex: 4 }}>
              <div className="container">
                <p className="text-center pt-3">
                  Don't have an account?&nbsp;
                  <Link className="fw-bold text-decoration-none"  onClick={() => setProgress(100)} to={"/signup"}>
                    Signup
                  </Link>{" "}
                  here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
