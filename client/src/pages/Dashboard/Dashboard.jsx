import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from '../../components/problem/ProblemCard/ProblemCard';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data representing your Helpchain problems
  const problems = [
    {
      id: 1,
      title: "Sample Problem",
      description: "Fixing the UI layout for Helpchain to ensure components don't overlap.",
      tags: ["React", "CSS"],
      solutions: 3
    },
    {
      id: 2,
      title: "Logo Scaling",
      description: "Ensuring the SVG logo stays rounded and properly sized in the Navbar.",
      tags: ["Frontend", "UI/UX"],
      solutions: 5
    }
  ];

  return (
    <div className="hc-dashboard">
      <header className="hc-dashboard__header">
        <h1 className="hc-dashboard__title">Dashboard Overview</h1>
        <button 
          className="hc-btn-primary" 
          onClick={() => navigate('/ProblemForm')} // Connects to the route
        >
          + New Post
        </button>
      </header>

      <div className="hc-dashboard__grid">
        {problems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;