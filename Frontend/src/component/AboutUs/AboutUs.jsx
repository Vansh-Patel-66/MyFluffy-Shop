import React, { useState, useEffect, useRef } from "react";
import Story3DCanvas from "./Story3DCanvas";
import { PLUSH_THEMES } from "./Fluffy3DViewer";
import {
  Sparkles,
  ArrowDown,
  ArrowRight,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Minus,
  RotateCw,
  ShoppingBag,
  Award,
  Layers,
  Leaf,
  Smile
} from "lucide-react";
import "../../style/about.css";

const FAQ_ITEMS = [
  {
    q: "What materials are inside the MyFluffy companion?",
    a: "Every companion is made with our proprietary 0.8-denier CloudFluff™ microfiber velvet on the outside, and stuffed exclusively with 100% GRS-certified post-consumer recycled poly-down clusters on the inside. Hypoallergenic, anti-static, and zero toxic bleaches or dyes.",
  },
  {
    q: "How do I wash and maintain the CloudFluff™ velvety fur?",
    a: "MyFluffy companions love gentle care! Machine wash in cold water on a delicate cycle inside a pillowcase or laundry bag. Tumble dry on low heat or air dry, then give a gentle shake to fluff the fibers back to peak softness.",
  },
  {
    q: "What is your 100-Night Softness Guarantee?",
    a: "Take 100 nights to cuddle, sleep, and lounge with your companion. If it doesn't bring you profound comfort and calm, you can return it for a 100% full refund with prepaid return shipping — no questions asked.",
  },
  {
    q: "What is the Lifetime Seam Warranty?",
    a: "We believe in heirloom-quality craft. If any stitch or seam ever gives way from loving hugs over the years, simply send your friend back to our workshop and our artisans will mend it for free for life.",
  },
  {
    q: "How many recycled ocean bottles are in each plushie?",
    a: "An average of 14 post-consumer plastic bottles are diverted from waterways, sterilized, and spun into cloud-soft poly-down for each signature companion.",
  },
];

