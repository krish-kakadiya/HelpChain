import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./OtpModal.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const OtpModal = ({ email, onClose }) => {
  const inputs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const { otpLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      alert("Please enter the complete 4-digit code");
      return;
    }

    try {
      setLoading(true);

      const user = await otpLogin(email, otpValue);

      // Close modal before navigation
      if (onClose) onClose();

      if (user.isProfileCompleted) {
        navigate("/dashboard",{ replace:true } );
      } else {
        navigate("/profile-setup", { replace: true });
      }

    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="otp-overlay">
      <div className="otp-card">
        <div className="shimmer-border"></div>

        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="otp-icon">
          <i className="bx bxs-shield-quarter"></i>
        </div>

        <h3>Verify Account</h3>
        <p>Enter the 4-digit code sent to your email</p>

        <div className="otp-inputs">
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              ref={(el) => (inputs.current[i] = el)}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              value={otp[i]}
            />
          ))}
        </div>

        <button
          className="verify-btn"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Proceed"}
        </button>

        <p className="resend">
          Didn't receive code? <a href="#">Resend</a>
        </p>
      </div>
    </div>,
    document.body
  );
};

export default OtpModal;