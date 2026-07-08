import React, { useState, useEffect } from "react";
import { productAPI, categoryAPI, getImageUrl } from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { ArrowRight, Sparkles, Star, Truck, Award, ShieldCheck } from "lucide-react";
import "../../style/home/home.css";

const Home = ({ setActivePage, setSelectedProduct, setSelectedCategory }) => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [res, cats] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll()
        ]);
        const activeProducts = (res || []).filter((p) => p.is_active && p.featured_on_homepage);
        setFeaturedProducts(activeProducts.slice(0, 8));
        setCategories(cats || []);
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

  const handleCategoryClick = (categoryName) => {
    if (setSelectedCategory) {
      setSelectedCategory(categoryName);
    }
    setActivePage("shop");
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
          {categories.length > 0 ? categories.map((cat, index) => {
            const bgs = ["soft-toys-bg", "blankets-bg", "pillows-bg", "soft-toys-bg"];
            const bgClass = bgs[index % bgs.length];
            return (
              <div 
                key={cat.id} 
                className={`curated-category-card ${!cat.image_url ? bgClass : ""}`} 
                style={cat.image_url ? { backgroundImage: `url(${getImageUrl(cat.image_url)})` } : {}}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div className="category-card-overlay"></div>
                <div className="category-card-content">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className="explore-link">Explore <ArrowRight size={14} /></span>
                </div>
              </div>
            );
          }) : (
            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", alignItems: "center", height: "30vh", margin: "auto" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: "800", color: "#94a3b8", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>No Category Available</h3>
            </div>
          )}
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
                    src={getImageUrl(product.image_url) || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop"}
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
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30vh", margin: "auto" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: "800", color: "#94a3b8", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>No Favourit Item Avaliable</h3>
          </div>
        )}
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

    </div>
  );
};

export default Home;
