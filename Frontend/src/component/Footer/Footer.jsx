import React, { useState } from "react";
import { Mail, ArrowRight, ShieldCheck, Heart, Sparkles, Check } from "lucide-react";
import "../../style/footer.css";

const Footer = ({ setActivePage }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="boutique-footer">
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Brand Story Column */}
          <div className="footer-col-brand">
            <div className="footer-brand-logo" onClick={() => setActivePage("home")}>
              <div className="footer-logo-emblem">🧸</div>
              <div className="footer-logo-text">
                <span className="footer-brand-title">MyFluffy</span>
                <span className="footer-brand-sub">Boutique</span>
              </div>
            </div>
            <p className="footer-lead-text">
              Handcrafted plush companions, weighted velveteen blankets, and restorative contour pillows &mdash; designed to bring enduring comfort, warmth, and quiet joy to every home.
            </p>
            <div className="footer-trust-pill">
              <ShieldCheck size={16} color="var(--primary)" />
              <span>100-Night Risk-Free Softness Trial</span>
            </div>
          </div>

          {/* Column 1: Curated Collections */}
          <div className="footer-col-links">
            <h4 className="footer-heading">Collections</h4>
            <ul className="footer-links-list">
              <li onClick={() => setActivePage("shop")}>Lovable Plushies</li>
              <li onClick={() => setActivePage("shop")}>Velvety Blankets</li>
              <li onClick={() => setActivePage("shop")}>Cozy Pillows</li>
              <li onClick={() => setActivePage("shop")}>The Complete Edit</li>
              <li onClick={() => setActivePage("shop")}>New Arrivals</li>
            </ul>
          </div>

          {/* Column 2: Client Care */}
          <div className="footer-col-links">
            <h4 className="footer-heading">Client Care</h4>
            <ul className="footer-links-list">
              <li onClick={() => setActivePage("about")}>Our Soft Philosophy</li>
              <li onClick={() => setActivePage("contact")}>Contact Concierge</li>
              <li onClick={() => setActivePage("orders")}>Track Your Shipment</li>
              <li onClick={() => setActivePage("about")}>Materials & Care Guide</li>
              <li onClick={() => setActivePage("about")}>Shipping & Returns</li>
            </ul>
          </div>

          {/* Column 3: The Fluffy Club Newsletter */}
          <div className="footer-col-newsletter">
            <h4 className="footer-heading">Join The Fluffy Club</h4>
            <p className="newsletter-explainer">
              Receive 10% off your inaugural order, plus exclusive early previews of limited-run handcrafted plushies.
            </p>

            {subscribed ? (
              <div className="newsletter-success-box">
                <Check size={16} color="#16a34a" />
                <span>Welcome! Check your inbox for your 10% welcome code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="footer-email-input"
                />
                <button type="submit" className="footer-subscribe-btn" aria-label="Subscribe">
                  <ArrowRight size={17} />
                </button>
              </form>
            )}

            <div className="footer-social-strip">
              <span className="social-pill">Instagram</span>
              <span className="social-pill">Pinterest</span>
              <span className="social-pill">TikTok</span>
            </div>
          </div>
        </div>

        <hr className="footer-separator" />

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} MyFluffy Shop Inc. All rights reserved. Crafted with care for gentle dreamers.
          </p>

          <div className="footer-payment-badges">
            <span className="payment-badge">Visa</span>
            <span className="payment-badge">Mastercard</span>
            <span className="payment-badge">Amex</span>
            <span className="payment-badge">Apple Pay</span>
            <span className="payment-badge">256-Bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
