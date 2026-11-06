import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { productAPI, categoryAPI, getImageUrl } from "../../utils/api";
import { formatPrice, getEffectivePrice } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { Star, Search, SlidersHorizontal, ShoppingBag, X, Sparkles, ArrowDown } from "lucide-react";
import "../../style/shop.css";

const ITEMS_PER_ROW = 3;
const INITIAL_ROWS = 3; // Top 3 rows visible on page load = 9 items

const Shop = ({ setSelectedProduct, selectedCategory: externalCategory, setSelectedCategory: setExternalCategory }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(150);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // Scroll reveal state: starts with 3 rows (9 products)
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);
  const [isLoadingNextRow, setIsLoadingNextRow] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const fetchShopCatalog = async () => {
      try {
        setLoading(true);
        const [prodsData, catsData] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setProducts(prodsData || []);
        setCategories(catsData || []);
      } catch (err) {
        console.error("Error fetching catalog data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopCatalog();
  }, []);

  // Sync external category filter from Navbar if set
  useEffect(() => {
    if (externalCategory) {
      const cat = categories.find(
        (c) =>
          c.id === externalCategory ||
          c.name.toLowerCase().includes(externalCategory.toLowerCase()) ||
          externalCategory.toLowerCase().includes(c.name.toLowerCase()) ||
          (externalCategory.toLowerCase() === "soft toys" && c.name.toLowerCase().includes("plush"))
      );
      if (cat) {
        setSelectedCategory(cat.id);
      } else if (externalCategory === "all") {
        setSelectedCategory("all");
      }
    }
  }, [externalCategory, categories]);

  // Reset to top 3 rows whenever any filter changes
  useEffect(() => {
    setVisibleRows(INITIAL_ROWS);
  }, [selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  const handleProductClick = (product) => {
    if (setSelectedProduct) {
      setSelectedProduct(product);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (setExternalCategory) {
      setExternalCategory(catId);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(150);
    setInStockOnly(false);
    setSortBy("featured");
    setVisibleRows(INITIAL_ROWS);
    if (setExternalCategory) {
      setExternalCategory("all");
    }
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!product.is_active) return false;

        if (selectedCategory !== "all" && product.category_id !== selectedCategory) {
          return false;
        }

        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const nameMatches = (product.name || "").toLowerCase().includes(q);
          const descMatches = (product.description || "").toLowerCase().includes(q);
          if (!nameMatches && !descMatches) return false;
        }

        if (inStockOnly && (product.stock || 0) <= 0) {
          return false;
        }

        const effectivePrice = getEffectivePrice(product.selling_price, product.discount);
        if (effectivePrice > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = getEffectivePrice(a.selling_price, a.discount);
        const priceB = getEffectivePrice(b.selling_price, b.discount);

        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        if (sortBy === "alpha") return a.name.localeCompare(b.name);
        // Featured
        if (a.featured_on_homepage && !b.featured_on_homepage) return -1;
        if (!a.featured_on_homepage && b.featured_on_homepage) return 1;
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, maxPrice, sortBy]);

  const totalFilteredCount = filteredProducts.length;
  const totalAvailableRows = Math.ceil(totalFilteredCount / ITEMS_PER_ROW);
  const currentVisibleCount = Math.min(visibleRows * ITEMS_PER_ROW, totalFilteredCount);
  const visibleProducts = filteredProducts.slice(0, currentVisibleCount);
  const hasMoreRows = visibleRows < totalAvailableRows;

  // Reveal next row function
  const revealNextRow = useCallback(() => {
    if (hasMoreRows && !isLoadingNextRow) {
      setIsLoadingNextRow(true);
      setTimeout(() => {
        setVisibleRows((prev) => prev + 1);
        setIsLoadingNextRow(false);
      }, 250);
    }
  }, [hasMoreRows, isLoadingNextRow]);

  // Scroll observer: triggers next row reveal automatically when user scrolls near the bottom
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMoreRows) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRows && !isLoadingNextRow) {
          revealNextRow();
        }
      },
      { root: null, rootMargin: "250px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreRows, isLoadingNextRow, revealNextRow]);

  return (
    <div className="shop-page animate-fade-in">
      {/* ── SHOP HERO HEADER ── */}
      <header className="shop-hero-header">
        <span className="shop-eyebrow">OUR COLLECTION</span>
        <h1 className="shop-page-title">Curated Comfort Catalog</h1>
        <p className="shop-page-sub">
          Handcrafted plushies, velveteen blankets, and cloud contour pillows — designed for genuine coziness.
        </p>

        {/* Global Catalog Search Bar */}
        <div className="shop-search-bar-wrap">
          <Search size={18} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Search plushies, blankets, pillows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shop-search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      <div className="shop-layout">
        {/* ── SIDEBAR FILTERS ── */}
        <aside className="shop-sidebar">
          <div className="sidebar-header-row">
            <span className="sidebar-filter-title">
              <SlidersHorizontal size={16} /> Filters
            </span>
            {(selectedCategory !== "all" || searchQuery || maxPrice < 150 || inStockOnly) && (
              <button className="reset-filters-btn" onClick={handleResetFilters}>
                Reset All
              </button>
            )}
          </div>

          {/* Categories Selector */}
          <div className="sidebar-group">
            <h4 className="sidebar-heading">Category</h4>
            <div className="category-pill-list">
              <button
                className={`category-pill-btn ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => handleCategorySelect("all")}
              >
                <span>All Products</span>
                <span className="pill-count">{products.filter((p) => p.is_active).length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.is_active && p.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    className={`category-pill-btn ${selectedCategory === cat.id ? "active" : ""}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <span>{cat.name}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="sidebar-rule" />

          {/* Price Range Slider */}
          <div className="sidebar-group">
            <div className="sidebar-heading-row">
              <h4 className="sidebar-heading">Max Price</h4>
              <span className="price-tag-callout">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="price-slider-input"
            />
            <div className="price-slider-range-labels">
              <span>$20</span>
              <span>$150</span>
            </div>
          </div>

          <hr className="sidebar-rule" />

          {/* In-Stock Filter */}
          <div className="sidebar-group">
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="filter-checkbox"
              />
              <span className="checkbox-text">In-stock only</span>
            </label>
          </div>

          <hr className="sidebar-rule" />

          {/* Sort By Dropdown */}
          <div className="sidebar-group">
            <h4 className="sidebar-heading">Sort By</h4>
            <div className="select-container">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="boutique-select"
              >
                <option value="featured">Featured & Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </aside>

        {/* ── MAIN PRODUCT SHELF ── */}
        <main className="shop-main">
          {/* Results Header Status */}
          <div className="catalog-meta-bar">
            <p className="results-count-text">
              Showing <strong>{currentVisibleCount}</strong> of <strong>{totalFilteredCount}</strong> cozy pieces
            </p>
            {hasMoreRows && (
              <span className="scroll-hint-pill">
                <ArrowDown size={13} className="bounce-arrow-icon" /> Scroll down to unfold more rows
              </span>
            )}
          </div>

          {loading ? (
            <div className="catalog-loading-shelf">
              <span className="spinner"></span>
              <p>Fetching cozy products...</p>
            </div>
          ) : visibleProducts.length > 0 ? (
            <>
              {/* Product Grid: 3 Clean Columns with Top 3 Rows Initially */}
              <div className="products-grid-three">
                {visibleProducts.map((product, index) => {
                  const effectivePrice = getEffectivePrice(product.selling_price, product.discount);
                  const hasDiscount = parseFloat(product.discount) > 0;
                  const isLowStock = (product.stock || 0) > 0 && (product.stock || 0) <= 5;
                  const imgSource = getImageUrl(product.image_url) || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop";

                  return (
                    <article
                      key={product.id}
                      className="product-boutique-card"
                      style={{ animationDelay: `${(index % ITEMS_PER_ROW) * 0.08}s` }}
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
                          {isLowStock && (
                            <span className="boutique-tag tag-lowstock">
                              Only {product.stock} Left
                            </span>
                          )}
                        </div>

                        {/* Quick Add Overlay */}
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

              {/* Sentinel element to trigger scroll loading for next row */}
              <div ref={sentinelRef} className="scroll-sentinel-anchor">
                {hasMoreRows ? (
                  <div className="scroll-loading-more">
                    <span className="spinner-sm"></span>
                    <span>Unfolding next cozy row...</span>
                  </div>
                ) : (
                  <div className="end-of-collection-banner">
                    <Sparkles size={16} color="var(--primary)" />
                    <span>You've seen all {totalFilteredCount} cozy handcrafted pieces.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-matches-container">
              <div className="no-matches-icon">🔍</div>
              <h3>No matching items found</h3>
              <p>Try clearing filters or adjusting your search keyword.</p>
              <button className="btn-secondary" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
