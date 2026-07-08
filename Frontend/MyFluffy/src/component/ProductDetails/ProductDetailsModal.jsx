import React, { useState } from "react";
import { useCart as useCartContext } from "../../context/CartContext";
import { X, ShoppingCart, Star, ShieldCheck, Heart, Truck, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { getImageUrl } from "../../utils/api";

const ProductDetailsModal = ({ product, onClose }) => {
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [selectedColor, setSelectedColor] = useState("White");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Accordion states
  const [accordionOpen, setAccordionOpen] = useState({
    description: true,
    material: false,
    shipping: false
  });

  if (!product) return null;

  const originalUsdPrice = parseFloat(product.selling_price) / 20;
  const usdPrice = originalUsdPrice * (1 - (parseFloat(product.discount) || 0) / 100);
  const oldUsdPrice = parseFloat(product.cost_price) / 20;
  const saveAmount = oldUsdPrice > usdPrice ? oldUsdPrice - usdPrice : 0;
  const totalDiscountPercent = oldUsdPrice > usdPrice ? Math.round(((oldUsdPrice - usdPrice) / oldUsdPrice) * 100) : 0;

  const handleQtyChange = (val) => {
    const nextQty = quantity + val;
    if (nextQty >= 1 && nextQty <= product.stock) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Build images array: main image first, then any additional images
  const images = [];
  if (product.image_url) images.push(getImageUrl(product.image_url));
  if (product.product_images && product.product_images.length > 0) {
    product.product_images.forEach(img => {
      images.push(getImageUrl(img.image_url));
    });
  }
  if (images.length === 0) {
    images.push("https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=600&auto=format&fit=crop");
  }

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div className="product-details-modal-container glass-panel" style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={modalStyles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        {/* Breadcrumbs */}
        <div style={modalStyles.breadcrumbs}>
          <span>Home</span> / <span>Pillows</span> / <span style={{ color: "#0f172a", fontWeight: "600" }}>{product.name}</span>
        </div>

        <div style={modalStyles.grid}>
          {/* Left Column: Product Image Gallery */}
          <div style={modalStyles.imageArea}>
            <div style={modalStyles.mainImageContainer}>
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                style={modalStyles.image}
              />
              <span className={`product-card-badge ${totalDiscountPercent > 0 ? "new" : "bestseller"}`} style={modalStyles.discountTag}>
                {totalDiscountPercent > 0 ? `${totalDiscountPercent}% OFF` : "Bestseller"}
              </span>
            </div>
            
            {/* Thumbnails list */}
            <div style={modalStyles.thumbnailRow}>
              {images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  style={{
                    ...modalStyles.thumbnailBox,
                    borderColor: activeImageIndex === index ? "#3b82f6" : "transparent"
                  }}
                >
                  <img src={img} alt="Thumbnail view" style={modalStyles.thumbnailImg} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div style={modalStyles.detailsArea}>
            <span style={modalStyles.categoryLabel}>Pillows</span>
            <h2 style={modalStyles.title}>{product.name}</h2>

            {/* Ratings line */}
            <div style={modalStyles.ratingLine}>
              <div style={{ display: "flex", gap: "2px" }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
              </div>
              <span style={modalStyles.ratingText}>4.9 · 402 reviews</span>
            </div>

            {/* Pricing block */}
            <div style={modalStyles.priceBlock}>
              <span style={modalStyles.sellingPrice}>${usdPrice.toFixed(2)}</span>
              {oldUsdPrice > usdPrice && (
                <span style={modalStyles.oldPrice}>${oldUsdPrice.toFixed(2)}</span>
              )}
              {saveAmount > 0 && (
                <span style={modalStyles.saveBadge}>SAVE ${saveAmount.toFixed(2)}</span>
              )}
            </div>

            <p style={modalStyles.subDescription}>
              Sleep on a cloud — literally. {product.name} is our best-selling pillow, engineered for perfect neck support.
            </p>

            <hr style={modalStyles.divider} />

            {/* Size Options */}
            <div style={modalStyles.optionSection}>
              <div style={modalStyles.optionHeader}>
                <span>Size</span>
                <span style={{ color: "#64748b" }}>{selectedSize}</span>
              </div>
              <div style={modalStyles.tabRow}>
                {["Standard", "Queen", "King"].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      ...modalStyles.tabBtn,
                      background: selectedSize === size ? "#0f172a" : "white",
                      color: selectedSize === size ? "white" : "#0f172a",
                      borderColor: selectedSize === size ? "#0f172a" : "#cbd5e1"
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Options */}
            <div style={modalStyles.optionSection}>
              <div style={modalStyles.optionHeader}>
                <span>Color</span>
                <span style={{ color: "#64748b" }}>{selectedColor}</span>
              </div>
              <div style={modalStyles.tabRow}>
                {["White"].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      ...modalStyles.tabBtn,
                      background: "#eff6ff",
                      color: "#1e40af",
                      borderColor: "#3b82f6"
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Picker & Add buttons */}
            <div style={modalStyles.actionsRow}>
              <div style={modalStyles.qtyPicker}>
                <button
                  style={modalStyles.qtyBtn}
                  onClick={() => handleQtyChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span style={modalStyles.qtyNum}>{quantity}</span>
                <button
                  style={modalStyles.qtyBtn}
                  onClick={() => handleQtyChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button className="btn-primary" style={modalStyles.cartBtn} onClick={handleAddToCart}>
                Add to Cart
              </button>

              <button
                style={modalStyles.buyBtn}
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                  setActivePage("checkout");
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust bullet badges */}
            <div style={modalStyles.trustBadgeRow}>
              <div style={modalStyles.trustBadgeItem}>
                <Truck size={14} color="#3b82f6" />
                <span>Free shipping</span>
              </div>
              <div style={modalStyles.trustBadgeItem}>
                <Sparkles size={14} color="#3b82f6" />
                <span>Premium quality</span>
              </div>
              <div style={modalStyles.trustBadgeItem}>
                <ShieldCheck size={14} color="#3b82f6" />
                <span>30-day returns</span>
              </div>
            </div>

            <hr style={modalStyles.divider} />

            {/* Accordions */}
            <div style={modalStyles.accordionContainer}>
              {/* Description Accordion */}
              <div style={modalStyles.accordionSection}>
                <div style={modalStyles.accordionHeader} onClick={() => toggleAccordion("description")}>
                  <span>Description</span>
                  {accordionOpen.description ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {accordionOpen.description && (
                  <div style={modalStyles.accordionContent}>
                    <p>{product.description || "Our premium pillows are custom crafted with hypoallergenic, super fluffy fillings designed to keep your body aligned, delivering the deepest sleeps and coziest cuddles."}</p>
                  </div>
                )}
              </div>

              {/* Material & Care Accordion */}
              <div style={modalStyles.accordionSection}>
                <div style={modalStyles.accordionHeader} onClick={() => toggleAccordion("material")}>
                  <span>Material & Care</span>
                  {accordionOpen.material ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {accordionOpen.material && (
                  <div style={modalStyles.accordionContent}>
                    <p>Cover: 100% Organic combed cotton threads.<br />Stuffing: Hypoallergenic bounce-resilient microfibers.<br />Machine wash cold, tumble dry low.</p>
                  </div>
                )}
              </div>

              {/* Shipping Info Accordion */}
              <div style={modalStyles.accordionSection}>
                <div style={modalStyles.accordionHeader} onClick={() => toggleAccordion("shipping")}>
                  <span>Shipping Info</span>
                  {accordionOpen.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {accordionOpen.shipping && (
                  <div style={modalStyles.accordionContent}>
                    <p>Free standard shipping on orders over $49. Standard delivery takes 3-5 business days carefully boxed.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const Minus = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const Plus = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "960px",
    background: "white !important",
    borderRadius: "24px",
    position: "relative",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    overflowY: "auto",
    maxHeight: "90vh",
  },
  closeBtn: {
    position: "absolute",
    top: "24px",
    right: "24px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid #e2e8f0",
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  breadcrumbs: {
    fontSize: "0.85rem",
    color: "#64748b",
    marginBottom: "24px",
    display: "flex",
    gap: "6px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "48px",
  },
  imageArea: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mainImageContainer: {
    position: "relative",
    height: "440px",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#f8fafc",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  discountTag: {
    position: "absolute",
    top: "16px",
    left: "16px",
  },
  thumbnailRow: {
    display: "flex",
    gap: "12px",
  },
  thumbnailBox: {
    width: "72px",
    height: "72px",
    borderRadius: "8px",
    border: "2px solid transparent",
    overflow: "hidden",
    cursor: "pointer",
    background: "#f1f5f9",
  },
  thumbnailImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  detailsArea: {
    display: "flex",
    flexDirection: "column",
  },
  categoryLabel: {
    fontSize: "0.85rem",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: "0.05em",
    marginBottom: "4px",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "8px",
  },
  ratingLine: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  ratingText: {
    fontSize: "0.85rem",
    color: "#64748b",
    fontWeight: "600",
  },
  priceBlock: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  sellingPrice: {
    fontFamily: "var(--font-display)",
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#0f172a",
  },
  oldPrice: {
    fontSize: "1.2rem",
    color: "#64748b",
    textDecoration: "line-through",
  },
  saveBadge: {
    background: "#ffedd5",
    color: "#9a3412",
    padding: "4px 8px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "0.75rem",
  },
  subDescription: {
    fontSize: "0.95rem",
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  divider: {
    border: 0,
    borderTop: "1px solid #e2e8f0",
    margin: "16px 0",
  },
  optionSection: {
    marginBottom: "20px",
  },
  optionHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },
  tabRow: {
    display: "flex",
    gap: "8px",
  },
  tabBtn: {
    padding: "10px 20px",
    borderRadius: "99px",
    border: "1px solid",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.25s",
  },
  actionsRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "24px",
    marginBottom: "20px",
  },
  qtyPicker: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "99px",
    overflow: "hidden",
    background: "white",
  },
  qtyBtn: {
    background: "transparent",
    border: "none",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  qtyNum: {
    width: "28px",
    textAlign: "center",
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "0.95rem",
  },
  cartBtn: {
    flex: 1.2,
    justifyContent: "center",
    padding: "14px 24px",
    background: "var(--secondary) !important",
    color: "#0f172a !important",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "0.95rem",
    border: "none",
    borderRadius: "99px",
    boxShadow: "var(--shadow-sm)",
  },
  buyBtn: {
    flex: 1,
    padding: "14px 24px",
    background: "#0f172a",
    color: "white",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "0.95rem",
    border: "none",
    borderRadius: "99px",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "var(--shadow-sm)",
  },
  trustBadgeRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
    marginBottom: "16px",
  },
  trustBadgeItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.8rem",
    color: "#64748b",
    fontWeight: "600",
  },
  accordionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },
  accordionSection: {
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "12px",
  },
  accordionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "0.95rem",
    cursor: "pointer",
    padding: "4px 0",
  },
  accordionContent: {
    marginTop: "8px",
    fontSize: "0.85rem",
    color: "#475569",
    lineHeight: "1.5",
  }
};

export default ProductDetailsModal;
