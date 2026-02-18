import MarkdownRenderer from "./MarkdownRenderer";

export default function QuestionCard({ question }) {
  if (!question) return null;

  return (
    <div className="card">
      <h1>{question.title}</h1>

      <div className="meta">
        Asked by {question.uploaderName || "Anonymous"}
      </div>

      {/* ✅ Show image if exists */}
      {question.image && (
        <div className="question-image-wrapper">
          <img
            src={question.image}
            alt={question.title}
            className="question-image"
          />
        </div>
      )}

      <div className="tags">
        {question.tags && question.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Use description as body for now */}
      <MarkdownRenderer content={question.description} />
    </div>
  );
}
