import React, { useState } from "react";
import "./Auth.css";

const LoginRegister = () => {
  const [active, setActive] = useState(false);

  return (
    <div className={`container ${active ? "active" : ""}`}>
      <div className="curved-shape"></div>
      <div className="curved-shape2"></div>

      {/* LOGIN FORM */}
      <div className="form-box Login">
        <h2 className="animation" style={{ "--D": 0, "--S": 21 }}>
          Login
        </h2>

        <form>
          <div className="input-box animation" style={{ "--D": 1, "--S": 22 }}>
            <input type="text" required />
            <label>Username</label>
            <box-icon type="solid" name="user" color="gray"></box-icon>
          </div>

          <div className="input-box animation" style={{ "--D": 2, "--S": 23 }}>
            <input type="password" required />
            <label>Password</label>
            <box-icon name="lock-alt" type="solid" color="gray"></box-icon>
          </div>

          <div className="input-box animation" style={{ "--D": 3, "--S": 24 }}>
            <button className="btn">Login</button>
          </div>

          <div className="regi-link animation" style={{ "--D": 4, "--S": 25 }}>
            <p>
              Don't have an account? <br />
              <a href="#" onClick={() => setActive(true)}>
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* LOGIN INFO */}
      <div className="info-content Login">
        <h2 className="animation" style={{ "--D": 0, "--S": 20 }}>
          WELCOME BACK!
        </h2>
        <p className="animation" style={{ "--D": 1, "--S": 21 }}>
          We are happy to have you with us again.
        </p>
      </div>

      {/* REGISTER FORM */}
      <div className="form-box Register">
        <h2 className="animation" style={{ "--li": 17, "--S": 0 }}>
          Register
        </h2>

        <form>
          <div className="input-box animation" style={{ "--li": 18, "--S": 1 }}>
            <input type="text" required />
            <label>Username</label>
            <box-icon type="solid" name="user" color="gray"></box-icon>
          </div>

          <div className="input-box animation" style={{ "--li": 19, "--S": 2 }}>
            <input type="email" required />
            <label>Email</label>
            <box-icon name="envelope" type="solid" color="gray"></box-icon>
          </div>

          <div className="input-box animation" style={{ "--li": 19, "--S": 3 }}>
            <input type="password" required />
            <label>Password</label>
            <box-icon name="lock-alt" type="solid" color="gray"></box-icon>
          </div>

          <div className="input-box animation" style={{ "--li": 20, "--S": 4 }}>
            <button className="btn">Register</button>
          </div>

          <div className="regi-link animation" style={{ "--li": 21, "--S": 5 }}>
            <p>
              Already have an account? <br />
              <a href="#" onClick={() => setActive(false)}>
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* REGISTER INFO */}
      <div className="info-content Register">
        <h2 className="animation" style={{ "--li": 17, "--S": 0 }}>
          WELCOME!
        </h2>
        <p className="animation" style={{ "--li": 18, "--S": 1 }}>
          We’re delighted to have you here.
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
