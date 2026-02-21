import { useNavigate } from "react-router-dom";
import './ProblemCard.css';

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();

  return (
    <div className="hc-card" onClick={() => navigate(`/question/${problem.id}`)} style={{ cursor: "pointer" }}>
      <div className="hc-card__content">
        <div className="hc-card__left">

          <div className="hc-card__uploader">
            <div className="hc-card__uploader-avatar">
              {problem.uploaderName ? problem.uploaderName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hc-card__uploader-name">
              {problem.uploaderName || 'Anonymous'}
            </span>
          </div>

          <h3 className="hc-card__title">{problem.title}</h3>
          <p className="hc-card__description">{problem.description}</p>

          <div className="hc-card__bottom">
            <div className="hc-card__tags">
              {problem.tags && problem.tags.map((tag, index) => (
                <span key={index} className="hc-card__tag">{tag}</span>
              ))}
            </div>
            <span className="hc-card__solutions-count">
              {problem.solutions || 0} {problem.solutions === 1 ? 'Solution' : 'Solutions'}
            </span>
          </div>

        </div>

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