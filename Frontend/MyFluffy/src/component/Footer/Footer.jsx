import React from "react";
import { Mail } from "lucide-react";
import "../../style/footer.css";

const Footer = ({ setActivePage }) => {
  return (
    <footer className="footer-section">
      <div className="footer-layout-grid">
        {/* Footer Logo Column */}
        <div className="footer-logo-column">
          <div className="footer-logo">
            <div className="logo-svg-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2.5"/>
                <circle cx="12" cy="12" r="4.5" fill="#3b82f6"/>
              </svg>
            </div>
            <span className="logo-text-my">MyFluffy</span>
            <span className="logo-text-shop">Shop</span>
          </div>
          <p className="footer-brand-description">
            Premium plushies, blankets & pillows designed to bring comfort, warmth, and a little extra joy to every home.
          </p>
        </div>

        {/* Footer Column 1: Shop */}
        <div className="footer-links-column">
          <h3>Shop</h3>
          <ul>
            <li onClick={() => setActivePage("shop")}>Soft Toys</li>
            <li onClick={() => setActivePage("shop")}>Blankets</li>
            <li onClick={() => setActivePage("shop")}>Pillows</li>
            <li onClick={() => setActivePage("shop")}>All Products</li>
          </ul>
        </div>

        {/* Footer Column 2: Company */}
        <div className="footer-links-column">
          <h3>Company</h3>
          <ul>
            <li onClick={() => setActivePage("about")}>About Us</li>
            <li onClick={() => setActivePage("contact")}>Contact</li>
            <li onClick={() => setActivePage("shop")}>Shipping & Returns</li>
            <li onClick={() => setActivePage("shop")}>FAQ</li>
          </ul>
        </div>

        {/* Footer Column 3: Stay in touch */}
        <div className="footer-newsletter-column">
          <h3>Stay in touch</h3>
          <p className="newsletter-subtitle">Get 10% off your first order.</p>
          <div className="newsletter-input-group">
            <input type="email" placeholder="you@example.com" className="newsletter-input" />
            <button className="newsletter-submit-btn">
              <Mail size={18} color="white" />
            </button>
          </div>
          <div className="social-icons-row">
            <a href="#" className="social-icon-link" style={{ fontWeight: "800", fontSize: "0.85rem" }}>IG</a>
            <a href="#" className="social-icon-link" style={{ fontWeight: "800", fontSize: "0.85rem" }}>FB</a>
            <a href="#" className="social-icon-link" style={{ fontWeight: "800", fontSize: "0.85rem" }}>TW</a>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom-row">
        <p>© 2026 MyFluffy Shop. All rights reserved.</p>
        <p>Made with 🧸 in Cozytown.</p>
      </div>
    </footer>
  );
};

export default Footer;
