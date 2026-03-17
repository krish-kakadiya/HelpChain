import { useEffect } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

export default function AnswerCard({
  answer,
  onVote,
  onAccept,
  isOwner
}) {
  
  return (
    <div className={`card answer ${answer.isAccepted ? "accepted" : ""}`}>
      
      {/* Voting Section */}
      <div className="vote-box">
        <button onClick={() => onVote(answer._id, 1)}>
          ▲
        </button>

        <div>{answer.votes}</div>

        <button onClick={() => onVote(answer._id, -1)}>
          ▼
        </button>

        {/* Accept Button */}
        {isOwner && (
          <button
            className="accept-btn"
            onClick={() => onAccept(answer._id)}
          >
            {answer.isAccepted ? "✔" : "✓"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="answer-content">
        <MarkdownRenderer content={answer.body} />

        <div className="meta">
          Answered by <strong>{answer.user?.username || "Unknown"}</strong> on{" "}
          {new Date(answer.createdAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}