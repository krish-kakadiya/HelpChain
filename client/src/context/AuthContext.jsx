import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe } from "../api/authApi";
import api from "../api/axios";

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
        const res = await getMe();
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔐 Normal Login
  const login = async (credentials) => {
    const res = await loginUser(credentials);

    const token = res.data.accessToken;
    localStorage.setItem("token", token);

    const meRes = await getMe();
    setUser(meRes.data);

    return meRes.data;
  };

  // 🔥 OTP Login
  const otpLogin = async (email, otp) => {
    const res = await api.post("/auth/verify-otp", { email, otp });

    const token = res.data.accessToken;
    localStorage.setItem("token", token);

    const meRes = await getMe();
    setUser(meRes.data);

    return meRes.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔥 Reload user data without full screen loaders (for real-time point updates)
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await getMe();
      setUser(res.data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,     // 🔥 important
        login,
        otpLogin,
        logout,
        refreshUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);