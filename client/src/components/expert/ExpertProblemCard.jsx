// ExpertProblemCard.jsx
// Same look as your existing ProblemCard.
// Added: difficulty badge (Easy / Medium / Hard) from real schema field.
// Added: coin cost pill + Connect Expert / status button on the right.
// No backend changes — reads problem.difficulty directly from the schema.

import "./ExpertProblemCard.css";

// Coin cost per difficulty — adjust as needed
const COST_MAP = { Easy: 20, Medium: 40, Hard: 60 };

const ExpertProblemCard = ({ problem, status, onConnect, onOpenChat }) => {
  const initial = problem.user?.username
    ? problem.user.username.charAt(0).toUpperCase()
    : "U";

  const username   = problem.user?.username || "Anonymous";
  const difficulty = problem.difficulty || "Medium";
  const cost       = COST_MAP[difficulty] ?? 40;

  return (
    <div className="ec-hc-card">
      <div className="ec-hc-card__content">
        <div className="ec-hc-card__left">

          {/* Uploader row */}
          <div className="ec-hc-card__uploader">
            <div className="ec-hc-card__uploader-avatar">{initial}</div>
            <span className="ec-hc-card__uploader-name">{username}</span>
          </div>

          {/* Title */}
          <h3 className="ec-hc-card__title">{problem.title}</h3>

          {/* Bottom row: tags + difficulty + solutions */}
          <div className="ec-hc-card__bottom">
            <div className="ec-hc-card__tags">
              {problem.tags && problem.tags.map((tag, i) => (
                <span key={i} className="ec-hc-card__tag">{tag}</span>
              ))}
              {/* Difficulty badge — reads from real schema field */}
              <span className={`ec-hc-card__difficulty ec-hc-card__difficulty--${difficulty.toLowerCase()}`}>
                {difficulty}
              </span>
              {/* Coin cost */}
              <span className="ec-hc-card__cost">🪙 {cost}</span>
            </div>
            <span className="ec-hc-card__solutions-count">
              {problem.solutions || 0} {problem.solutions === 1 ? "Solution" : "Solutions"}
            </span>
          </div>

        </div>

        {/* Right: action button */}
        <div className="ec-hc-card__action">
          {!status && (
            <button
              className="ec-hc-card__btn"
              onClick={(e) => { e.stopPropagation(); onConnect(problem, cost); }}
            >
              Connect Expert
            </button>
          )}
          {status === "pending" && (
            <span className="ec-hc-card__status ec-hc-card__status--pending">
              <span className="ec-hc-card__status-dot" />
              Finding...
            </span>
          )}
          {status === "active" && (
            <span
              className="ec-hc-card__status ec-hc-card__status--active"
              onClick={(e) => { e.stopPropagation(); onOpenChat(problem); }}
            >
              <span className="ec-hc-card__status-dot" />
              Open Chat ↗
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertProblemCard;