import React from "react";
import logo from "../../../assets/icons/insta.svg";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <>
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
                  <form>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
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
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                    <input
                      type="button"
                      className="btn col-12 btn-primary mb-3 fw-bold"
                      value="Log in"
                      disabled
                    />
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
                  <Link className="fw-bold text-decoration-none" to={"/signup"}>
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
