import React from "react";
import "../../style/home/home.css";

const Home = ({ userEmail, onLogout }) => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-links">
          <div className="nav-item">🏠 Home</div>
          <div className="nav-item">🛍️ Shop</div>
          <div className="nav-item">🛒 Cart</div>
        </div>

        <div className="logo">☁️ MyFluffy Shop</div>

        <div className="nav-actions">
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <h1>Welcome, {userEmail.split("@")[0]}!</h1>
          <p>The softest corner of the internet is ready for you.</p>
          <div className="category-grid">
            <div className="category-card">🧸 Plushies</div>
            <div className="category-card">☁️ Pillows</div>
            <div className="category-card">🧤 Blankets</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
