import MarkdownRenderer from "./MarkdownRenderer";

export default function QuestionCard({ question }) {
  if (!question) return null;

  return (
    <div className="card">
      <h1>{question.title}</h1>

      <div className="meta">
        Asked by {question.author} on {question.createdAt} • 👁 {question.views}
      </div>

      <div className="tags">
        {question.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <MarkdownRenderer content={question.body} />
    </div>
  );
}
