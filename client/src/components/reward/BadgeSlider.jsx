import React from 'react';
import './BadgeSlider.css';

// Importing your specific assets
import bugSpecialist from '../../assets/badges/bug-specialist.jpg';
import cyberSecurity from '../../assets/badges/cyberSecurity.jpg';
import debug from '../../assets/badges/Debug.jpg';
import fifty from '../../assets/badges/fifty.jpg';
import hundred from '../../assets/badges/hundred.jpg';
import logicArchitect from '../../assets/badges/logicArchitect.jpg';
import mentor from '../../assets/badges/mentor.jpg';
import performanceOptimizer from '../../assets/badges/performanceOptimizer.jpg';
import problemSolver from '../../assets/badges/problem-solver.jpg';
import topContributor from '../../assets/badges/topContributor.jpg';

const BadgeSlider = () => {
  const badges = [
    bugSpecialist, cyberSecurity, debug, fifty, hundred, 
    logicArchitect, mentor, performanceOptimizer, problemSolver, topContributor
  ];

  // Triple the items to ensure seamless infinite scroll
  const displayBadges = [...badges, ...badges, ...badges];

  return (
    <div className="achievement-slider-wrapper">
      {/* Animated gradient background */}
      <div className="slider-bg-gradient"></div>
      
      <div className="badge-track">
        {displayBadges.map((img, index) => (
          <div className="badge-card" key={index}>
            <div className="glass-circle">
              <div className="badge-glow"></div>
              <img src={img} alt="Badge" className="actual-badge-img" />
              <div className="premium-overlay"></div>
              <div className="badge-shine"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Side fade overlays */}
      <div className="fade-overlay fade-overlay--left"></div>
      <div className="fade-overlay fade-overlay--right"></div>
    </div>
  );
};

export default BadgeSlider;