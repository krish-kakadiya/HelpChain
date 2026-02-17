import React, { useState } from "react";
import "./Auth.css";
import OtpModal from "./OtpModal/OtpModal";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

const LoginRegister = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const { login } = useAuth();

  // ================= REGISTER STATE =================
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // ================= LOGIN STATE =================
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", registerData);

      if (response.data.succsess) {
        setShowOtp(true);
      } else {
        alert(response.data.message || "Registration failed");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong during registration"
      );
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
  e.preventDefault();
    try {
      await login(loginData);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };


  return (
    <div className="auth-page">
      <div className={`container ${active ? "active" : ""}`}>
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* LOGIN FORM */}
        <div className="form-box Login">
          <h2 className="animation" style={{ "--D": 0, "--S": 21 }}>
            Login
          </h2>
          <form onSubmit={handleLogin}>
            <div className="input-box animation" style={{ "--D": 1, "--S": 22 }}>
              <input
                type="email"
                required
                placeholder=" "
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
              />
              <label>Email</label>
              <i className="bx bxs-user"></i>
            </div>

            <div className="input-box animation" style={{ "--D": 2, "--S": 23 }}>
              <input
                type="password"
                required
                placeholder=" "
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />
              <label>Password</label>
              <i className="bx bxs-lock-alt"></i>
            </div>

            <div className="input-box animation" style={{ "--D": 3, "--S": 24 }}>
              <button type="submit" className="btn shine-effect">
                Login
              </button>
            </div>

            <div className="regi-link animation" style={{ "--D": 4, "--S": 25 }}>
              <p>
                Don't have an account?{" "}
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
          <form onSubmit={handleRegister}>
            <div className="input-box animation" style={{ "--li": 18, "--S": 1 }}>
              <input
                type="text"
                required
                placeholder=" "
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    username: e.target.value,
                  })
                }
              />
              <label>Username</label>
              <i className="bx bxs-user"></i>
            </div>

            <div className="input-box animation" style={{ "--li": 19, "--S": 2 }}>
              <input
                type="email"
                required
                placeholder=" "
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    email: e.target.value,
                  })
                }
              />
              <label>Email</label>
              <i className="bx bxs-envelope"></i>
            </div>

            <div className="input-box animation" style={{ "--li": 19, "--S": 3 }}>
              <input
                type="password"
                required
                placeholder=" "
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
              />
              <label>Password</label>
              <i className="bx bxs-lock-alt"></i>
            </div>

            <div className="input-box animation" style={{ "--li": 20, "--S": 4 }}>
              <button type="submit" className="btn shine-effect">
                Register
              </button>
            </div>

            <div className="regi-link animation" style={{ "--li": 21, "--S": 5 }}>
              <p>
                Already have an account?{" "}
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

        {/* OTP MODAL */}
        {showOtp && (
          <OtpModal
            email={registerData.email}
            onClose={() => setShowOtp(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
