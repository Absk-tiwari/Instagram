import React, {useContext, useState} from "react";
import logo from "../../../assets/icons/insta.svg";
import { Link } from "react-router-dom";
import AuthContext from "../../../Contexts/Auth/AuthContext";
import LoadingBar from "react-top-loading-bar";
import Loader from "../../StateComponents/Loader";
const Login = () => {
  const [progress, setProgress] = useState(0)
  const {login } = useContext(AuthContext) 
  const [fields, setfields] = useState({username:"", password : ""})
  const [isLoading, setLoading] = useState(false)

  const process = e => {
    setLoading(!isLoading)
    e.preventDefault();
    setTimeout(() => {
      login(fields)
    }, 4000);
    setLoading(!isLoading)
  }
  const onchange = e => {
    setfields({...fields, [e.target.name]:e.target.value})
  }
  return (
    <>
      <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)}/>
       <div className="container-fluid justify-contents-center">
        <div className="container d-flex mt-5">
          <div className="col-md-5 offset-4 mt-3">
            <div className="card d-flex" style={{ zIndex: 4 }}>
              <div className="formTitle align-items-center text-center mt-3">
                <img
                  src={logo}
                  alt="not?"
                  style={{
                    height: "15vh",
                    width: "25vw",
                  }}
                />
              </div>
              <div className="loginBody">
                <div className="container">
                  <form onSubmit={process}>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        onChange={onchange}
                        name="username"
                        value={fields.username}
                        className="form-control"
                        id="username"
                        placeholder="username"
                      />
                      <label htmlFor="username">
                        Phone number, username, or email
                      </label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="password"
                        name="password"
                        value={fields.password}
                        onChange={onchange}
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                    <input
                      type="submit"
                      className="btn col-12 btn-primary mb-3 fw-bold"
                      value={`Log in`}
                      disabled={fields.username.length > 5 && fields.password.length > 7 ? '' : true}
                      onClick={() => setProgress(100)}
                    />
                    {isLoading && <Loader height='30'/>}
                    <small className="text-secondary offset-4 px-4 ">
                      Forgot password?
                    </small>
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
