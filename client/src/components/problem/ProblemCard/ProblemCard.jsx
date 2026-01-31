import React from 'react';
import './ProblemCard.css';

const ProblemCard = ({ problem }) => {
  return (
    <div className="hc-card">
      <div className="hc-card__body">
        <h3 className="hc-card__title">{problem.title}</h3>
        <p className="hc-card__description">{problem.description}</p>
        
        <div className="hc-card__tags">
          {problem.tags && problem.tags.map((tag) => (
            <span key={tag} className="hc-card__tag">{tag}</span>
          ))}
        </div>
        
        <div className="hc-card__footer-info">
          <span className="hc-card__solutions-text">
            {problem.solutions} Solutions
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;