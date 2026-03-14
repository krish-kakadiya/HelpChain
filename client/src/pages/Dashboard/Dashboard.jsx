import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from '../../components/problem/ProblemCard/ProblemCard';
import './Dashboard.css';
import api from '../../api/axios';


const Dashboard = () => {
  const navigate = useNavigate();
  const [problemsData,setProblemsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProblemData = async () => {
    try {
      const res = await api.get("/problem/allproblems");
      console.log(res.data.allProblems);
      setProblemsData(res.data.allProblems);
    } catch (error) {
      console.log("failed to fetch error", error);
      alert("Failed to fetch problems");
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
      getProblemData();
    }, []);
  
  return (
    <div className="hc-dashboard">
      <header className="hc-dashboard__header">
        <h1 className="hc-dashboard__title">Problems For You</h1>
        <button 
          className="hc-btn-primary" 
          onClick={() => navigate('/ProblemForm')}
        >
          + New Post
        </button>
      </header>

      <div className="hc-dashboard__grid">
        {problemsData.map((problem) => (
          <ProblemCard key={problem._id} problem={problem} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;