import React, { useState, useEffect } from "react";
import { productAPI, categoryAPI, getImageUrl } from "../../utils/api";
import { formatPrice, getEffectivePrice } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { ArrowRight, Sparkles, Star, Truck, ShieldCheck, Heart, Eye, ShoppingBag } from "lucide-react";
import "../../style/home/home.css";

const Home = ({ setActivePage, setSelectedProduct, setSelectedCategory }) => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeCatalog = async () => {
      try {
        const [res, cats] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        const allProducts = res || [];
        const featured = allProducts.filter((p) => p.is_active && p.featured_on_homepage);
        // Fallback to first 8 active products if none flagged featured
        const displayList = featured.length > 0 ? featured : allProducts.filter((p) => p.is_active).slice(0, 8);
        setFeaturedProducts(displayList.slice(0, 8));
        setCategories(cats || []);
      } catch (err) {
        console.error("Error fetching home catalog data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeCatalog();
  }, []);

  const handleProductClick = (product) => {
    if (setSelectedProduct) {
      setSelectedProduct(product);
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (setSelectedCategory) {
      setSelectedCategory(categoryName);
    }
    setActivePage("shop");
  };

  return (
    <div className="home-container animate-fade-in">
      {/* ── 1. EDITORIAL HERO SECTION ── */}
      <section className="hero-editorial">
        <div className="hero-editorial-grid">
          <div className="hero-text-column">
            <div className="hero-pill-badge">
              <Sparkles size={14} className="hero-pill-icon" />
              <span>THE HEIRLOOM COMFORT EDIT</span>
            </div>

            <h1 className="hero-heading">
              Wrap yourself in <span className="hero-heading-italic">pure, cloud-soft</span> comfort.
            </h1>

            <p className="hero-subheading">
              Artisan plushies, weighted velveteen blankets, and restorative contour pillows — thoughtfully designed to make your home the softest sanctuary on earth.
            </p>

            <div className="hero-action-row">
              <button
                className="btn-primary hero-main-btn"
                onClick={() => setActivePage("shop")}
              >
                Explore Collection <ArrowRight size={17} />
              </button>
              <button
                className="btn-secondary hero-story-btn"
                onClick={() => setActivePage("about")}
              >
                Our Soft Philosophy
              </button>
            </div>

            {/* Social proof strip */}
            <div className="hero-social-proof">
              <div className="customer-avatars-cluster">
                <span className="customer-avatar-dot" style={{ background: "#2563eb" }}>🧸</span>
                <span className="customer-avatar-dot" style={{ background: "#0284c7" }}>✨</span>
                <span className="customer-avatar-dot" style={{ background: "#3b82f6" }}>🤍</span>
              </div>
              <div className="social-proof-meta">
                <div className="stars-cluster">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                  <span className="rating-score-num">4.96 / 5.0</span>
                </div>
                <p className="social-proof-caption">Loved by 14,000+ cozy homes nationwide</p>
              </div>
            </div>
          </div>

          <div className="hero-image-column">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?q=80&w=1200&auto=format&fit=crop"
                alt="Cozy tactile lifestyle pillows and blankets"
                className="hero-featured-image"
              />
              <div className="hero-overlay-tag top-right">
                <span className="tag-micro">COMPLIMENTARY</span>
                <span className="tag-prominent">Free US Shipping $49+</span>
              </div>
              <div className="hero-overlay-tag bottom-left">
                <div className="tag-icon-circle">
                  <Sparkles size={16} color="#2563eb" />
                </div>
                <div>
                  <span className="tag-micro">FAN FAVORITE</span>
                  <span className="tag-prominent">Cloud Bear Companion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. BRAND PILLARS STRIP ── */}
      <section className="brand-pillars-bar">
        <div className="pillars-container">
          <div className="pillar-item">
            <div className="pillar-icon-box">
              <Truck size={20} />
            </div>
            <div className="pillar-text">
              <h4>Free Shipping & Returns</h4>
              <p>Complimentary US delivery on orders over $49</p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon-box">
              <Sparkles size={20} />
            </div>
            <div className="pillar-text">
              <h4>OEKO-TEX Certified</h4>
              <p>Hypoallergenic, ultra-dense micro-plush fibers</p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon-box">
              <ShieldCheck size={20} />
            </div>
            <div className="pillar-text">
              <h4>100-Night Guarantee</h4>
              <p>Sleep, cuddle, and adore — or your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CURATED COLLECTIONS ── */}
      <section className="curated-section">
        <div className="section-head-flex">
          <div>
            <span className="section-eyebrow">CURATED ROOMS</span>
            <h2 className="section-heading">Designed for your quietest moments</h2>
          </div>
          <button className="section-view-all" onClick={() => setActivePage("shop")}>
            View all categories <ArrowRight size={16} />
          </button>
        </div>

        <div className="curated-grid">
          {categories.length > 0 ? (
            categories.map((cat, idx) => {
              // High aesthetic fallbacks if no image is stored
              const fallbackImages = [
                "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=800&auto=format&fit=crop",
              ];
              const bgImg = cat.image_url ? getImageUrl(cat.image_url) : fallbackImages[idx % fallbackImages.length];

              return (
                <div
                  key={cat.id}
                  className="curated-card"
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="curated-card-bg" style={{ backgroundImage: `url(${bgImg})` }} />
                  <div className="curated-card-gradient" />
                  <div className="curated-card-body">
                    <span className="curated-card-count">0{idx + 1} &bull; Series</span>
                    <h3 className="curated-card-title">{cat.name}</h3>
                    <p className="curated-card-desc">{cat.description || "Crafted with cloud-loft fiberfill and sensory velveteen softness."}</p>
                    <span className="curated-card-btn">
                      Shop Category <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-catalog-box">
              <p>Gathering curated collections...</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. FAN FAVORITES / BESTSELLERS ── */}
      <section className="bestsellers-section">
        <div className="section-head-flex">
          <div>
            <span className="section-eyebrow">COMMUNITY FAVORITES</span>
            <h2 className="section-heading">The pieces everyone is falling for</h2>
          </div>
          <button className="section-view-all" onClick={() => setActivePage("shop")}>
            Shop full catalog <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="catalog-loading-shelf">
            <span className="spinner"></span>
            <p>Fetching plush pieces...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="bestsellers-grid">
            {featuredProducts.map((product) => {
              const effectivePrice = getEffectivePrice(product.selling_price, product.discount);
              const hasDiscount = parseFloat(product.discount) > 0;
              const imgSource = getImageUrl(product.image_url) || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop";

              return (
                <article
                  key={product.id}
                  className="product-boutique-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-image-container">
                    <img
                      src={imgSource}
                      alt={product.name}
                      className="product-card-thumbnail"
                      loading="lazy"
                    />

                    {/* Tag badges */}
                    <div className="product-badge-rack">
                      {hasDiscount && (
                        <span className="boutique-tag tag-discount">
                          Save {Math.round(parseFloat(product.discount))}%
                        </span>
                      )}
                      {product.featured_on_homepage && (
                        <span className="boutique-tag tag-bestseller">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Quick action overlay */}
                    <div className="product-card-hover-actions">
                      <button
                        className="quick-add-btn"
                        title="Add to Bag"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                        }}
                      >
                        <ShoppingBag size={16} /> Quick Add
                      </button>
                    </div>
                  </div>

                  <div className="product-content-block">
                    <div className="product-rating-line">
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                      <span className="rating-count">(400+)</span>
                    </div>

                    <h3 className="product-title-text">{product.name}</h3>

                    <div className="product-price-row">
                      <span className="price-effective">{formatPrice(effectivePrice)}</span>
                      {hasDiscount && (
                        <span className="price-original">{formatPrice(product.selling_price)}</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-catalog-box">
            <p>Catalog items will appear here shortly.</p>
          </div>
        )}
      </section>

      {/* ── 5. EDITORIAL CRAFT STORY ── */}
      <section className="craft-story-section">
        <div className="craft-story-grid">
          <div className="craft-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000&auto=format&fit=crop"
              alt="Soft natural wool and pillows"
              className="craft-image"
            />
            <div className="craft-floating-card">
              <span className="floating-card-quote">"The softest texture to ever grace our bedroom."</span>
              <span className="floating-card-author">&mdash; Architectural Digest Home</span>
            </div>
          </div>

          <div className="craft-copy-wrap">
            <span className="section-eyebrow">OUR CRAFT</span>
            <h2 className="section-heading">Why MyFluffy feels unlike anything else.</h2>
            <p className="craft-lead-p">
              We spent eighteen months perfecting our proprietary CloudFluff™ micro-denier fibers. Each plush companion and pillow is balanced with just enough heft to evoke genuine calm.
            </p>

            <ul className="craft-checklist">
              <li>
                <div className="check-bullet">&bull;</div>
                <div>
                  <strong>Hypoallergenic Silky Plush</strong>
                  <p>Zero static, lint-free, and safe for sensitive skin of all ages.</p>
                </div>
              </li>
              <li>
                <div className="check-bullet">&bull;</div>
                <div>
                  <strong>Reinforced Double-Stitched Seams</strong>
                  <p>Built for a lifetime of hugs, washes, and cozy movie nights.</p>
                </div>
              </li>
              <li>
                <div className="check-bullet">&bull;</div>
                <div>
                  <strong>Ethically & Sustainably Stuffed</strong>
                  <p>Filled with 100% recycled poly-down clusters.</p>
                </div>
              </li>
            </ul>

            <button className="btn-primary" onClick={() => setActivePage("about")}>
              <Sparkles size={16} /> Explore Our Story in 3D <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. REAL CUSTOMER REVIEWS ── */}
      <section className="testimonials-section">
        <div className="testimonials-head">
          <span className="section-eyebrow">KIND WORDS</span>
          <h2 className="section-heading">Loved by sleepers & snugglers everywhere</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p className="testimonial-quote">
              "I purchased the Cloud Bear for my daughter and immediately ordered two more pillows for our master bedroom. The softness is truly extraordinary."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Clara Vance</span>
              <span className="author-location">Seattle, WA &bull; Verified Cozy Owner</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p className="testimonial-quote">
              "The Velveteen Blanket has replaced every throw on our sofa. It has that weighty, soothing luxury drape you usually only find in 5-star Swiss chalets."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Marcus Sterling</span>
              <span className="author-location">Denver, CO &bull; Verified Cozy Owner</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p className="testimonial-quote">
              "My chronic neck aches vanished after switching to the Contour Cloud Pillow. It cradles your head without flattening out. Essential purchase."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Elena Rostova</span>
              <span className="author-location">Brooklyn, NY &bull; Verified Cozy Owner</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
