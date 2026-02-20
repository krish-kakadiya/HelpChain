import React from "react";
import "./Loader.css";

const Loader = ({ text = "Please wait..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-card">

        {/* Ring spinner */}
        <div className="loader-ring">
          <div className="ring-spin" />
          <div className="loader-logo-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#3B3FA6" />
              <path d="M12 5V3M12 21v-2M5 12H3M21 12h-2M7.05 7.05 5.64 5.64M18.36 18.36l-1.41-1.41M7.05 16.95l-1.41 1.41M18.36 5.64l-1.41 1.41"
                stroke="#3B3FA6" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
            </svg>
          </div>
        </div>

        {/* Text + bar */}
        <div className="loader-bottom">
          <p className="loader-label">{text}</p>
          <div className="loader-bar">
            <div className="loader-bar-fill" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Loader;