import MarkdownRenderer from "./MarkdownRenderer";

export default function AnswerCard({
  answer,
  onVote,
  onAccept,
  isOwner
}) {
  return (
    <div className={`card answer ${answer.isAccepted ? "accepted" : ""}`}>
      
      <div className="vote-box">
        <button onClick={() => onVote(answer.id, 1)}>▲</button>
        <div>{answer.votes}</div>
        <button onClick={() => onVote(answer.id, -1)}>▼</button>

        {isOwner && (
          <button
            className="accept-btn"
            onClick={() => onAccept(answer.id)}
          >
            {answer.isAccepted ? "✔" : "✓"}
          </button>
        )}
      </div>

      <div className="answer-content">
        <MarkdownRenderer content={answer.body} />

        <div className="meta">
          Answered by {answer.user.username} on {new Date(answer.createdAt).toLocaleString("en-IN", {
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
