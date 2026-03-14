// ConfirmModal.jsx
// Simple confirmation modal before expert request is sent.
// Shows problem title, tags, difficulty (from real schema), coin cost, and AI note.
// No backend changes — difficulty is read directly from problem.difficulty.

import "./ConfirmModal.css";

const ConfirmModal = ({ problem, cost, onClose, onConfirm }) => {
  if (!problem) return null;

  const difficulty = problem.difficulty || "Medium";

  return (
    <div className="ec-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ec-modal">

        {/* Header */}
        <div className="ec-modal__header">
          <span className="ec-modal__title">Connect with Expert</span>
          <button className="ec-modal__close" onClick={onClose}>×</button>
        </div>

        <div className="ec-modal__body">

          {/* Problem preview */}
          <div className="ec-modal__problem-chip">
            <div className="ec-modal__chip-avatar">
              {problem.user?.username
                ? problem.user.username.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div className="ec-modal__chip-info">
              <div className="ec-modal__chip-title">{problem.title}</div>
              <div className="ec-modal__chip-tags">
                {problem.tags && problem.tags.map((t, i) => (
                  <span key={i} className="ec-modal__tag">{t}</span>
                ))}
                {/* Difficulty from real schema */}
                <span className={`ec-modal__difficulty ec-modal__difficulty--${difficulty.toLowerCase()}`}>
                  {difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Cost row */}
          <div className="ec-modal__cost-row">
            <span>🪙 Expert session cost</span>
            <strong>{cost} coins</strong>
          </div>

          {/* AI note */}
          <div className="ec-modal__ai-note">
            <span className="ec-modal__ai-icon">🤖</span>
            <span>
              Our AI will automatically assign the best-matched community expert
              based on your problem tags and difficulty level. No manual picking needed.
            </span>
          </div>

          {/* Actions */}
          <div className="ec-modal__actions">
            <button className="ec-modal__btn-ghost" onClick={onClose}>Cancel</button>
            <button className="ec-modal__btn-primary" onClick={() => onConfirm(problem, cost)}>
              Confirm — {cost} coins
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;