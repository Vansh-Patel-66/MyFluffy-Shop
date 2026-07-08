import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 4000);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await authAPI.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        setToken(res.token);
        setUser(res.data);
        showToast("Logged in successfully!", "success");
        return { success: true, user: res.data };
      } else {
        showToast(res.message || "Login failed", "error");
        return { success: false, message: res.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Invalid credentials";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, role = "user") => {
    try {
      setLoading(true);
      const res = await authAPI.register(email, password, role);
      if (res.success) {
        showToast(res.message || "Registration successful! Check email to verify.", "success");
        return { success: true };
      } else {
        showToast(res.message || "Registration failed", "error");
        return { success: false, message: res.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    showToast("Logged out successfully", "success");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
