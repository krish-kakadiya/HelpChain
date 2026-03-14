// ProblemCard.jsx
// Your original ProblemCard — only change is adding the difficulty badge.
// problem.difficulty comes from the real backend (Mongoose schema field).
// No backend changes. Just reads problem.difficulty directly.

import { useNavigate } from "react-router-dom";
import './ProblemCard.css';

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();

  // Read directly from backend — "Easy" | "Medium" | "Hard"
  const difficulty = problem.difficulty || "Medium";

  return (
    <div
      className="hc-card"
      onClick={() => navigate(`/question/${problem._id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="hc-card__content">
        <div className="hc-card__left">

          {/* Uploader row */}
          <div className="hc-card__uploader">
            <div className="hc-card__uploader-avatar">
              {problem.user?.username
                ? problem.user.username.charAt(0).toUpperCase()
                : "U"}
            </div>
            <span className="hc-card__uploader-name">
              {problem.user?.username || 'Anonymous'}
            </span>
          </div>

          {/* Title */}
          <h3 className="hc-card__title">{problem.title}</h3>

          {/* Tags + difficulty + solutions */}
          <div className="hc-card__bottom">
            <div className="hc-card__tags">
              {problem.tags && problem.tags.map((tag, index) => (
                <span key={index} className="hc-card__tag">{tag}</span>
              ))}
              {/* Difficulty — reads from real backend field problem.difficulty */}
              <span className={`hc-card__difficulty hc-card__difficulty--${difficulty.toLowerCase()}`}>
                {difficulty}
              </span>
            </div>
            <span className="hc-card__solutions-count">
              {problem.solutions || 0} {problem.solutions === 1 ? 'Solution' : 'Solutions'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProblemCard;