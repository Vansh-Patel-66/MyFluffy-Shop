import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowRight, UserPlus, LogIn } from "lucide-react";
import "../../style/login/login.css";

const Login = ({ onLoginSuccess }) => {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validateForm = () => {
    if (!email) {
      setValidationError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setValidationError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isLogin) {
      const res = await login(email, password);
      if (res.success && onLoginSuccess) {
        onLoginSuccess(email);
      }
    } else {
      const res = await register(email, password, role);
      if (res.success) {
        // Toggle back to login page
        setIsLogin(true);
        setPassword("");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header">
          <div className="brand-logo">☁️</div>
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="shop-subtitle">MyFluffy Shop - Softest Corner of the Web</p>
        </div>

        {validationError && (
          <div className="validation-alert">
            <span>⚠️ {validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                required
                placeholder="hello@myfluffy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Select User Role</label>
              <div className="role-selector-group">
                <button
                  type="button"
                  className={`role-btn ${role === "user" ? "active" : ""}`}
                  onClick={() => setRole("user")}
                  disabled={loading}
                >
                  🛒 Customer
                </button>
                <button
                  type="button"
                  className={`role-btn admin-role-btn ${role === "admin" ? "active" : ""}`}
                  onClick={() => setRole("admin")}
                  disabled={loading}
                >
                  🛡️ Administrator
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner small-spinner"></span>
            ) : isLogin ? (
              <>
                Login to Shop <LogIn size={18} />
              </>
            ) : (
              <>
                Register Now <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-container">
          <button className="btn-social" type="button" disabled={loading}>
            <img src="https://img.icons8.com/color/18/000000/google-logo.png" alt="" />
            Google
          </button>
          <button className="btn-social" type="button" disabled={loading}>
            <img src="https://img.icons8.com/fluency/18/000000/facebook-new.png" alt="" />
            Facebook
          </button>
        </div>

        <p className="toggle-text">
          {isLogin ? "New to MyFluffy Shop?" : "Already a member?"}
          <span className="toggle-link" onClick={() => { setIsLogin(!isLogin); setValidationError(""); }}>
            {isLogin ? " Create Account" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;