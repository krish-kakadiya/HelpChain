import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { useState } from "react";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import LoginRegister from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProblemForm from "./components/problem/ProblemForm/ProblemForm";
import Rewards from "./pages/Rewards/Rewards";
import QuestionPage from "./pages/ProblemView/QuestionPage";

// Temporary pages (replace with real ones)
const Problems = () => <div>My Problems</div>;
const Solutions = () => <div>My Solutions</div>;
const Experts = () => <div>Expert Connect</div>;
const Settings = () => <div>Settings</div>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <SidebarProvider>
        <Routes>

          {/* 🔓 Public Route */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginRegister setIsAuthenticated={setIsAuthenticated} />
              </AuthLayout>
            }
          />

          {/* 🔐 Protected Routes Wrapper */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ProblemForm" element={<ProblemForm />} />
                    <Route path="/QuestionPage" element={<QuestionPage />} />
                    <Route path="/problems" element={<Problems />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/solutions" element={<Solutions />} />
                    <Route path="/experts" element={<Experts />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Default Protected Route */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
