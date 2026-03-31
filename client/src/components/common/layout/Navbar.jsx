import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import logo from '../../../assets/logo/logo.png';
import './Navbar.css';
import goldIcon from '../../../assets/gold.svg';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';


const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="hc-navbar">
      <div className="hc-navbar__brand">
        <div className="hc-navbar__logo-wrapper">
          <img src={logo} alt="Helpchain" />
        </div>
        <span className="hc-navbar__brand-text">Helpchain</span>
      </div>
      
      <div className="hc-navbar__search">
        <Search className="hc-navbar__search-icon" size={20} />
        <input type="text" placeholder="Search problems..." />
      </div>
      
      <div className="hc-navbar__actions">
        <div className="hc-navbar__points">
          <img src={goldIcon} alt="Gold points" width={20} height={20} />
          <span>{(user?.points || 0).toLocaleString()}</span>
        </div>

        
        <button className="hc-navbar__notification" onClick={() => navigate("/notifications")}>
          <Bell size={20} />
          <span className="hc-navbar__notification-badge">3</span>
        </button>
        
        <div 
            className="hc-navbar__profile"
            onClick={() => navigate("/profile")} // ✅ Navigate on click
            style={{ cursor: "pointer" }}
          >
            <div className="hc-navbar__profile-avatar">
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="hc-navbar__profile-img"
                />
              ) : (
                user?.username
                  ? user.username.substring(0, 2).toUpperCase()
                  : "U"
              )}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;