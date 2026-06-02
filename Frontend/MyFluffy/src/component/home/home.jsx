import React, { useState, useEffect } from "react";
import { productAPI } from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { ArrowRight, Sparkles, Heart, Eye, ShoppingCart, Truck, ShieldCheck, Award } from "lucide-react";
import "../../style/home/home.css";

const Home = ({ userEmail, onLogout, setActivePage, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await productAPI.getAll();
        // Take the first 3 active products as featured
        const activeProducts = (res || []).filter((p) => p.is_active);
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
      {/* Hero Welcome Banners */}
      <section className="hero-banner">
        <div className="hero-inner">
          <div className="hero-text-content">
            <div className="hero-sparkle-badge">
              <Sparkles size={16} /> <span>100% Organic Materials</span>
            </div>
            <h1>The Softest Corner of the Internet</h1>
            <p className="hero-tagline">
              Discover cloud-like pillows, lovable plushies, and velvety blankets custom crafted to bring warmth and happiness to your home.
            </p>
            <div className="hero-cta-group">
              <button className="btn-primary" onClick={() => setActivePage("shop")}>
                Explore Collection <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => setActivePage("contact")}>
                Talk to Us
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-circle-bg"></div>
            <div className="hero-promo-card glass-panel">
              <span className="promo-badge">HOT DEAL</span>
              <h3>Fluffy Cuddle Cloud</h3>
              <p>Save 20% on our premium oversized pillows this week!</p>
              <button className="btn-primary mini-btn" onClick={() => setActivePage("shop")}>
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badging benefits */}
      <section className="benefits-section">
        <div className="benefit-card glass-panel">
          <div className="benefit-icon-wrapper blue-wrapper">
            <Truck size={24} color="var(--primary)" />
          </div>
          <h4>Free Premium Shipping</h4>
          <p>Delivered carefully to your doorstep within 3-5 business days at zero cost.</p>
        </div>
        <div className="benefit-card glass-panel">
          <div className="benefit-icon-wrapper pink-wrapper">
            <Award size={24} color="var(--secondary)" />
          </div>
          <h4>Hypoallergenic Stuffing</h4>
          <p>Fully certified anti-dustmite, ultra-soft combed polyester fiberfill.</p>
        </div>
        <div className="benefit-card glass-panel">
          <div className="benefit-icon-wrapper green-wrapper">
            <ShieldCheck size={24} color="var(--success)" />
          </div>
          <h4>100-Night Guarantee</h4>
          <p>Not soft enough? Return your item within 100 nights for a 100% full refund.</p>
        </div>
      </section>

      {/* Featured collection cards */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <span className="section-pre">RECOMMENDED ITEMS</span>
            <h2>Top Rated Cuddlies</h2>
          </div>
          <button className="view-all-btn" onClick={() => setActivePage("shop")}>
            Browse All Products ➔
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
              <div key={product.id} className="product-card glass-panel">
                <div className="product-image-container" onClick={() => handleProductClick(product)}>
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop"}
                    alt={product.name}
                    className="product-img"
                  />
                  <div className="card-overlay-actions">
                    <button className="action-circle-btn" title="View details" onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}>
                      <Eye size={18} />
                    </button>
                    <button className="action-circle-btn" title="Add to Wishlist" onClick={(e) => { e.stopPropagation(); }}>
                      <Heart size={18} />
                    </button>
                  </div>
                  {parseFloat(product.discount) > 0 && (
                    <span className="discount-tag">-{parseFloat(product.discount)}% OFF</span>
                  )}
                </div>

                <div className="product-details-content">
                  <h3 className="product-name" onClick={() => handleProductClick(product)}>{product.name}</h3>
                  <p className="product-desc-brief">{product.description?.substring(0, 60)}...</p>
                  
                  <div className="product-price-row">
                    <div className="pricing">
                      <span className="selling-price">₹{parseFloat(product.selling_price).toFixed(2)}</span>
                      {parseFloat(product.discount) > 0 && (
                        <span className="old-price">₹{parseFloat(product.cost_price).toFixed(2)}</span>
                      )}
                    </div>
                    <button className="add-cart-mini-btn" onClick={() => addToCart(product)}>
                      <ShoppingCart size={16} /> Add
                    </button>
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

      {/* Styled CTA category grid */}
      <section className="categories-promo">
        <h2 className="promo-title">Shop by Softness</h2>
        <div className="category-promo-grid">
          <div className="category-promo-card plushies-card" onClick={() => setActivePage("shop")}>
            <div className="overlay"></div>
            <div className="content">
              <h3>🧸 Plushies</h3>
              <p>Stuffed companions for all ages</p>
              <span>Explore ➔</span>
            </div>
          </div>
          <div className="category-promo-card pillows-card" onClick={() => setActivePage("shop")}>
            <div className="overlay"></div>
            <div className="content">
              <h3>☁️ Cloud Pillows</h3>
              <p>Ergonomic neck support sleeping pads</p>
              <span>Explore ➔</span>
            </div>
          </div>
          <div className="category-promo-card blankets-card" onClick={() => setActivePage("shop")}>
            <div className="overlay"></div>
            <div className="content">
              <h3>🧤 Heavy Blankets</h3>
              <p>Therapeutic weighted stress reliefs</p>
              <span>Explore ➔</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
