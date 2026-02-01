import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from '../../components/problem/ProblemCard/ProblemCard';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const problems = [
    {
      id: 1,
      title: "Sample Problem",
      description: "Fixing the UI layout for Helpchain to ensure components don't overlap.",
      tags: ["React", "CSS"],
      solutions: 3,
      uploaderName: "John Doe",
      image: null // No image for this problem
    },
    {
      id: 2,
      title: "Logo Scaling",
      description: "Ensuring the SVG logo stays rounded and properly sized in the Navbar.",
      tags: ["Frontend", "UI/UX"],
      solutions: 5,
      uploaderName: "Jane Smith",
      image: "https://via.placeholder.com/280x200" // Example with image
    },
    {
      id: 3,
      title: "Database Performance Issue",
      description: "Optimizing slow queries that are affecting the application response time during peak hours.",
      tags: ["Backend", "Database", "Performance"],
      solutions: 8,
      uploaderName: "Mike Johnson",
      image: "https://via.placeholder.com/280x200/4CAF50/FFFFFF"
    }
  ];

  return (
    <div className="hc-dashboard">
      <header className="hc-dashboard__header">
        <h1 className="hc-dashboard__title">Dashboard Overview</h1>
        <button 
          className="hc-btn-primary" 
          onClick={() => navigate('/ProblemForm')}
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