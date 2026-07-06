import React, { useState } from "react";
import { authAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../style/login/login.css";

const Signup = ({ setActivePage }) => {
  const { showToast } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in email and password", "warning");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "warning");
      return;
    }

    try {
      setLoading(false);
      const res = await authAPI.register(email, password);
      showToast(res.message || "Account created successfully! Please log in.", "success");
      setActivePage("login");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
    <div className="login-page-wrapper animate-fade-in">
      <div className="login-card-container glass-panel">
        <h1 className="login-card-title">Create your account</h1>
        <p className="login-card-subtitle">Join our cozy community.</p>

        <form onSubmit={handleSubmit} className="login-form-element">
          <div className="form-group-custom">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="login-input-field"
            />
          </div>

          <div className="form-group-custom">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input-field"
              required
            />
          </div>

          <div className="form-group-custom">
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input-field"
              required
            />
          </div>

          <button type="submit" className="btn-primary login-submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="login-footer-redirect">
          Already have one?{" "}
          <button className="redirect-link" onClick={() => setActivePage("login")}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
