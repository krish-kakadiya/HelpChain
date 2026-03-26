import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./QuestionPage.css";
import QuestionCard from "../../components/question/QuestionCard";
import AnswerCard from "../../components/question/AnswerCard";
import AnswerForm from "../../components/question/AnswerForm";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function QuestionPage() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();

  // ================= STATE =================
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("it's me:",user);
  const currentUserId = user?._id ?? user?.id;

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
    let previousVotes = 0;

    try {
      // store previous value (for rollback)
      setAnswers(prev =>
        prev.map(answer => {
          if (answer._id === answerId) {
            previousVotes = answer.votes;
            return { ...answer, votes: answer.votes + voteValue };
          }
          return answer;
        })
      );

      const res = await api.post(`/answer/${answerId}/vote`, {
        value: voteValue,
      });

      // sync with backend
      setAnswers(prev =>
        prev.map(answer =>
          answer._id === answerId
            ? { ...answer, votes: res.data.votes }
            : answer
        )
      );
      
      refreshUser(); // update context points automatically
    } catch (error) {
      console.error("Vote failed:", error);

      // rollback to exact previous value
      setAnswers(prev =>
        prev.map(answer =>
          answer._id === answerId
            ? { ...answer, votes: previousVotes }
            : answer
        )
      );
    }
  };

  // ================= ACCEPT HANDLER =================
  const handleAccept = async (answerId) => {
    // prevent non-owner
    if (!question?.user?._id || question.user._id !== currentUserId) {
      alert("Only question owner can accept an answer");
      return;
    }

    try {
      // ✅ 1. Call backend first
      await api.post(`/answer/${answerId}/accept`);

      // ✅ 2. Refetch updated data (BEST PRACTICE)
      const res = await api.get(`/problem/${id}`);

      setQuestion(res.data.problem);
      setAnswers(res.data.answers || []);

      refreshUser();

    } catch (error) {
      console.error("Accept failed:", error.response?.data || error.message);
    }
  };

  // ================= ADD ANSWER =================
  const handleAddAnswer = (newAnswer) => {
    setAnswers(prev => [newAnswer, ...prev]);
    refreshUser();
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

        <AnswerForm
          questionId={question._id}
          onSubmit={handleAddAnswer}
        />

      </div>
    </div>
  );
}