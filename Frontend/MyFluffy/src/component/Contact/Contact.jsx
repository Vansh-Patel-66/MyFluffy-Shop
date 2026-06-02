import React, { useState } from "react";
import { contactAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Mail, Phone, MapPin, Send, MessageSquareCode, CheckCircle, Sparkles } from "lucide-react";

const Contact = () => {
  const { showToast } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("General Support");
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast("Please fill all fields", "warning");
      return;
    }

    try {
      setLoading(true);
      await contactAPI.submit({
        name,
        email,
        message,
        type,
      });
      setSubmitted(true);
      showToast("Message sent successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error sending message", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={contactStyles.container} className="animate-fade-in">
      <div style={contactStyles.header}>
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Reach out with questions, feedback, or custom requests.</p>
      </div>

      <div style={contactStyles.grid}>
        {/* Contact info column */}
        <div className="glass-panel" style={contactStyles.infoBlock}>
          <h3>Contact Information</h3>
          <p style={contactStyles.intro}>Our support team responds within 12-24 hours. Connect with us directly.</p>

          <div style={contactStyles.cardsGrid}>
            <div style={contactStyles.infoCard}>
              <Mail size={22} color="var(--primary)" />
              <div>
                <strong>Support Email</strong>
                <p>hello@myfluffy.com</p>
              </div>
            </div>

            <div style={contactStyles.infoCard}>
              <Phone size={22} color="var(--secondary)" />
              <div>
                <strong>Customer Care Hotline</strong>
                <p>1-800-FLUFFY (358-339)</p>
              </div>
            </div>

            <div style={contactStyles.infoCard}>
              <MapPin size={22} color="var(--success)" />
              <div>
                <strong>Headquarters Office</strong>
                <p>99 Cloud Corner, Level 4, Cottonland, India</p>
              </div>
            </div>
          </div>

          <div style={contactStyles.decorationBlob}>
            <Sparkles size={24} className="empty-icon" />
            <span>Cozy Guarantee: 100% Satisfaction or refund.</span>
          </div>
        </div>

        {/* Form Column */}
        <div className="glass-panel" style={contactStyles.formBlock}>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={contactStyles.form}>
              <h3><MessageSquareCode size={20} color="var(--primary)" /> Send Us a Message</h3>

              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="jane@doe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Inquiry Category</label>
                <select value={type} onChange={(e) => setType(e.target.value)} disabled={loading}>
                  <option value="General Support">General Support</option>
                  <option value="Shipping & Delivery">Shipping & Delivery</option>
                  <option value="Return / Refund Request">Return / Refund Request</option>
                  <option value="Bulk Pillow Orders">Bulk Pillow Orders</option>
                </select>
              </div>

              <div className="form-group">
                <label>Detailed Message</label>
                <textarea
                  placeholder="How can we help make your life fluffier?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  disabled={loading}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={contactStyles.submitBtn} disabled={loading}>
                {loading ? <span className="spinner small-spinner"></span> : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          ) : (
            <div style={contactStyles.successView} className="animate-fade-in">
              <CheckCircle size={54} color="var(--success)" />
              <h2>Message Dispatched!</h2>
              <p>Thank you for reaching out. We have logged your request and our support specialists are already on it!</p>
              <button className="btn-secondary" onClick={() => setSubmitted(false)}>
                Send another message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const contactStyles = {
  container: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  header: {
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "0.8fr 1.2fr",
    gap: "32px",
  },
  infoBlock: {
    padding: "40px",
    borderRadius: "24px !important",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    background: "rgba(255, 255, 255, 0.8) !important",
  },
  intro: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    lineHeight: "1.6",
  },
  cardsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    background: "white",
    border: "1px solid var(--border-glass)",
    borderRadius: "12px",
  },
  decorationBlob: {
    marginTop: "auto",
    background: "var(--primary-light)",
    padding: "16px",
    borderRadius: "12px",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.8rem",
    fontWeight: "700",
  },
  formBlock: {
    padding: "40px",
    borderRadius: "24px !important",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  submitBtn: {
    alignSelf: "flex-start",
    marginTop: "8px",
  },
  successView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "60px 24px",
    gap: "16px",
    color: "var(--text-muted)",
  },
};

export default Contact;
