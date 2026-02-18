import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import logo from '../../../assets/logo/logo.png';
import './Navbar.css';
import goldIcon from '../../../assets/gold.svg';
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();

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
          <span>1,250</span>
        </div>

        
        <button className="hc-navbar__notification" onClick={() => navigate("/notifications")}>
          <Bell size={20} />
          <span className="hc-navbar__notification-badge">3</span>
        </button>
        
        <div className="hc-navbar__profile">
          <div className="hc-navbar__profile-avatar">JS</div>
          <ChevronDown size={16} className="hc-navbar__profile-chevron" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;