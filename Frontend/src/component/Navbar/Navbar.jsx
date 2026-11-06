import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, User, LogOut, ShieldAlert, FileText, Menu, X, Sparkles, Heart } from "lucide-react";
import "../../style/navbar.css";

const Navbar = ({ activePage, setActivePage, setShopCategory }) => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartCount = getCartCount();

  const handleNavClick = (page, category = "all") => {
    if (setShopCategory) {
      setShopCategory(category);
    }
    setActivePage(page);
    setShowMobileMenu(false);
    setShowProfileMenu(false);
  };

  return (
    <header className="site-header">
      {/* Main Navigation Bar */}
      <nav className="main-navbar">
        <div className="nav-container">
          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Boutique Brand Logo */}
          <div className="nav-logo" onClick={() => handleNavClick("home")}>
            <div className="logo-emblem">
              <span className="logo-emoji" role="img" aria-label="Teddy Bear">🧸</span>
            </div>
            <div className="logo-text-group">
              <span className="logo-text-brand">MyFluffy</span>
              <span className="logo-text-tag">Boutique</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className={`nav-menu ${showMobileMenu ? "mobile-open" : ""}`}>
            <button
              className={`nav-link-btn ${activePage === "home" ? "active" : ""}`}
              onClick={() => handleNavClick("home")}
            >
              Home
            </button>
            <button
              className={`nav-link-btn ${activePage === "shop" ? "active" : ""}`}
              onClick={() => handleNavClick("shop", "all")}
            >
              Collection
            </button>
            <button
              className="nav-link-btn"
              onClick={() => handleNavClick("shop", "Lovable Plushies")}
            >
              Plushies
            </button>
            <button
              className="nav-link-btn"
              onClick={() => handleNavClick("shop", "Velvety Blankets")}
            >
              Blankets
            </button>
            <button
              className="nav-link-btn"
              onClick={() => handleNavClick("shop", "Cozy Pillows")}
            >
              Pillows
            </button>
            <button
              className={`nav-link-btn ${activePage === "about" ? "active" : ""}`}
              onClick={() => handleNavClick("about")}
            >
              Our Story
            </button>
            <button
              className={`nav-link-btn ${activePage === "contact" ? "active" : ""}`}
              onClick={() => handleNavClick("contact")}
            >
              Contact
            </button>
          </div>

          {/* Navigation Action Buttons */}
          <div className="nav-actions">
            {/* User Account Portal */}
            {user ? (
              <div className="profile-dropdown-container">
                <button
                  className="profile-trigger-btn"
                  aria-label="User account menu"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="avatar-circle-outline">
                    <User size={18} />
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown glass-panel">
                    <div className="dropdown-header">
                      <p className="dropdown-email">{user.email}</p>
                      <p className="dropdown-role">
                        {user.role === "admin" ? "🛡️ Administrator" : "✨ Cozy Member"}
                      </p>
                    </div>
                    <hr className="dropdown-divider" />
                    {user.role === "admin" && (
                      <button
                        className="dropdown-item admin-dropdown-btn"
                        onClick={() => handleNavClick("admin")}
                      >
                        <ShieldAlert size={16} /> Admin Portal
                      </button>
                    )}
                    <button
                      className="dropdown-item"
                      onClick={() => handleNavClick("orders")}
                    >
                      <FileText size={16} /> Order History
                    </button>
                    <hr className="dropdown-divider" />
                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        logout();
                        handleNavClick("home");
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="profile-dropdown-container">
                <button
                  className="profile-trigger-btn"
                  aria-label="Sign in"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="avatar-circle-outline">
                    <User size={18} />
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown guest-dropdown-menu">
                    <button
                      className="guest-dropdown-item"
                      onClick={() => handleNavClick("login")}
                    >
                      Sign In
                    </button>
                    <button
                      className="guest-dropdown-item"
                      onClick={() => handleNavClick("signup")}
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Shopping Bag Trigger */}
            <button
              className="cart-trigger-btn"
              aria-label="Shopping Bag"
              onClick={() => handleNavClick("cart")}
            >
              <ShoppingBag size={19} />
              <span className="cart-label-text">Bag</span>
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
