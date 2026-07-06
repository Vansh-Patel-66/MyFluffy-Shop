import React, { useState, useEffect } from "react";
import { productAPI } from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { ArrowRight, Sparkles, Star, Truck, Award, ShieldCheck, Mail } from "lucide-react";
import "../../style/home/home.css";

const Home = ({ setActivePage, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await productAPI.getAll();
        const activeProducts = (res || []).filter((p) => p.is_active);
        // Take the first 3 active products as featured
        setFeaturedProducts(activeProducts.slice(0, 3));
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>NEW WINTER COLLECTION</span>
          </div>

          <h1 className="hero-title">
            Wrap Yourself<br />in <span className="highlight-blue">Comfort.</span>
          </h1>

          <p className="hero-description">
            Handpicked plushies, cloud-soft blankets, and dream-worthy pillows — designed to bring a little more coziness home.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary hero-btn-peach" onClick={() => setActivePage("shop")}>
              Shop the Collection <ArrowRight size={18} />
            </button>
            <button className="btn-secondary hero-btn-ghost" onClick={() => setActivePage("about")}>
              Our Story
            </button>
          </div>

          <div className="hero-ratings-row">
            <div className="avatar-stack">
              <div className="avatar-circle-blue"></div>
              <div className="avatar-circle-blue border-offset"></div>
              <div className="avatar-circle-blue border-offset-2"></div>
            </div>
            <div className="rating-text-group">
              <span className="rating-bold">10k+ happy homes</span>
              <div className="stars-row">
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span className="rating-score">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Panel */}
        <div className="hero-visual-panel">
          <img
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop"
            alt="Cozy bedroom bed setup"
            className="hero-main-img"
          />
          {/* Top-Right Badge */}
          <div className="visual-badge-top-right">
            <span className="badge-text-sm">FREE SHIPPING</span>
            <span className="badge-text-lg">Orders $49+</span>
          </div>
          {/* Bottom-Left Badge */}
          <div className="visual-badge-bottom-left">
            <div className="badge-spark-circle">
              <Sparkles size={16} color="#3b82f6" fill="#3b82f6" />
            </div>
            <div className="badge-text-details">
              <span className="badge-pre">BESTSELLER</span>
              <span className="badge-name">Cloud Bear Plush</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section ("Fan favorites") */}
      <section className="bestsellers-section">
        <div className="section-header-row">
          <div>
            <span className="section-pre-title">BESTSELLERS</span>
            <h2 className="section-main-title">Fan favorites</h2>
          </div>
          <button className="section-link-btn" onClick={() => setActivePage("shop")}>
            Shop all <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="loader-container">
            <span className="spinner"></span>
            <p>Gathering soft fluffy details...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bestseller-product-card" onClick={() => handleProductClick(product)}>
                <div className="product-card-image-box">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop"}
                    alt={product.name}
                    className="product-card-img"
                  />
                  {/* Bestseller/New Badge */}
                  <span className={`product-card-badge ${parseFloat(product.discount) > 0 ? "new" : "bestseller"}`}>
                    {parseFloat(product.discount) > 0 ? "New" : "Bestseller"}
                  </span>
                </div>

                <div className="product-card-meta">
                  <div className="product-card-rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>4.9 (214)</span>
                  </div>
                  <h3 className="product-card-title">{product.name}</h3>
                  <div className="product-card-prices">
                    <span className="current-price">${parseFloat(product.selling_price).toFixed(2)}</span>
                    {parseFloat(product.discount) > 0 && (
                      <span className="crossed-price">${parseFloat(product.cost_price).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products-prompt glass-panel">
            <p>We are stocking up our virtual shelves with fluffy pillows!</p>
            <button className="btn-primary" onClick={() => setActivePage("shop")}>
              Visit Shop Catalog
            </button>
          </div>
        )}
      </section>

      {/* Categories Curated Section */}
      <section className="categories-curated-section">
        <div className="section-header-row">
          <div>
            <span className="section-pre-title">CATEGORIES</span>
            <h2 className="section-main-title">Cozy things, curated</h2>
          </div>
          <button className="section-link-btn" onClick={() => setActivePage("shop")}>
            View all <ArrowRight size={16} />
          </button>
        </div>

        <div className="curated-categories-grid">
          {/* Soft Toys */}
          <div className="curated-category-card soft-toys-bg" onClick={() => { if (setActivePage) { setActivePage("shop"); } }}>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h3>Soft Toys</h3>
              <p>Best friends in plush form</p>
              <span className="explore-link">Explore <ArrowRight size={14} /></span>
            </div>
          </div>

          {/* Blankets */}
          <div className="curated-category-card blankets-bg" onClick={() => { if (setActivePage) { setActivePage("shop"); } }}>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h3>Blankets</h3>
              <p>Cloud-soft warmth, every night</p>
              <span className="explore-link">Explore <ArrowRight size={14} /></span>
            </div>
          </div>

          {/* Pillows */}
          <div className="curated-category-card pillows-bg" onClick={() => { if (setActivePage) { setActivePage("shop"); } }}>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h3>Pillows</h3>
              <p>Dream-worthy comfort, night after night</p>
              <span className="explore-link">Explore <ArrowRight size={14} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Trust Badges Section */}
      <section className="benefits-trust-section">
        <div className="benefit-trust-card glass-panel">
          <div className="benefit-badge-circle">
            <Truck size={20} color="#3b82f6" />
          </div>
          <h4>Free Shipping</h4>
          <p>On orders over $49, always.</p>
        </div>

        <div className="benefit-trust-card glass-panel">
          <div className="benefit-badge-circle">
            <Sparkles size={20} color="#3b82f6" />
          </div>
          <h4>Premium Quality</h4>
          <p>Hand-selected, lab-tested, cloud-soft.</p>
        </div>

        <div className="benefit-trust-card glass-panel">
          <div className="benefit-badge-circle">
            <ShieldCheck size={20} color="#3b82f6" />
          </div>
          <h4>Secure Checkout</h4>
          <p>256-bit SSL. Your data stays safe.</p>
        </div>
      </section>

      {/* Redesigned Footer Section */}
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
    </div>
  );
};

export default Home;
