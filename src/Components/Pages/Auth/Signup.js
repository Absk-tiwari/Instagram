import React, {useContext, useState} from "react";
import logo from "../../../assets/icons/insta.svg";
import AuthContext from "../../../Contexts/Auth/AuthContext";
const Signup = () => {
  const {signup} = useContext(AuthContext) 
  const [fields, setfields]= useState({name : '',username:'',email : '', password: ''})

  const process = e => {
    e.preventDefault()
    console.log(fields)
    signup(fields)
  }

  const change = e => {
    setfields({...fields, [e.target.name]:e.target.value})
  }
  return (
    <>
      <div className="container-fluid justify-contents-center">
        <div className="container d-flex mt-5">
          <div className="col-md-5 offset-4 mt-3">
            <div className="card d-flex" style={{ zIndex: 4 }}>
              <div className="formTitle align-items-center text-center mt-3">
                <img src={logo} alt="not?" style={{height: "15vh",width: "25vw"}} />
              </div>
              <div className="signupBody">
                <div className="container">
              <form onSubmit={process}>
                <div className="form-floating mb-3">
                <input type="text" name="email" value={fields.email} onChange={change} className="form-control" id="phone" placeholder="username"/>
                  <label htmlFor="phone" autoComplete="false">Mobile number or email</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="fullname" name="name" onChange={change} value={fields.name} placeholder="Full Name"
                  />
                  <label htmlFor="fullname">
                    Full Name
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="username" name="username" onChange={change} value={fields.username} placeholder="Username"
                  />
                  <label htmlFor="username">
                    Username
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" name="password" value={fields.password} onChange={change} className="form-control" id="password"
                    placeholder="password"/>
                  <label htmlFor="password">Password</label>
                </div>
                <input type="submit" className="btn col-12 btn-primary mb-3 fw-bold"
                  value="Sign up"  />
                <p className="text-secondary text-center px-4 ">
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
