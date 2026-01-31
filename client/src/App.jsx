import './App.css'
// Add this line at the top of App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard'
import Navbar from './components/common/layout/Navbar';
import Sidebar from './components/common/layout/Sidebar';
import ProblemForm from './components/problem/ProblemForm/ProblemForm';
import Rewards from './pages/Rewards/Rewards';

const Problems = () => <div className="page-content"><h1>My Problems</h1></div>;
const Solutions = () => <div className="page-content"><h1>My Solutions</h1></div>;
const Experts = () => <div className="page-content"><h1>Expert Connect</h1></div>;
const Settings = () => <div className="page-content"><h1>Settings</h1></div>;

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Sidebar />
        <main className="app__main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ProblemForm" element={<ProblemForm />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
