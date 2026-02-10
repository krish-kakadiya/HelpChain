import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ProfileSetup from "../../Profile/ProfileSetup";
import "./OtpModal.css";

const OtpModal = ({ onClose }) => {
  const inputs = useRef([]);
  const [showProfile, setShowProfile] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < 3) {
      inputs.current[index + 1].focus();
    }
    
    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    
    // Check if all fields are filled
    if (otpValue.length !== 4) {
      alert("Please enter the complete 4-digit code");
      return;
    }

    // Here you would normally verify OTP with backend
    // For now, we'll just proceed to profile setup
    console.log("OTP Entered:", otpValue);
    
    // Close OTP modal and open Profile Setup
    setShowProfile(true);
  };

  const handleProfileComplete = (profileData) => {
    console.log("Profile completed with data:", profileData);
    setShowProfile(false);
    if (onClose) {
      onClose();
    }
    // Here you would typically send data to your backend
  };

  // Render ProfileSetup if shown
  if (showProfile) {
    return createPortal(
      <ProfileSetup onComplete={handleProfileComplete} />,
      document.body
    );
  }

  // Render OTP Modal using Portal to escape Auth container
  return createPortal(
    <div className="otp-overlay">
      <div className="otp-card">
        <div className="shimmer-border"></div>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="otp-icon">
          <i className='bx bxs-shield-quarter'></i>
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
        
        <button className="verify-btn" onClick={handleVerify}>
          Verify & Proceed
        </button>
        <p className="resend">Didn't receive code? <a href="#">Resend</a></p>
      </div>
    </div>,
    document.body
  );
};

export default OtpModal;