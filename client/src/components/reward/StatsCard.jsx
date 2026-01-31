import React, { useState } from 'react';
import { X } from 'lucide-react';
import './StatsCard.css';

const StatsCard = ({ icon: Icon, label, value, subtitle, badge, color, clickable }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (clickable) {
      setShowModal(true);
    }
  };

  const colorClasses = {
    purple: 'stats-card--purple',
    blue: 'stats-card--blue',
    green: 'stats-card--green'
  };

  return (
    <>
      <div 
        className={`stats-card ${colorClasses[color]} ${clickable ? 'stats-card--clickable' : ''}`}
        onClick={handleClick}
      >
        <div className="stats-card__icon">
          <Icon size={28} strokeWidth={2} />
        </div>
        
        <div className="stats-card__content">
          <div className="stats-card__label">{label}</div>
          <div className="stats-card__value">{value}</div>
          {subtitle && <div className="stats-card__subtitle">{subtitle}</div>}
        </div>

        {badge && (
          <div className="stats-card__badge">
            <img src={badge.image} alt={badge.name} />
          </div>
        )}
      </div>

      {/* Modal for Uploaded Points Details */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Uploaded Points Breakdown</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="points-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Problems Posted</span>
                  <span className="breakdown-value">350 pts</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Solutions Provided</span>
                  <span className="breakdown-value">500 pts</span>
                </div>
                <div className="breakdown-item breakdown-item--total">
                  <span className="breakdown-label">Total Uploaded</span>
                  <span className="breakdown-value">850 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatsCard;