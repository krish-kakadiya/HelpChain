import React from 'react';
import './ProblemCard.css';

const ProblemCard = ({ problem }) => {
  return (
    <div className="hc-card">
      <div className="hc-card__content">
        <div className="hc-card__left">
          {/* Uploader info at top left */}
          <div className="hc-card__uploader">
            <div className="hc-card__uploader-avatar">
              {problem.uploaderName ? problem.uploaderName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hc-card__uploader-name">
              {problem.uploaderName || 'Anonymous'}
            </span>
          </div>

          <div className="hc-card__body">
            <h3 className="hc-card__title">{problem.title}</h3>
            <p className="hc-card__description">{problem.description}</p>
            
            <div className="hc-card__tags">
              {problem.tags && problem.tags.map((tag, index) => (
                <span key={index} className="hc-card__tag">{tag}</span>
              ))}
            </div>
            
            <div className="hc-card__footer-info">
              <span className="hc-card__solutions-count">
                {problem.solutions || 0} {problem.solutions === 1 ? 'Solution' : 'Solutions'}
              </span>
            </div>
          </div>
        </div>

        {/* Image on the right side if available */}
        {problem.image && (
          <div className="hc-card__right">
            <img 
              src={problem.image} 
              alt={problem.title} 
              className="hc-card__image"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemCard;