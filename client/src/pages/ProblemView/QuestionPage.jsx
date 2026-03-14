import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./QuestionPage.css";
import QuestionCard from "../../components/question/QuestionCard";
import AnswerCard from "../../components/question/AnswerCard";
import AnswerForm from "../../components/question/AnswerForm";
import api from "../../api/axios";

export default function QuestionPage() {
  const { id } = useParams();

  // ================= STATE =================
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("userId");

  // ================= FETCH QUESTION =================
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/problem/${id}`);
        setQuestion(res.data.problem);
        setAnswers(res.data.answers || []);
      } catch (error) {
        console.error("Failed to fetch question:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  // ================= VOTE HANDLER =================
  const handleVote = async (answerId, voteValue) => {
    try {
      setAnswers(prev =>
        prev.map(answer =>
          answer._id === answerId
            ? { ...answer, votes: answer.votes + voteValue }
            : answer
        )
      );

      // Future backend call:
      // await api.post(`/answer/${answerId}/vote`, { value: voteValue });
    } catch (error) {
      console.error("Vote failed:", error);
    }
  };

  // ================= ACCEPT HANDLER =================
  const handleAccept = async (answerId) => {
    if (!question?.user?._id || question.user._id !== currentUserId)
      return;

    try {
      setAnswers(prev =>
        prev.map(answer => ({
          ...answer,
          isAccepted: answer._id === answerId
        }))
      );

      // Future backend:
      // await api.post(`/answer/${answerId}/accept`);
    } catch (error) {
      console.error("Accept failed:", error);
    }
  };

  // ================= ADD ANSWER (REAL BACKEND DATA) =================
  const handleAddAnswer = (newAnswer) => {
    setAnswers(prev => [newAnswer, ...prev]);
  };

  // ================= SORT ANSWERS =================
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return (b.votes || 0) - (a.votes || 0);
  });

  // ================= RENDER STATES =================
  if (loading) {
    return <div className="page-wrapper">Loading...</div>;
  }

  if (!question) {
    return <div className="page-wrapper">Question not found</div>;
  }

  // ================= UI =================
  return (
    <div className="page-wrapper">
      <div className="qp-container">

        <QuestionCard question={question} />

        <div className="answers-section">
          <h2 className="answers-header">
            {answers.length} Answer{answers.length !== 1 ? "s" : ""}
          </h2>

          {sortedAnswers.map(answer => (
            <AnswerCard
              key={answer._id}
              answer={answer}
              onVote={handleVote}
              onAccept={handleAccept}
              isOwner={question?.user?._id === currentUserId}
            />
          ))}
        </div>

        {/* ✅ PASS QUESTION ID */}
        <AnswerForm
          questionId={question._id}
          onSubmit={handleAddAnswer}
        />

      </div>
    </div>
  );
}