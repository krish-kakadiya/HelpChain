import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { problemsData } from "../Dashboard/Dashboard";
import "./QuestionPage.css";
import QuestionCard from "../../components/question/QuestionCard";
import AnswerCard from "../../components/question/AnswerCard";
import AnswerForm from "../../components/question/AnswerForm";

export default function QuestionPage() {
  const { id } = useParams();

  const currentUser = "KK";
  const currentUserId = 1; // This should come from your auth context/backend

  const question = problemsData.find(
    (p) => p.id === parseInt(id)
  );

  const [answers, setAnswers] = useState([]);

  // Track user votes - stores 'up', 'down', or null for each answer
  const [userVotes, setUserVotes] = useState(() => {
    const saved = localStorage.getItem(`user_${currentUserId}_votes`);
    return saved ? JSON.parse(saved) : {};
  });

  // Persist votes to localStorage
  useEffect(() => {
    localStorage.setItem(`user_${currentUserId}_votes`, JSON.stringify(userVotes));
  }, [userVotes, currentUserId]);

  const handleVote = async (answerId, voteType) => {
    const currentVote = userVotes[answerId];
    let newVoteCount = 0;
    let newUserVote = null;

    // Logic: clicking same button removes vote, clicking different button changes vote
    if (currentVote === voteType) {
      // Remove vote
      newUserVote = null;
      newVoteCount = voteType === 'up' ? -1 : 1;
    } else if (currentVote) {
      // Change vote
      newUserVote = voteType;
      newVoteCount = voteType === 'up' ? 2 : -2;
    } else {
      // New vote
      newUserVote = voteType;
      newVoteCount = voteType === 'up' ? 1 : -1;
    }

    // Optimistic update
    setUserVotes(prev => ({ ...prev, [answerId]: newUserVote }));
    setAnswers(prev =>
      prev.map(a => a.id === answerId ? { ...a, votes: a.votes + newVoteCount } : a)
    );

    // Backend API call (uncomment when ready)
    // try {
    //   const response = await fetch(`/api/answers/${answerId}/vote`, {
    //     method: 'POST',
    //     headers: { 
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`
    //     },
    //     body: JSON.stringify({ userId: currentUserId, voteType: newUserVote })
    //   });
    //   
    //   if (!response.ok) throw new Error('Vote failed');
    // } catch (error) {
    //   // Revert on error
    //   setUserVotes(prev => ({ ...prev, [answerId]: currentVote }));
    //   setAnswers(prev =>
    //     prev.map(a => a.id === answerId ? { ...a, votes: a.votes - newVoteCount } : a)
    //   );
    //   alert('Failed to vote. Please try again.');
    // }
  };

  const handleAccept = async (answerId) => {
    if (question.authorId !== currentUserId) return;

    const answer = answers.find(a => a.id === answerId);
    const newAcceptedState = !answer.isAccepted;

    setAnswers(prev =>
      prev.map(a =>
        a.id === answerId
          ? { ...a, isAccepted: newAcceptedState }
          : { ...a, isAccepted: false }
      )
    );

    // Backend API call (uncomment when ready)
    // await fetch(`/api/answers/${answerId}/accept`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ questionId: question.id, isAccepted: newAcceptedState })
    // });
  };

  const handleAddAnswer = async (payload) => {
    const newAnswer = {
      id: Date.now(),
      author: currentUser,
      authorId: currentUserId,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
      ...payload
    };

    setAnswers(prev => [newAnswer, ...prev]);

    // Backend API call (uncomment when ready)
    // const response = await fetch(`/api/questions/${question.id}/answers`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ body: payload.body, authorId: currentUserId })
    // });
    // const savedAnswer = await response.json();
    // setAnswers(prev => [savedAnswer, ...prev.slice(1)]);
  };

  // Sort: accepted first, then by votes
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="qp-container">
        <QuestionCard question={question} />
        
        <div className="answers-section">
          <h2 className="answers-header">{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h2>

          {sortedAnswers.map(answer => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              onVote={handleVote}
              onAccept={handleAccept}
              isOwner={question.authorId === currentUserId}
              userVote={userVotes[answer.id]}
            />
          ))}
        </div>

        <AnswerForm onSubmit={handleAddAnswer} />
      </div>
    </div>
  );
}