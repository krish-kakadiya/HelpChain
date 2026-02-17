import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import LoginRegister from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProblemForm from "./components/problem/ProblemForm/ProblemForm";
import Rewards from "./pages/Rewards/Rewards";
import QuestionPage from "./pages/ProblemView/QuestionPage";

const Problems = () => <div>My Problems</div>;
const Solutions = () => <div>My Solutions</div>;
const Experts = () => <div>Expert Connect</div>;
const Settings = () => <div>Settings</div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <Routes>

            {/* Public Route */}
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <LoginRegister />
                </AuthLayout>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ProblemForm" element={<ProblemForm />} />
              <Route path="QuestionPage" element={<QuestionPage />} />
              <Route path="problems" element={<Problems />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="solutions" element={<Solutions />} />
              <Route path="experts" element={<Experts />} />
              <Route path="settings" element={<Settings />} />
            </Route>

          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
