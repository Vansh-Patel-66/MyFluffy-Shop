/* src/component/login/login.jsx */
import React, { useState } from 'react';
import '../../style/login/login.css';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      onLoginSuccess(email);
    } else {
      alert("Please enter an email");
    }
  };

  return (
    <div className="auth-card">
      <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      <p className="shop-subtitle">The Fluffy Shop</p>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your name" />
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="hello@fluffy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        <button type="submit" className="btn-primary">
          {isLogin ? 'Login to Shop' : 'Sign Up Now'}
        </button>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      <div className="social-container">
        <button className="btn-social">
          <img src="https://img.icons8.com/color/18/000000/google-logo.png" alt="" />
          Google
        </button>
        <button className="btn-social">
          <img src="https://img.icons8.com/fluency/18/000000/facebook-new.png" alt="" />
          Facebook
        </button>
      </div>

      <p className="toggle-text">
        {isLogin ? "New to Fluffy Shop?" : "Already a member?"}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? ' Create Account' : ' Login'}
        </span>
      </p>
    </div>
  );
};

export default Login;