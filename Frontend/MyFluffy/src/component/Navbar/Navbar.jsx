import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, User, LogOut, ShieldAlert, ShoppingCart, HelpCircle, FileText, Menu, X } from "lucide-react";
import "../../style/navbar.css";

const Navbar = ({ activePage, setActivePage, onCartToggle }) => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartCount = getCartCount();

  const handleNavClick = (page) => {
    setActivePage(page);
    setShowMobileMenu(false);
  };

  return (
    <nav className="main-navbar glass-panel">
      <div className="nav-container">
        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="nav-logo" onClick={() => handleNavClick("home")}>
          <span className="logo-icon">☁️</span>
          <span className="logo-text">MyFluffy</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className={`nav-menu ${showMobileMenu ? "mobile-open" : ""}`}>
          <button 
            className={`nav-link-btn ${activePage === "home" ? "active" : ""}`}
            onClick={() => handleNavClick("home")}
          >
            🏠 Home
          </button>
          <button 
            className={`nav-link-btn ${activePage === "shop" ? "active" : ""}`}
            onClick={() => handleNavClick("shop")}
          >
            🛍️ Shop Catalog
          </button>
          <button 
            className={`nav-link-btn ${activePage === "about" ? "active" : ""}`}
            onClick={() => handleNavClick("about")}
          >
            ℹ️ About Us
          </button>
          <button 
            className={`nav-link-btn ${activePage === "contact" ? "active" : ""}`}
            onClick={() => handleNavClick("contact")}
          >
            💬 Contact Us
          </button>
          {user && (
            <button 
              className={`nav-link-btn ${activePage === "orders" ? "active" : ""}`}
              onClick={() => handleNavClick("orders")}
            >
              📋 My Orders
            </button>
          )}
          {user && user.role === "admin" && (
            <button 
              className={`nav-link-btn admin-badge ${activePage === "admin" ? "active" : ""}`}
              onClick={() => handleNavClick("admin")}
            >
              <ShieldAlert size={16} /> Admin Portal
            </button>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="nav-actions">
          {/* Shopping Cart Trigger */}
          <button className="cart-trigger-btn" onClick={onCartToggle}>
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* User Auth Portal */}
          {user ? (
            <div className="profile-dropdown-container">
              <button 
                className="profile-trigger-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="avatar-circle">
                  {user.email.substring(0, 2).toUpperCase()}
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown glass-panel">
                  <div className="dropdown-header">
                    <p className="dropdown-email">{user.email}</p>
                    <p className="dropdown-role">{user.role === "admin" ? "🛡️ Administrator" : "🛒 Fluffy Customer"}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); handleNavClick("orders"); }}>
                    <FileText size={16} /> My Orders
                  </button>
                  <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); handleNavClick("contact"); }}>
                    <HelpCircle size={16} /> Support
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout-item" onClick={() => { setShowProfileMenu(false); logout(); handleNavClick("home"); }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-primary login-nav-btn" onClick={() => handleNavClick("login")}>
              <User size={16} /> Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
