import React, { useState } from "react";
import Fluffy3DViewer from "./Fluffy3DViewer";
import {
  Heart,
  Leaf,
  Sparkles,
  Users,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  Compass,
  Smile,
  Layers,
  Scissors,
  CheckCircle2
} from "lucide-react";
import "../../style/about.css";

const STORY_CHAPTERS = [
  {
    chapter: 1,
    tag: "THE SPARK • 2021",
    title: "A world in need of genuine softness.",
    subtitle: "Why does most home decor feel scratchy, hollow, or mass-produced without soul?",
    desc: "In late 2021, amidst noisy, screen-dominated days, we noticed how difficult it was to find a plush companion that didn't feel synthetic or flimsy. We dreamed of creating something with comforting weight, silky micro-denier fleece, and a reassuring presence that calms your nervous system the moment your hands touch it.",
    quote: "“We didn’t just want to make toys. We wanted to manufacture tangible comfort.”",
    badge: "Chapter 1: The Origin",
    stat: "18 Months of Prototyping",
    toyHint: "Observe the balanced proportions and seated posture designed for natural cuddling.",
  },
  {
    chapter: 2,
    tag: "THE CRAFT • CloudFluff™",
    title: "18 months to engineer the perfect stitch.",
    subtitle: "Double-reinforced lock-stitch seams and ultra-fine fibers.",
    desc: "Every plushie is crafted using our proprietary CloudFluff™ weave — microscopic filaments 100 times finer than a human hair that eliminate static, resist lint, and stay silky wash after wash. Each seam is hand-turned and double-stitched with high-tensile core thread, rated to withstand over 45 pounds of loving bedtime tugs.",
    quote: "“Turn it around, inspect every curve. No loose threads, no shortcuts, just pure velvet bliss.”",
    badge: "Chapter 2: Seam Perfection",
    stat: "45 lbs Seam Tensile Strength",
    toyHint: "Notice the close-up camera focusing on the velvet muzzle, ears, and hand-embroidered nose.",
  },
  {
    chapter: 3,
    tag: "THE HEART • Sustainability",
    title: "Filled with a 100% recycled eco-heart.",
    subtitle: "Turning ocean-bound bottles into cloud-soft poly-down.",
    desc: "Underneath every velvety exterior beats a heart of pure kindness. We stuff every companion exclusively with certified 100% post-consumer recycled poly-down clusters. Cleaned without toxic bleaches and fluffed in small batches so your companion retains its buoyant, squishable rebound forever without clumping.",
    quote: "“Kindness to your bedroom should never come at the expense of our planet.”",
    badge: "Chapter 3: The Glowing Heart",
    stat: "14 Plastic Bottles Saved / Bear",
    toyHint: "Look closely at the bear's chest — see the glowing heart beating with sustainable warmth!",
  },
  {
    chapter: 4,
    tag: "THE COMMUNION • 10,000+ Homes",
    title: "Adopted by 10,000+ cozy bedrooms.",
    subtitle: "From newborn nurseries to college dorms and quiet reading nooks.",
    desc: "What started on a wooden kitchen workbench now warms over ten thousand nightstands, couches, and beds across the country. Each package leaves our workshop wrapped in a breathable unbleached cotton dustbag, accompanied by a numbered certificate of adoption and our lifetime seam guarantee.",
    quote: "“The best gift you can give anyone — including yourself — is an invitation to exhale.”",
    badge: "Chapter 4: The Community",
    stat: "4.9 / 5 Rating Across 3,200+ Reviews",
    toyHint: "The bear celebrates with friendly waves and sparkling fluff particles for our wonderful community!",
  },
];

