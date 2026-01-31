import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import logo from '../../../assets/logo/logo.png';
import './Navbar.css';

const Navbar = () => {
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z" fill="currentColor"/>
          </svg>
          <span>1,250</span>
        </div>
        
        <button className="hc-navbar__notification">
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