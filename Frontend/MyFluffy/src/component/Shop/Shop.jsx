import React, { useState, useEffect } from "react";
import { productAPI, categoryAPI } from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { Star } from "lucide-react";
import "../../style/shop.css";

const Shop = ({ setSelectedProduct, selectedCategory: externalCategory, setSelectedCategory: setExternalCategory }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState("popularity");

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

  // Sync external category filter from Navbar if set
  useEffect(() => {
    if (externalCategory) {
      // Find matching category object
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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (setExternalCategory) {
      setExternalCategory(catId);
    }
  };

  // Filter and Sort Logic
  const filteredProducts = products
    .filter((product) => {
      // 1. Active status check
      if (!product.is_active) return false;

      // 2. Category check
      let matchesCategory = false;
      if (selectedCategory === "all") {
        matchesCategory = true;
      } else {
        matchesCategory = product.category_id === selectedCategory;
      }

      // 3. Price check
      const originalUsdPrice = parseFloat(product.selling_price) / 20;
      const usdPrice = originalUsdPrice * (1 - (parseFloat(product.discount) || 0) / 100);
      const matchesPrice = usdPrice <= maxPrice;

      return matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      const priceA = (parseFloat(a.selling_price) / 20) * (1 - (parseFloat(a.discount) || 0) / 100);
      const priceB = (parseFloat(b.selling_price) / 20) * (1 - (parseFloat(b.discount) || 0) / 100);

      if (sortBy === "price-low") {
        return priceA - priceB;
      }
      if (sortBy === "price-high") {
        return priceB - priceA;
      }
      if (sortBy === "alpha") {
        return a.name.localeCompare(b.name);
      }
      // Popularity / Default
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  return (
    <div className="shop-page animate-fade-in">
      <div className="shop-header">
        <span className="shop-pre-title">SHOP</span>
        <h1 className="shop-title">The Full Collection</h1>
        <p className="shop-product-count">{filteredProducts.length} products</p>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar">
          {/* Categories Selector */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Category</h4>
            <div className="category-links-list">
              <button
                className={`category-link-btn ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => handleCategorySelect("all")}
              >
                All Products
              </button>
              {categories.map((cat) => {
                // Map display names to match mockup
                let displayName = cat.name;
                if (cat.name === "Lovable Plushies") displayName = "Soft Toys";
                if (cat.name === "Velvety Blankets") displayName = "Blankets";
                if (cat.name === "Cozy Pillows") displayName = "Pillows";

                return (
                  <button
                    key={cat.id}
                    className={`category-link-btn ${selectedCategory === cat.id ? "active" : ""}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="sidebar-divider" />

          {/* Price Range Slider */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Price</h4>
            <div className="price-slider-group">
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="custom-range-slider"
              />
              <div className="price-display-tags">
                <span>$0</span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </div>

          <hr className="sidebar-divider" />

          {/* Sort Dropdown */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Sort By</h4>
            <div className="sort-select-wrapper">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown-element">
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Product Shelf */}
        <main className="shop-main">
          {loading ? (
            <div className="loader-container">
              <span className="spinner"></span>
              <p>Fetching cozy products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const originalUsdPrice = parseFloat(product.selling_price) / 20;
                const usdPrice = originalUsdPrice * (1 - (parseFloat(product.discount) || 0) / 100);
                const oldUsdPrice = parseFloat(product.cost_price) / 20;
                const totalDiscountPercent = oldUsdPrice > usdPrice ? Math.round(((oldUsdPrice - usdPrice) / oldUsdPrice) * 100) : 0;

                return (
                  <div key={product.id} className="bestseller-product-card" onClick={() => handleProductClick(product)}>
                    <div className="product-card-image-box">
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop"}
                        alt={product.name}
                        className="product-card-img"
                      />
                      <span className={`product-card-badge ${totalDiscountPercent > 0 ? "new" : "bestseller"}`}>
                        {totalDiscountPercent > 0 ? `${totalDiscountPercent}% OFF` : "Bestseller"}
                      </span>
                    </div>

                    <div className="product-card-meta">
                      <div className="product-card-rating">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span>4.9 (402)</span>
                      </div>
                      <h3 className="product-card-title">{product.name}</h3>
                      <div className="product-card-prices">
                        <span className="current-price">${usdPrice.toFixed(2)}</span>
                        {oldUsdPrice > usdPrice && (
                          <span className="crossed-price">${oldUsdPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-products-prompt glass-panel">
              <h3>No matching clouds found</h3>
              <p>Try adjusting your price filter or select a different category.</p>
              <button 
                className="btn-secondary" 
                onClick={() => { setSelectedCategory("all"); setMaxPrice(200); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