const AboutUs = ({ setActivePage }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const activeChapterData = STORY_CHAPTERS[currentChapter];

  const handleNextChapter = () => {
    setCurrentChapter((prev) => (prev + 1) % STORY_CHAPTERS.length);
  };

  const handlePrevChapter = () => {
    setCurrentChapter((prev) => (prev - 1 + STORY_CHAPTERS.length) % STORY_CHAPTERS.length);
  };

  return (
    <div className="about-page animate-fade-in">

      {/* ── 1. 3D LIVING STORY HERO STAGE ── */}
      <section className="about-3d-hero-section">
        <div className="story-hero-header">
          <div className="story-eyebrow-badge">
            <Sparkles size={14} className="sparkle-bounce" />
            <span>INTERACTIVE 3D EXPERIENCE</span>
          </div>
          <h1 className="about-hero-title">
            Our Story, <span className="about-hero-accent">Shaped in 3D.</span>
          </h1>
          <p className="about-hero-desc">
            Explore our handcrafted plush companion in full 360° interactive 3D, and follow the journey of how a simple desire for comfort grew into a sanctuary for 10,000+ snugglers.
          </p>
        </div>

        {/* 3D Stage Grid: 3D Toy Viewer on Left, Animated Chapter Story on Right */}
        <div className="story-3d-stage-grid">
          {/* Left: 3D Interactive Toy Viewer */}
          <div className="story-3d-toy-column">
            <Fluffy3DViewer currentChapter={currentChapter} />
          </div>

          {/* Right: Living Chapter Story Card */}
          <div className="story-chapter-column">
            <div className="chapter-card-inner">
              {/* Stepper Navigation */}
              <div className="chapter-nav-bar">
                <span className="chapter-pill-tag">{activeChapterData.tag}</span>
                <div className="chapter-stepper-dots">
                  {STORY_CHAPTERS.map((ch, idx) => (
                    <button
                      key={ch.chapter}
                      className={`step-dot ${idx === currentChapter ? "active" : ""}`}
                      onClick={() => setCurrentChapter(idx)}
                      title={`Go to Chapter ${ch.chapter}`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Chapter Content */}
              <div className="chapter-narrative-block">
                <span className="chapter-badge-label">{activeChapterData.badge}</span>
                <h2 className="chapter-title">{activeChapterData.title}</h2>
                <h3 className="chapter-subtitle">{activeChapterData.subtitle}</h3>
                <p className="chapter-description">{activeChapterData.desc}</p>

                <blockquote className="chapter-quote">
                  {activeChapterData.quote}
                </blockquote>

                {/* 3D Toy Hint */}
                <div className="chapter-3d-hint">
                  <span className="hint-icon">🧸</span>
                  <p><strong>3D Interaction:</strong> {activeChapterData.toyHint}</p>
                </div>

                {/* Milestone Stat Highlight */}
                <div className="chapter-stat-strip">
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span>{activeChapterData.stat}</span>
                </div>
              </div>

              {/* Chapter Controls Footer */}
              <div className="chapter-card-footer">
                <div className="chapter-nav-btns">
                  <button
                    className="chapter-control-btn prev"
                    onClick={handlePrevChapter}
                    aria-label="Previous Chapter"
                  >
                    <ChevronLeft size={18} /> Prev
                  </button>
                  <span className="chapter-count-text">
                    Chapter <strong>0{activeChapterData.chapter}</strong> of 0{STORY_CHAPTERS.length}
                  </span>
                  <button
                    className="chapter-control-btn next"
                    onClick={handleNextChapter}
                    aria-label="Next Chapter"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THE STORY CONTINUES: ANATOMY OF SOFTNESS ── */}
      <section className="about-anatomy-section">
        <div className="anatomy-header">
          <span className="about-section-pre">THE ANATOMY OF A HUG</span>
          <h2 className="about-mission-title">Layered with obsessive care from core to fur.</h2>
          <p className="anatomy-sub">
            A great plushie is an engineering feat of touch. Here is what makes every MyFluffy companion comforting down to the millimeter.
          </p>
        </div>

        <div className="anatomy-layers-grid">
          <div className="anatomy-card">
            <div className="anatomy-icon-box">
              <Layers size={24} color="var(--primary)" />
            </div>
            <span className="layer-step-num">LAYER 01</span>
            <h3 className="anatomy-card-title">CloudFluff™ Velvet Fur</h3>
            <p className="anatomy-card-desc">
              Spun with 0.8-denier peach-finish microfiber. Tested to eliminate static, resist bedroom dust, and remain silky soft through hundreds of snuggles.
            </p>
          </div>

          <div className="anatomy-card">
            <div className="anatomy-icon-box">
              <Scissors size={24} color="#d97706" />
            </div>
            <span className="layer-step-num">LAYER 02</span>
            <h3 className="anatomy-card-title">Interlocking Seam Shield</h3>
            <p className="anatomy-card-desc">
              Every interior seam is overlocked with high-density polyester cord, ensuring zero bursting even during the most enthusiastic pillow fights.
            </p>
          </div>

          <div className="anatomy-card">
            <div className="anatomy-icon-box">
              <Leaf size={24} color="#16a34a" />
            </div>
            <span className="layer-step-num">LAYER 03</span>
            <h3 className="anatomy-card-title">Ocean-Bound Poly-Down</h3>
            <p className="anatomy-card-desc">
              100% GRS-certified recycled down clusters that yield a weighted, marshmallow-like squeeze without ever clumping or losing their bounce.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. WORKSHOP JOURNEY (FROM SKETCH TO SNUGGLE) ── */}
      <section className="about-workshop-section">
        <div className="workshop-header">
          <span className="about-section-pre">THE WORKSHOP JOURNEY</span>
          <h2 className="about-mission-title">From artisan sketchbook to your bedroom door.</h2>
        </div>

        <div className="workshop-timeline-grid">
          <div className="workshop-step-card">
            <div className="step-badge">01</div>
            <h4>Character Clay Sculpting</h4>
            <p>Every bear starts as a physical clay sculpt to test ergonomic hug curves before pattern drafting.</p>
          </div>

          <div className="workshop-step-card">
            <div className="step-badge">02</div>
            <h4>Hand-Cut Zero-Waste Velour</h4>
            <p>Fabric rolls are cut in micro-batches to eliminate textile scrap waste, with scraps saved for miniature accessories.</p>
          </div>

          <div className="workshop-step-card">
            <div className="step-badge">03</div>
            <h4>Artisanal Embroidery & Stitches</h4>
            <p>Noses, paw pads, and safety eyes are individually set by makers with over a decade of plush experience.</p>
          </div>

          <div className="workshop-step-card">
            <div className="step-badge">04</div>
            <h4>Adoption & Unbleached Cotton Bag</h4>
            <p>Each friend is brushed, assigned an individual adoption certificate, and gently nestled in a reusable canvas pouch.</p>
          </div>
        </div>
      </section>

      {/* ── 4. WHY FAMILIES TRUST US ── */}
      <section className="about-why-section">
        <div className="about-why-header">
          <span className="about-section-pre">OUR CORE PROMISES</span>
          <h2 className="about-why-title">Softer standards. Honest materials.</h2>
        </div>
        <div className="about-why-grid">
          <div className="about-why-card">
            <div className="about-why-icon">
              <Heart size={22} color="var(--primary)" />
            </div>
            <h3>Handcrafted with Soul</h3>
            <p>Every stitch made by independent artisans who receive living wages and creative ownership.</p>
          </div>
          <div className="about-why-card">
            <div className="about-why-icon">
              <Leaf size={22} color="#16a34a" />
            </div>
            <h3>100% Non-Toxic & Clean</h3>
            <p>OEKO-TEX certified fabrics free from harsh chemical finishes, phthalates, and synthetic dyes.</p>
          </div>
          <div className="about-why-card">
            <div className="about-why-icon">
              <Award size={22} color="#f59e0b" />
            </div>
            <h3>100-Night Softness Guarantee</h3>
            <p>Take 100 nights to test the cuddle. If it doesn't bring unconditional calm, returns are easy and free.</p>
          </div>
          <div className="about-why-card">
            <div className="about-why-icon">
              <ShieldCheck size={22} color="#8b5cf6" />
            </div>
            <h3>Lifetime Seam Warranty</h3>
            <p>If a seam ever unravels over years of love, send it to our workshop and we will mend it for life.</p>
          </div>
        </div>
      </section>

      {/* ── 5. FINAL CALL TO ACTION ── */}
      <section className="about-cta-section">
        <div className="cta-emblem-wrap">
          <span className="cta-emblem-emoji">🧸</span>
        </div>
        <h2 className="about-cta-title">Your next cozy companion is waiting for you.</h2>
        <p className="about-cta-desc">
          Browse our boutique collection of handcrafted plushies, velvety blankets, and cloud contour pillows — each crafted to make home feel like home.
        </p>
        <button className="btn-primary about-cta-btn" onClick={() => setActivePage("shop")}>
          Explore The Collection <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
};

export default AboutUs;
