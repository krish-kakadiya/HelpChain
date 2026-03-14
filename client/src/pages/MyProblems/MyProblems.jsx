import React, { useEffect, useState } from 'react'
import api from '../../api/axios';
import ProblemCard from '../../components/problem/ProblemCard/ProblemCard';
import "./MyProblems.css";

const MyProblems = () => {
  const [myProblem, setMyProblem] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProblem = async () => {
    try {
      const res = await api.get("problem/myproblems");
      setMyProblem(res.data.myProblem);
    } catch (error) {
      console.log("failed to fetch error", error);
      alert("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProblem();
  }, []);

  return (
    <div className="myproblems-container">
      <h2 className="myproblems-title">My Problems</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : myProblem.length === 0 ? (
        <p className="no-problems">No problems found</p>
      ) : (
        <div className="myproblems-grid">
          {myProblem.map((problem) => (
            <ProblemCard key={problem._id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProblems;