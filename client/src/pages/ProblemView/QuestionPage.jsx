import { useState } from "react";

import "./QuestionPage.css";
import QuestionCard from "../../components/qustion/QuestionCard";
import AnswerCard from "../../components/qustion/AnswerCard";
import AnswerForm from "../../components/qustion/AnswerForm";

export default function QuestionPage() {
  const currentUser = "KK";

  const [question] = useState({
    id: 1,
    title: "Why does React re-render twice in StrictMode?",
    body:`
I am seeing my component render **twice** in development.

Here is my code:

\`\`\`js
useEffect(() => {
  console.log("mounted");
}, []);
\`\`\`

Here is the screenshot:

![error](https://res.cloudinary.com/dvicbvpsu/image/upload/v1759394775/profile_photos/user_68dc05661665895120636210_1759394771582.jpg)

Why is this happening?
`,
    author: "KK",
    createdAt: "2026-02-14",
    views: 124,
    tags: ["react", "strict-mode", "javascript"]
  });

  const [answers, setAnswers] = useState([
    {
      id: 1,
      body: `
This happens because StrictMode double invokes lifecycle methods in development.

# this is the problem:-

![error](https://res.cloudinary.com/dvicbvpsu/image/upload/v1759394775/profile_photos/user_68dc05661665895120636210_1759394771582.jpg)
`,
      author: "DevUser",
      votes: 3,
      isAccepted: false,
      createdAt: "2026-02-14"
    }
  ]);

  const handleVote = (id, change) => {
    setAnswers(prev =>
      prev.map(a =>
        a.id === id ? { ...a, votes: a.votes + change } : a
      )
    );
  };

  const handleAccept = (id) => {
    setAnswers(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, isAccepted: true }
          : { ...a, isAccepted: false }
      )
    );
  };

  const handleAddAnswer = (payload) => {
    const newAnswer = {
      id: Date.now(),
      author: currentUser,
      votes: 0,
      isAccepted: false,
      ...payload
    };

    setAnswers(prev => [newAnswer, ...prev]);
  };

  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <div className="container">
      <QuestionCard question={question} />
      <h2>{answers.length} Answers</h2>

      {sortedAnswers.map(answer => (
        <AnswerCard
          key={answer.id}
          answer={answer}
          onVote={handleVote}
          onAccept={handleAccept}
          isOwner={question.author === currentUser}
        />
      ))}

      <AnswerForm onSubmit={handleAddAnswer} />
    </div>
  );
}
