import React from "react";
import { Heart, Leaf, Sparkles, Users, ArrowRight } from "lucide-react";
import "../../style/about.css";

const AboutUs = ({ setActivePage }) => {
  return (
    <div className="about-page animate-fade-in">

      {/* ── HERO ── */}
      <section className="about-hero-section">
        <span className="about-section-pre">OUR STORY</span>
        <h1 className="about-hero-title">
          Comfort, crafted with <span className="about-hero-accent">care.</span>
        </h1>
        <p className="about-hero-desc">
          MyFluffy Shop was born from a simple idea: everyone deserves a corner of the
          world that feels warm, safe, and impossibly soft. So we set out to make it.
        </p>
        <div className="about-hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1400&auto=format&fit=crop"
            alt="Cozy pillows on a bed"
            className="about-hero-img"
          />
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="about-mission-section">
        <div className="about-mission-left">
          <span className="about-section-pre">MISSION</span>
          <h2 className="about-mission-title">
            Bringing comfort, warmth, and joy — one plushie at a time.
          </h2>
        </div>
        <div className="about-mission-right">
          <p>
            Every product in our shop is hand-selected for a reason: it made us
            smile, feel calm, or want to curl up on the couch. We work with small
            workshops and independent makers who care as much about the
            tiniest stitch as we do.
          </p>
          <p>
            Whether it's a plush companion for a kiddo's bedroom, a chunky knit
            throw for movie nights, or the pillow you didn't know you needed —
            we hope our little corner of the internet brings a big bit of comfort to
            yours.
          </p>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="about-why-section">
        <div className="about-why-header">
          <span className="about-section-pre">WHY CHOOSE US</span>
          <h2 className="about-why-title">Softer standards, softer products</h2>
        </div>
        <div className="about-why-grid">
          <div className="about-why-card">
            <div className="about-why-icon">
              <Heart size={22} color="var(--primary)" />
            </div>
            <h3>Made with Love</h3>
            <p>Every stitch by hands that care. Our makers are partners, not just suppliers.</p>
          </div>
          <div className="about-why-card">
            <div className="about-why-icon">
              <Leaf size={22} color="var(--success)" />
            </div>
            <h3>Responsible Materials</h3>
            <p>Responsible materials, better choices. No harmful dyes, no shortcuts.</p>
          </div>
          <div className="about-why-card">
            <div className="about-why-icon">
              <Sparkles size={22} color="#f59e0b" />
            </div>
            <h3>Tested by Cuddlers</h3>
            <p>Tested by the pickiest cuddlers. Every product earns its place.</p>
          </div>
          <div className="about-why-card">
            <div className="about-why-icon">
              <Users size={22} color="#8b5cf6" />
            </div>
            <h3>Loved by 10k+ Homes</h3>
            <p>Rated 4.9/5 across 3,000+ reviews. Our community speaks for us.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta-section">
        <h2 className="about-cta-title">Ready to find your perfect cozy companion?</h2>
        <p className="about-cta-desc">
          Browse our curated collection of plushies, blankets, and pillows — each one
          made to bring a little more comfort into your day.
        </p>
        <button className="btn-primary about-cta-btn" onClick={() => setActivePage("shop")}>
          Shop the Collection <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
};

export default AboutUs;
