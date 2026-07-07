import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../style/login/login.css";

const Login = ({ onLoginSuccess, setActivePage }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const res = await login(email, password);
    if (res.success && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login-page-wrapper animate-fade-in">
      <div className="login-card-container">
        <h1 className="login-card-title">Welcome back</h1>
        <p className="login-card-subtitle">Sign in to your MyFluffy account.</p>

        <form onSubmit={handleSubmit} className="login-form-element">
          <div className="form-group-custom">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input-field"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group-custom">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input-field"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary login-submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-footer-redirect">
          Don't have an account?{" "}
          <button className="redirect-link" onClick={() => setActivePage("signup")}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;