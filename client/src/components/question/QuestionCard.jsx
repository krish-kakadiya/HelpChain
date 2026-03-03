import { useEffect } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

export default function QuestionCard({ question }) {
  if (!question) return null;
  useEffect(()=>{
    console.log(question);
  },[])
  return (
    <div className="card">
      <h1>{question.title}</h1>

      <div className="meta">
        Asked by {question.user.username || "Anonymous"}
      </div>

      <div className="tags">
        {question.tags && question.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Use description as body for now */}
      <MarkdownRenderer content={question.body} />
    </div>
  );
}
