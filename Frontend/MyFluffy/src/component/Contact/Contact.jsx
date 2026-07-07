import React, { useState } from "react";
import { contactAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import "../../style/contact.css";

const Contact = () => {
  const { showToast } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    try {
      setLoading(true);
      await contactAPI.submit({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message,
        type: "General Support",
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page animate-fade-in">

      {/* ── PAGE HEADER ── */}
      <div className="contact-header">
        <span className="contact-pre-title">CONTACT US</span>
        <h1 className="contact-title">We'd love to hear from you</h1>
        <p className="contact-subtitle">
          Have a question, feedback, or a custom request? Our team responds within 12–24 hours.
        </p>
      </div>

      {/* ── CONTENT GRID ── */}
      <div className="contact-grid">

        {/* LEFT: Info panel */}
        <aside className="contact-info-panel">
          <h2 className="contact-info-heading">Contact Information</h2>
          <p className="contact-info-intro">
            Reach out directly or fill in the form and we'll get back to you.
          </p>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={18} color="var(--primary)" />
              </div>
              <div>
                <strong>Support Email</strong>
                <p>hello@myfluffy.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={18} color="var(--primary)" />
              </div>
              <div>
                <strong>Customer Care</strong>
                <p>1-800-FLUFFY (358-339)</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin size={18} color="var(--primary)" />
              </div>
              <div>
                <strong>Headquarters</strong>
                <p>99 Cloud Corner, Cottonland, India</p>
              </div>
            </div>
          </div>

          <div className="contact-info-badge">
            ✦ Cozy Guarantee: 100% Satisfaction or refund.
          </div>
        </aside>

        {/* RIGHT: Form panel */}
        <div className="contact-form-panel">
          {!submitted ? (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <h2 className="contact-form-heading">Send us a message</h2>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="cf-name">Full Name <span className="required">*</span></label>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="cf-email">Email Address <span className="required">*</span></label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="cf-phone">Phone Number <span className="optional">(optional)</span></label>
                <input
                  id="cf-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="cf-message">Your Message <span className="required">*</span></label>
                <textarea
                  id="cf-message"
                  name="message"
                  placeholder="How can we make your life fluffier? Tell us anything…"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn btn-primary" disabled={loading}>
                {loading
                  ? <><span className="spinner small-spinner" /> Sending…</>
                  : <><Send size={16} /> Send Message</>
                }
              </button>
            </form>
          ) : (
            <div className="contact-success animate-fade-in">
              <div className="contact-success-icon">
                <CheckCircle size={52} color="var(--success)" />
              </div>
              <h2>Message sent! 🎉</h2>
              <p>
                Thanks for reaching out, <strong>{form.name}</strong>. We've received your message
                and will reply to <strong>{form.email}</strong> within 12–24 hours.
              </p>
              <button
                className="btn-secondary"
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
              >
                Send another message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