const AboutUs = ({ setActivePage }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [activeTheme, setActiveTheme] = useState("honey");
  const [userDragRot, setUserDragRot] = useState({ x: 0, y: 0 });
  const [bounceVal, setBounceVal] = useState(0);
  const [patToast, setPatToast] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Drag interaction state for Section 5 (Customizer)
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Track window scroll and compute progress across the 3D story sections
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (trackHeight > 0 ? trackHeight : 1)));
      setScrollProgress(progress);

      const sections = trackRef.current.querySelectorAll(".story-section");
      sections.forEach((sec, idx) => {
        const sRect = sec.getBoundingClientRect();
        if (sRect.top <= window.innerHeight * 0.55 && sRect.bottom >= window.innerHeight * 0.45) {
          setCurrentSectionIndex(idx);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Customizer Drag Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    setUserDragRot((prev) => ({
      x: Math.max(-0.4, Math.min(0.5, prev.x + deltaY * 0.007)),
      y: prev.y + deltaX * 0.009,
    }));

    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Hug / Pat Reaction
  const handleHug = () => {
    setBounceVal(0.26);
    setTimeout(() => setBounceVal(0), 400);

    const msgs = [
      "Pure velvet comfort! 🧸",
      "Heart beats warm! ❤️",
      "100% squishable bliss! ✨",
      "Hugs received! 💕",
    ];
    setPatToast(msgs[Math.floor(Math.random() * msgs.length)]);
    setTimeout(() => setPatToast(""), 2200);
  };

  const isCustomizerActive = currentSectionIndex === 5;

  return (
    <div className="sports-story-page" ref={containerRef}>
      {/* ── FIXED FULLSCREEN 3D CANVAS (Similar to thesportsglasses.com) ── */}
      <div
        className={`sports-3d-fixed-container ${isCustomizerActive ? "interactive-drag" : ""}`}
        onMouseDown={isCustomizerActive ? handlePointerDown : undefined}
        onMouseMove={isCustomizerActive ? handlePointerMove : undefined}
        onMouseUp={isCustomizerActive ? handlePointerUp : undefined}
        onTouchStart={isCustomizerActive ? handlePointerDown : undefined}
        onTouchMove={isCustomizerActive ? handlePointerMove : undefined}
        onTouchEnd={isCustomizerActive ? handlePointerUp : undefined}
      >
        <Story3DCanvas
          scrollProgress={scrollProgress}
          activeTheme={activeTheme}
          isCustomizerActive={isCustomizerActive}
          userDragRot={userDragRot}
          bounceVal={bounceVal}
          onModelClick={isCustomizerActive ? handleHug : undefined}
        />
      </div>

      {/* ── SCROLLING STORY SECTIONS TRACK ── */}
      <div className="sports-story-track" ref={trackRef}>

        {/* ── 1. HERO SECTION ── */}
        <section id="hero" className="story-section section-hero">
          <div className="hero-content-wrap">
            <div className="hero-tagline-pre">THE MYFLUFFY SIGNATURE</div>
            <h1 className="hero-giant-title">THE COZY COMPANION</h1>
            <p className="hero-subtitle">
              Engineered with proprietary CloudFluff™ micro-denier weave, double-reinforced lock-stitch seams, and an ocean-friendly poly-down heart.
            </p>
            <div className="hero-scroll-indicator">
              <span className="scroll-indicator-text">SCROLL TO EXPLORE CRAFT</span>
              <div className="scroll-arrow-circle">
                <ArrowDown size={18} className="scroll-bounce-arrow" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. FABRIC & CLOUDFLUFF WEAVE SECTION ── */}
        <section id="section2" className="story-section section-feature section-left">
          <div className="feature-card-content">
            <div className="feature-eyebrow">
              <span className="eyebrow-dot" />
              <span>PROPRIETARY WEAVE • 0.8D</span>
            </div>
            <h2 className="feature-heading">
              CloudFluff™ <br />Velvet Tech
            </h2>
            <p className="feature-description">
              Woven with microscopic fibers 100 times finer than silk. Eliminates bedroom static, repels dust mites, and feels like warm velvet touching your skin.
            </p>

            <div className="feature-specs-grid">
              <div className="spec-item">
                <span className="spec-label">FIBER FINENESS</span>
                <span className="spec-value">0.8 Denier Peach</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">STATIC SHIELD</span>
                <span className="spec-value">Zero Static Friction</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">SKIN SAFETY</span>
                <span className="spec-value">OEKO-TEX Class 1</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">TOUCH FINISH</span>
                <span className="spec-value">Cashmere Velveteen</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. DOUBLE-LOCK SEAMS SECTION ── */}
        <section id="section3" className="story-section section-feature section-right">
          <div className="feature-card-content">
            <div className="feature-eyebrow">
              <span className="eyebrow-dot" />
              <span>UNBREAKABLE CRAFT</span>
            </div>
            <h2 className="feature-heading">
              Double-Lock <br />Seam Armor
            </h2>
            <p className="feature-description">
              Every curve is hand-turned and double-stitched with core-spun polyester thread. Rated to survive over 45 pounds of loving bedtime tugs without a tear.
            </p>

            <div className="feature-specs-grid">
              <div className="spec-item">
                <span className="spec-label">TENSILE RATING</span>
                <span className="spec-value">45 lbs Tug-Tested</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">STITCH DENSITY</span>
                <span className="spec-value">12 Stitches / Inch</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">SAFETY EYES</span>
                <span className="spec-value">Melt-Locked Posts</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">WARRANTY</span>
                <span className="spec-value">Lifetime Free Mending</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. RECYCLED POLY-DOWN HEART SECTION ── */}
        <section id="section4" className="story-section section-feature section-left">
          <div className="feature-card-content">
            <div className="feature-eyebrow">
              <span className="eyebrow-dot heart" />
              <span>100% RECYCLED CORE</span>
            </div>
            <h2 className="feature-heading">
              An Ocean-Friendly <br />Beating Heart
            </h2>
            <p className="feature-description">
              Beneath the velvet exterior beats a heart of pure environmental kindness. Filled exclusively with certified GRS poly-down reclaimed from ocean-bound bottles.
            </p>

            <div className="feature-specs-grid">
              <div className="spec-item">
                <span className="spec-label">ECO RECLAIMED</span>
                <span className="spec-value">14 Ocean Bottles / Toy</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">CORE REBOUND</span>
                <span className="spec-value">No-Clump Cloud Fill</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">PURITY</span>
                <span className="spec-value">Zero Chlorine Bleach</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">HEART STATUS</span>
                <span className="spec-value">Active Warm Pulse</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. ERGONOMIC HUG CALIBRATION SECTION ── */}
        <section id="section5" className="story-section section-feature section-right">
          <div className="feature-card-content">
            <div className="feature-eyebrow">
              <span className="eyebrow-dot" />
              <span>DEEP PRESSURE RELIEF</span>
            </div>
            <h2 className="feature-heading">
              Ergonomic Hug <br />Calibration
            </h2>
            <p className="feature-description">
              Sculpted with a weighted pelvic center that rests naturally against your chest. Induces deep pressure stimulation to calm the vagus nerve and promote restorative sleep.
            </p>

            <div className="feature-specs-grid">
              <div className="spec-item">
                <span className="spec-label">WEIGHT BALANCE</span>
                <span className="spec-value">1.2 lbs Calming Center</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">ARM CURVATURE</span>
                <span className="spec-value">Resting Hug Posture</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">STABILITY</span>
                <span className="spec-value">Seated Base Pelvis</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">CERTIFICATION</span>
                <span className="spec-value">Sensory Calm Approved</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. INTERACTIVE 360 CUSTOMIZER (chooseStyless - Drag the Model) ── */}
        <section id="chooseStyless" className="story-section section-customizer">
          <div className="customizer-ui-dock">
            {/* Top Indicator */}
            <div className="drag-model-badge">
              <RotateCw size={14} className="spin-slow" />
              <span>Drag the Model &bull; 360° Free View</span>
            </div>

            {/* Pat Toast Notice */}
            {patToast && (
              <div className="pat-toast-bubble-sports animate-pop-bounce">
                <Heart size={16} color="#ffffff" />
                <span>{patToast}</span>
              </div>
            )}

            {/* Customizer Spec Card */}
            <div className="customizer-bottom-card">
              <div className="customizer-card-left">
                <div className="customizer-product-title">
                  MyFluffy Companion: <strong>{PLUSH_THEMES[activeTheme]?.name}</strong>
                </div>
                <div className="customizer-pricing-row">
                  <span className="customizer-price">$38.99</span>
                  <span className="customizer-badge">In Stock &bull; Ships in 24h</span>
                </div>

                {/* Color Swatches */}
                <div className="customizer-swatches-wrap">
                  <span className="swatches-label">Velvet Coat:</span>
                  <div className="swatches-rack">
                    {Object.values(PLUSH_THEMES).map((thm) => (
                      <button
                        key={thm.id}
                        className={`sports-swatch-circle ${activeTheme === thm.id ? "active" : ""}`}
                        style={{
                          backgroundColor: `#${thm.furColor.toString(16).padStart(6, "0")}`,
                        }}
                        onClick={() => setActiveTheme(thm.id)}
                        title={thm.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="customizer-card-right">
                <button className="sports-hug-btn" onClick={handleHug}>
                  <Heart size={16} /> Hug Model
                </button>
                <button
                  className="sports-cta-btn"
                  onClick={() => setActivePage("shop")}
                >
                  <span>Shop Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. TESTIMONIALS (Kind Words) ── */}
        <section id="testimonials" className="story-section section-testimonials">
          <div className="testimonials-inner">
            <span className="eyebrow-centered">COMMUNITY VOICES</span>
            <h2 className="section-title-centered">Loved by 10,000+ bedrooms nationwide</h2>

            <div className="testimonials-card-grid">
              <div className="testimonial-quote-card">
                <div className="stars-row">★★★★★</div>
                <p className="quote-text">
                  "The weight and velvety softness are unlike any plush toy I've ever owned. My evening anxiety drops the minute I sit with it."
                </p>
                <div className="quote-author">
                  <strong>Elena R.</strong>
                  <span>Verified Adopter &bull; New York</span>
                </div>
              </div>

              <div className="testimonial-quote-card">
                <div className="stars-row">★★★★★</div>
                <p className="quote-text">
                  "The seams are indestructible. My toddler takes her bear everywhere — the car, park, daycare. It still feels brand new."
                </p>
                <div className="quote-author">
                  <strong>Marcus T.</strong>
                  <span>Verified Adopter &bull; Seattle</span>
                </div>
              </div>

              <div className="testimonial-quote-card">
                <div className="stars-row">★★★★★</div>
                <p className="quote-text">
                  "Knowing the poly-down heart is 100% recycled from ocean plastic makes it even better. Pure kindness you can feel."
                </p>
                <div className="quote-author">
                  <strong>Sophia K.</strong>
                  <span>Verified Adopter &bull; Austin</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. CRAFT FAQ ACCORDION (Like thesportsglasses.com) ── */}
        <section id="faq" className="story-section section-faq">
          <div className="faq-inner-container">
            <span className="eyebrow-centered">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="section-title-centered">Everything you need to know about our craft.</h2>

            <div className="faq-accordion-list">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`sports-faq-item ${isOpen ? "open" : ""}`}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  >
                    <div className="faq-question-row">
                      <span className="faq-question-text">{item.q}</span>
                      <div className="faq-toggle-icon">
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </div>
                    </div>
                    {isOpen && (
                      <div className="faq-answer-pane animate-fade-in">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 9. FINAL WORKSHOP CALL TO ACTION ── */}
        <section id="workshop-cta" className="story-section section-cta-footer">
          <div className="cta-footer-card">
            <span className="cta-emoji">🧸</span>
            <h2 className="cta-headline">Ready to welcome your companion home?</h2>
            <p className="cta-sub">
              Every order arrives with an official certificate of adoption, reusable unbleached cotton dustbag, and our 100-Night Softness Guarantee.
            </p>
            <button
              className="sports-cta-btn primary-large"
              onClick={() => setActivePage("shop")}
            >
              <span>Explore The Full Collection</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
