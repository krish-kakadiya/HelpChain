import React from 'react';
import './BadgeSlider.css';

// Importing your specific assets
import bugSpecialist from '../../assets/badges/bug-specialist.png';
import cyberSecurity from '../../assets/badges/cyberSecurity.png';
// import debug from '../../assets/badges/Debug.png';
import fifty from '../../assets/badges/fifty.png';
import hundred from '../../assets/badges/hundred.png';
import logicArchitect from '../../assets/badges/logicArchitect.png';
import mentor from '../../assets/badges/mentor.png';
// import performanceOptimizer from '../../assets/badges/performanceOptimizer.png';
// import problemSolver from '../../assets/badges/problem-solver.png';
// import topContributor from '../../assets/badges/topContributor.png';

const BadgeSlider = () => {
  // const badges = [
  //   bugSpecialist, cyberSecurity, debug, fifty, hundred, 
  //   logicArchitect, mentor, performanceOptimizer, problemSolver, topContributor
  // ];

  const badges = [
    bugSpecialist, cyberSecurity, fifty, hundred, logicArchitect, mentor
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