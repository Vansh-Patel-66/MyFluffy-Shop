import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck } from "lucide-react";
import "../../style/login/login.css"; // Reuse login styles, add a dark/admin twist if needed

const AdminLogin = ({ onLoginSuccess }) => {
  const { adminLogin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Update URL so it persists correctly if they refresh
  useEffect(() => {
    window.history.pushState({}, "", "/admin/login");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const res = await adminLogin(email, password);
    if (res.success && onLoginSuccess) {
      onLoginSuccess(res.user);
    }
  };

  return (
    <div className="login-page-wrapper animate-fade-in" style={{ background: "linear-gradient(135deg, #1f2937, #111827)" }}>
      <div className="login-card-container" style={{ borderTop: "4px solid #ef4444" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <ShieldCheck size={48} color="#ef4444" />
        </div>
        <h1 className="login-card-title">Admin Portal</h1>
        <p className="login-card-subtitle">Restricted Access. Sign in to continue.</p>

        <form onSubmit={handleSubmit} className="login-form-element">
          <div className="form-group-custom">
            <input
              type="email"
              placeholder="Admin Email Address"
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

          <button type="submit" className="btn-primary login-submit-btn" disabled={loading} style={{ background: "#ef4444" }}>
            {loading ? "Authenticating..." : "Admin Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
