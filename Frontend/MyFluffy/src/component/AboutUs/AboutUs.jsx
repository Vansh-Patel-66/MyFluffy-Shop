import React from "react";
import { Heart, Sparkles, ShieldCheck, Smile, HelpCircle, ArrowRight } from "lucide-react";
import "../../style/about.css";

const AboutUs = ({ setActivePage }) => {
  return (
    <div className="about-container animate-fade-in">
      {/* Hero Banner */}
      <section className="about-hero glass-panel">
        <div className="about-hero-content">
          <div className="about-sparkle-badge">
            <Sparkles size={16} /> <span>Handcrafted with Love</span>
          </div>
          <h1>Crafting Comfort for Your Happy Place</h1>
          <p className="about-hero-subtitle">
            Born from a simple dream to build the ultimate soft experience, we craft cuddle-worthy companions that make everyday life feel a little lighter.
          </p>
        </div>
        <div className="about-hero-visual">
          <div className="cloud-bubble large">☁️</div>
          <div className="cloud-bubble medium">☁️</div>
          <div className="cloud-bubble small">☁️</div>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="about-story-section">
        <div className="story-grid">
          <div className="story-image-card glass-panel">
            <img 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop" 
              alt="Soft fabrics texture close up" 
              className="story-img"
            />
            <div className="story-floating-badge">
              <strong>Est. 2026</strong>
            </div>
          </div>
          <div className="story-content">
            <span className="about-pre">OUR JOURNEY</span>
            <h2>How It All Started</h2>
            <p>
              MyFluffy was founded after searching endlessly for the perfect fluffy pillow that wouldn't flatten after a few weeks. What started as an experiment in a tiny workspace using hand-combed organic cotton and premium hypoallergenic microfibers quickly turned into a passion.
            </p>
            <p>
              We realized that softness isn't just a physical texture — it represents a feeling of safety, comfort, and relief at the end of a long day. Today, we are proud to deliver that same handcrafted comfort to thousands of homes across the nation.
            </p>
            <div className="story-features">
              <div className="story-feat-item">
                <Heart size={18} className="feat-icon-heart" />
                <span>Made for side, back, and stomach sleepers alike</span>
              </div>
              <div className="story-feat-item">
                <ShieldCheck size={18} className="feat-icon-shield" />
                <span>Fully certified hypoallergenic materials</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="about-values-section">
        <div className="section-header-centered">
          <span className="about-pre">WHAT DRIVES US</span>
          <h2>Our Core Comfort Values</h2>
          <p>We believe in high-quality items that last, keeping your comfort and the planet in mind.</p>
        </div>

        <div className="values-grid">
          <div className="value-card glass-panel">
            <div className="value-icon-wrapper cream">
              <Sparkles size={24} color="var(--primary)" />
            </div>
            <h3>Cloud-Like Softness</h3>
            <p>We source only high-density combed polyester fill. Each fibers is treated to stay bounce-resilient and fluffy month after month.</p>
          </div>

          <div className="value-card glass-panel">
            <div className="value-icon-wrapper green">
              <ShieldCheck size={24} color="var(--success)" />
            </div>
            <h3>Hypoallergenic & Safe</h3>
            <p>Absolutely zero harmful dyes, chemical softeners, or irritants. Fully safe for kids, toddlers, and sensitive skin sleepers.</p>
          </div>

          <div className="value-card glass-panel">
            <div className="value-icon-wrapper pink">
              <Heart size={24} color="var(--secondary)" />
            </div>
            <h3>100% Ethical Crafting</h3>
            <p>We believe in fair wages, safe workspaces, and minimizing production waste. Every offcut fabric is recycled into plushie stuffing.</p>
          </div>

          <div className="value-card glass-panel">
            <div className="value-icon-wrapper blue">
              <Smile size={24} color="var(--primary)" />
            </div>
            <h3>Cozy Satisfaction</h3>
            <p>Our 100-night test guarantee ensures you have plenty of time to cuddle with your purchase. Not satisfied? Return it with ease.</p>
          </div>
        </div>
      </section>

      {/* Mascot/Team Showcase */}
      <section className="about-mascots-section glass-panel">
        <div className="mascot-text">
          <h2>Meet the Fluffy Family</h2>
          <p>
            Our signature product characters aren't just shapes — they are lovable companions designed with unique personalities.
          </p>
          <div className="mascot-list">
            <div className="mascot-item">
              <span className="mascot-emoji">☁️</span>
              <div>
                <strong>Cuddle Cloud</strong>
                <p>Gentle and supporting. Always there to support your neck and head during deep sleeps.</p>
              </div>
            </div>
            <div className="mascot-item">
              <span className="mascot-emoji">🐱</span>
              <div>
                <strong>Marshmallow Kitty</strong>
                <p>Round, squishy, and sweet. Likes warm sunlight and keeps your lap cozy on study days.</p>
              </div>
            </div>
            <div className="mascot-item">
              <span className="mascot-emoji">🐰</span>
              <div>
                <strong>Floppy Bunny</strong>
                <p>Playful and super fuzzy. Has extra long ears perfect for squeezing during scary movies.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mascot-cta">
          <h3>Ready to discover the fluff?</h3>
          <p>Join the thousands of happy sleepers who have upgraded their relaxation game.</p>
          <button className="btn-primary" onClick={() => setActivePage("shop")}>
            Explore the Catalog <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
