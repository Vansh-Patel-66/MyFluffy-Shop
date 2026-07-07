import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, User, LogOut, ShieldAlert, FileText, HelpCircle, Menu, X } from "lucide-react";
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
    <nav className="main-navbar">
      <div className="nav-container">
        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="nav-logo" onClick={() => handleNavClick("home")}>
          <div className="logo-svg-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2.5"/>
              <circle cx="12" cy="12" r="4.5" fill="#3b82f6"/>
            </svg>
          </div>
          <span className="logo-text-my">MyFluffy</span>
          <span className="logo-text-shop">Shop</span>
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
            className={`nav-link-btn ${activePage === "shop" && setShopCategory && activePage !== "cart" ? "active" : ""}`}
            onClick={() => handleNavClick("shop", "all")}
          >
            Shop
          </button>
          <button 
            className={`nav-link-btn`}
            onClick={() => handleNavClick("shop", "Soft Toys")}
          >
            Soft Toys
          </button>
          <button 
            className={`nav-link-btn`}
            onClick={() => handleNavClick("shop", "Blankets")}
          >
            Blankets
          </button>
          <button 
            className={`nav-link-btn`}
            onClick={() => handleNavClick("shop", "Pillows")}
          >
            Pillows
          </button>
          <button 
            className={`nav-link-btn ${activePage === "about" ? "active" : ""}`}
            onClick={() => handleNavClick("about")}
          >
            About
          </button>
        </div>

        {/* Navigation Action Buttons */}
        <div className="nav-actions">
          {/* User Auth Portal */}
          {user ? (
            <div className="profile-dropdown-container">
              <button 
                className="profile-trigger-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="avatar-circle-outline">
                  <User size={20} />
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown glass-panel">
                  <div className="dropdown-header">
                    <p className="dropdown-email">{user.email}</p>
                    <p className="dropdown-role">{user.role === "admin" ? "🛡️ Administrator" : "🛒 Fluffy Customer"}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  {user.role === "admin" && (
                    <button className="dropdown-item admin-dropdown-btn" onClick={() => handleNavClick("admin")}>
                      <ShieldAlert size={16} /> Admin Portal
                    </button>
                  )}
                  <button className="dropdown-item" onClick={() => handleNavClick("orders")}>
                    <FileText size={16} /> My Orders
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout-item" onClick={() => { logout(); handleNavClick("home"); }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="profile-dropdown-container">
              <button 
                className="profile-trigger-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="avatar-circle-outline">
                  <User size={20} />
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown guest-dropdown-menu" style={{ width: "180px" }}>
                  <button className="guest-dropdown-item" onClick={() => handleNavClick("login")}>
                    Log in
                  </button>
                  <button className="guest-dropdown-item" onClick={() => handleNavClick("signup")}>
                    Create account
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Shopping Cart Trigger */}
          <button className="cart-trigger-btn-outline" onClick={() => handleNavClick("cart")}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
