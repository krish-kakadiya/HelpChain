import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Still checking auth
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px"
      }}>
        Loading...
      </div>
    );
  }

  // 🚫 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Profile not completed → force profile setup
  if (!user.isProfileCompleted && location.pathname !== "/profile-setup") {
    return <Navigate to="/profile-setup" replace />;
  }

  // 🚫 Profile already completed → block profile setup page
  if (user.isProfileCompleted && location.pathname === "/profile-setup") {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;