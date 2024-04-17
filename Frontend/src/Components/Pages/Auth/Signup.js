import React, { useRef, useState} from "react";
import logo from "../../../assets/icons/insta.svg";
import LoadingBar from "react-top-loading-bar";
import headers from "../../../APIs/Headers";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
const Signup = () => {
  const nav = useNavigate(); 
  const [progress,setProgress] = useState(0)
  const signup = async({name, email, username, password}) =>{
	try {
	   const json = await fetch(`https://instagram-vquy.onrender.com/api/auth/signup`,{
			method : 'POST',
			headers : headers(),
			body : JSON.stringify({name, email, username, password})
		})
		const resp = await json.json();
		if(resp.status){
			toast.success(resp.message)
			setTimeout(() => nav('/login'), 2500);
		}else{
		    validate({...validatefields, [resp.key] : {...validatefields[resp.key], bad:true, message:resp.message }})
		}
	} catch (error) {
		console.log(error.message);
	}
}
  const [fields, setfields]= useState({name : '',username:'',email : '', password: ''})
  const [validatefields, validate]= useState({
		name : {bad:false,length:5, message:'Name must be at least 5 characters long!'},
		username:{bad:false,length:5, message:'Username should have 5 at least characters'},
		email : {bad :false,length:10, message:'Invalid email'},
		password: {bad:false,length:8, message:'Password must have at least 8 characters'}
  })
  const ref = useRef(null)
  const process = e => {
    e.preventDefault() 
    signup(fields)
  }

  const inspect = () => { 
	let exp = /[a-zA-Z]/
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if(exp.test(ref.current.value)){
		if(!emailRegex.test(ref.current.value)){ 
			validate({...validatefields, email:{...validatefields.email, bad:true, message:'Invalid email'}})
		}else{
			validate({...validatefields, email:{...validatefields.email, bad:false }})
		}
	}else{
		if(!ref.current.value.length) {
			validate({...validatefields, email:{...validatefields.email, bad:true, message:'Field is required'}})
			return false
		}
		if(ref.current.value.length !== 10){
			validate({...validatefields, email:{...validatefields.email, bad:true, message:'Invalid phone number'}})
		}else{
			validate({...validatefields, email:{...validatefields.email, bad:false }})
		}
	}
  }
  const change = e => {
    setfields({...fields, [e.target.name]:e.target.value})
	if(e.target.name!=='email'){ 
		console.log('should not be email')
		if(validatefields[e.target.name].length > e.target.value.length){
			validate({...validatefields, [e.target.name] : {...validatefields[e.target.name], bad:true} })
		}else{
			validate({...validatefields, [e.target.name] : {...validatefields[e.target.name], bad:false} })
		}
	} 
  }
  return (
    <>
    <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)}/>
	<ToastContainer position='top-center' autoClose={5000} hideProgressBar={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme='dark' />           
      <div className='container-fluid justify-contents-center'>
        <div className='container d-flex mt-5'>
          <div className='col-md-5 offset-4 mt-3'>
            <div className="card d-flex" style={{ zIndex: 4 }}>
              <div className='formTitle align-items-center text-center mt-3'>
                <img src={logo} alt="" style={{height:'15vh',width:'25vw'}} />
              </div>
              <div className='signupBody'>
                <div className='container'>
              <form onSubmit={process}>
                <div className='form-floating mb-3'>
                <input type='text' name='email' ref={ref} value={fields.email} onChange={change} onBlur={inspect} className='form-control' id='phone' placeholder="username" autoComplete="off" />
                  <label htmlFor='phone' autoComplete='false'>Mobile number or email</label>
				  <small className='text-danger px-2'>{validatefields.email.bad && validatefields.email.message}</small>
                </div>
                <div className='form-floating mb-3'>
                  <input type='text' className='form-control' id='fullname' name='name' onChange={change} value={fields.name} placeholder='Full Name' autoComplete="off"/>
                  <label htmlFor='fullname'>
                    Full Name
                  </label>
				  <small className='text-danger px-2'>{validatefields.name.bad && validatefields.name.message}</small>
                </div>
                <div className='form-floating mb-3'>
                  <input type='text' className='form-control' id='username' name='username' onChange={change} value={fields.username} placeholder='Username' autoComplete="off" />
                  <label htmlFor='username'>
                    Username
                  </label>
				  <small className='text-danger px-2'>{validatefields.username.bad && validatefields.username.message}</small>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" name="password" value={fields.password} onChange={change} className='form-control' id='password'
                    placeholder='password' autoComplete="off" />
                  <label htmlFor='password'>Password</label>
				  <small className='text-danger px-2'>{validatefields.password.bad && validatefields.password.message}</small>
                </div>
                <input type='submit' className='btn col-12 btn-primary mb-3 fw-bold'
                  onClick={() => setProgress(100)} value='Sign up' disabled={validatefields.email.bad || validatefields.name.bad || validatefields.username.bad || validatefields.password.bad } />
                <p className='text-secondary text-center px-4'>
                  By signing up , you agree to our faltu terms, conditions & Privacy Policy
                </p>
              </form>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
