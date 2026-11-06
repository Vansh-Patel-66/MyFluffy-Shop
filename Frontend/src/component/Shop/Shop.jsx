import React, { useState, useEffect, useMemo } from "react";
import { productAPI, categoryAPI, getImageUrl } from "../../utils/api";
import { formatPrice, getEffectivePrice } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { Star, Search, SlidersHorizontal, ShoppingBag, X, ChevronLeft, ChevronRight } from "lucide-react";
import "../../style/shop.css";

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

  // Pagination state: default 3 items per page to satisfy requirement
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

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

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy, itemsPerPage]);

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
    setCurrentPage(1);
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

  // Pagination slicing
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (p) => {
    const pageNum = Math.max(1, Math.min(p, totalPages));
    setCurrentPage(pageNum);
    // Smooth scroll to top of catalog
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

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
          {/* Results count & Page Size Selector Bar */}
          <div className="catalog-meta-bar">
            <p className="results-count-text">
              Showing <strong>{totalItems > 0 ? `${startIndex + 1}–${endIndex}` : 0}</strong> of <strong>{totalItems}</strong> items
            </p>

            <div className="per-page-selector">
              <span className="per-page-label">Show per page:</span>
              <div className="per-page-btns">
                {[3, 6, 9].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`per-page-btn ${itemsPerPage === size ? "active" : ""}`}
                    onClick={() => setItemsPerPage(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="catalog-loading-shelf">
              <span className="spinner"></span>
              <p>Fetching cozy products...</p>
            </div>
          ) : currentProducts.length > 0 ? (
            <>
              {/* Product Grid: 3 Clean Columns */}
              <div className="products-grid-three">
                {currentProducts.map((product) => {
                  const effectivePrice = getEffectivePrice(product.selling_price, product.discount);
                  const hasDiscount = parseFloat(product.discount) > 0;
                  const isLowStock = (product.stock || 0) > 0 && (product.stock || 0) <= 5;
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

              {/* ── SIMPLE & CLEAN PAGINATION BAR ── */}
              {totalPages > 1 && (
                <nav className="pagination-nav-bar" aria-label="Catalog pagination">
                  <button
                    className="pagination-btn pagination-prev"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <div className="pagination-pages-list">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`pagination-page-number ${currentPage === pageNum ? "active" : ""}`}
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn pagination-next"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </nav>
              )}
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
