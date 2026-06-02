import React, { useState, useEffect } from "react";
import { productAPI, categoryAPI } from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { Search, Filter, Eye, Heart, ShoppingCart, SlidersHorizontal, Grid, List } from "lucide-react";
import "../../style/shop.css";

const Shop = ({ setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortBy, setSortBy] = useState("featured");
  const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Filter and Sort Logic
  const filteredProducts = products
    .filter((product) => {
      // 1. Active status check
      if (!product.is_active) return false;

      // 2. Search query check
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query));

      // 3. Category check
      const matchesCategory =
        selectedCategory === "all" || product.category_id === selectedCategory;

      // 4. Price check
      const matchesPrice = parseFloat(product.selling_price) <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return parseFloat(a.selling_price) - parseFloat(b.selling_price);
      }
      if (sortBy === "price-high") {
        return parseFloat(b.selling_price) - parseFloat(a.selling_price);
      }
      if (sortBy === "alpha") {
        return a.name.localeCompare(b.name);
      }
      // Featured / Default
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  return (
    <div className="shop-page animate-fade-in">
      <div className="shop-header">
        <h1>Cloud Catalog</h1>
        <p>Explore our premium collection of therapeutic plushies and bedding pads</p>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar glass-panel">
          <div className="sidebar-section">
            <h3><Filter size={18} /> Filters</h3>
          </div>

          <hr className="sidebar-divider" />

          {/* Categories Selector */}
          <div className="sidebar-section">
            <h4>Categories</h4>
            <div className="filter-options-list">
              <button
                className={`filter-btn-link ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                All Softness
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-btn-link ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <hr className="sidebar-divider" />

          {/* Price Range Slider */}
          <div className="sidebar-section">
            <h4>Max Price (₹)</h4>
            <div className="price-slider-group">
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="custom-range-slider"
              />
              <div className="price-display-tags">
                <span>₹0</span>
                <strong>₹{maxPrice}</strong>
                <span>₹5000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Product Shelf */}
        <main className="shop-main">
          {/* Top Bar Controls */}
          <div className="shop-toolbar glass-panel">
            {/* Search */}
            <div className="search-bar-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search soft clouds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sorting and Views */}
            <div className="toolbar-controls">
              <div className="sort-wrapper">
                <SlidersHorizontal size={16} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Latest Arrival</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                </select>
              </div>

              <div className="view-toggles">
                <button
                  className={`view-toggle-btn ${!isListView ? "active" : ""}`}
                  onClick={() => setIsListView(false)}
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`view-toggle-btn ${isListView ? "active" : ""}`}
                  onClick={() => setIsListView(true)}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List rendering */}
          {loading ? (
            <div className="loader-container">
              <span className="spinner"></span>
              <p>Fetching cozy products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={isListView ? "products-list-layout" : "products-grid"}>
              {filteredProducts.map((product) => (
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
                    <p className="product-desc-brief">{product.description?.substring(0, 120)}...</p>

                    <div className="stock-level-wrapper">
                      {product.stock > 0 ? (
                        <span className="stock-indicator in-stock">● {product.stock} items left</span>
                      ) : (
                        <span className="stock-indicator out-stock">● Out of stock</span>
                      )}
                    </div>

                    <div className="product-price-row">
                      <div className="pricing">
                        <span className="selling-price">₹{parseFloat(product.selling_price).toFixed(2)}</span>
                        {parseFloat(product.discount) > 0 && (
                          <span className="old-price">₹{parseFloat(product.cost_price).toFixed(2)}</span>
                        )}
                      </div>
                      <button 
                        className="add-cart-mini-btn" 
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingCart size={16} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products-prompt glass-panel">
              <h3>No matching clouds found</h3>
              <p>Try clearing some search keywords or adjust your filters slider.</p>
              <button 
                className="btn-secondary" 
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setMaxPrice(2500); }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
