import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMe(); // calls /auth/me
        setUser(res.data);
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔐 Login
  const login = async (credentials) => {
    const res = await loginUser(credentials);

    const token = res.data.accessToken;

    // Store only token
    localStorage.setItem("token", token);

    // Set user from backend response
    const meRes = await getMe();
    setUser(meRes.data);
  };

  // 🔐 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
