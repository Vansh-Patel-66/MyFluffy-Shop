import React, { useState } from "react";
import { useCart as useCartContext } from "../../context/CartContext";
import { formatPrice, getEffectivePrice } from "../../utils/currency";
import { getImageUrl } from "../../utils/api";
import { X, ShoppingBag, Star, ShieldCheck, Heart, Truck, Sparkles, ChevronDown, ChevronUp, Check } from "lucide-react";

const ProductDetailsModal = ({ product, onClose }) => {
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [selectedColor, setSelectedColor] = useState("Natural Oat");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Accordion states
  const [accordionOpen, setAccordionOpen] = useState({
    description: true,
    material: false,
    shipping: false,
  });

  if (!product) return null;

  const effectivePrice = getEffectivePrice(product.selling_price, product.discount);
  const originalPrice = parseFloat(product.cost_price || product.selling_price);
  const hasDiscount = parseFloat(product.discount) > 0;
  const savings = hasDiscount ? originalPrice - effectivePrice : 0;
  const isAvailable = (product.stock || 0) > 0;

  const handleQtyChange = (val) => {
    const nextQty = quantity + val;
    if (nextQty >= 1 && nextQty <= (product.stock || 10)) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const toggleAccordion = (section) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Build images array
  const images = [];
  if (product.image_url) images.push(getImageUrl(product.image_url));
  if (product.product_images && product.product_images.length > 0) {
    product.product_images.forEach((img) => {
      images.push(getImageUrl(img.image_url));
    });
  }
  if (images.length === 0) {
    images.push("https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop");
  }

  const categoryName = product.category?.name || "Curated Comfort";

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        className="product-details-modal-container"
        style={styles.card}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        {/* Breadcrumb Line */}
        <div style={styles.breadcrumbs}>
          <span>Collection</span>
          <span style={styles.breadSep}>/</span>
          <span>{categoryName}</span>
          <span style={styles.breadSep}>/</span>
          <span style={{ color: "var(--text-main)", fontWeight: "600" }}>{product.name}</span>
        </div>

        <div style={styles.grid}>
          {/* Left Column: Image Gallery */}
          <div style={styles.imageColumn}>
            <div style={styles.mainImageContainer}>
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                style={styles.mainImage}
              />
              {hasDiscount && (
                <span style={styles.discountBadge}>
                  Save {Math.round(parseFloat(product.discount))}%
                </span>
              )}
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div style={styles.thumbnailRow}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      ...styles.thumbnailBtn,
                      borderColor: activeImageIndex === idx ? "var(--primary)" : "transparent",
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={styles.thumbnailImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchasing */}
          <div style={styles.detailsColumn}>
            <span style={styles.categorySub}>{categoryName}</span>
            <h2 style={styles.productTitle}>{product.name}</h2>

            {/* Ratings row */}
            <div style={styles.ratingsRow}>
              <div style={styles.starCluster}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span style={styles.ratingText}>4.96 &bull; 412 Verified Reviews</span>
            </div>

            {/* Pricing Section */}
            <div style={styles.priceRow}>
              <span style={styles.priceEffective}>{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <span style={styles.priceOriginal}>{formatPrice(product.selling_price)}</span>
              )}
              {savings > 0 && (
                <span style={styles.savingsPill}>Save {formatPrice(savings)}</span>
              )}
            </div>

            {/* Description */}
            <p style={styles.descriptionText}>
              {product.description ||
                "Engineered with our proprietary ultra-dense microfiber plush, designed to deliver immediate soothing relaxation and cloud-soft warmth."}
            </p>

            <hr style={styles.divider} />

            {/* Color Palette Selector */}
            <div style={styles.optionSection}>
              <span style={styles.optionLabel}>
                Tone: <strong>{selectedColor}</strong>
              </span>
              <div style={styles.pillRow}>
                {["Natural Oat", "Warm Biscuit", "Cloud White"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    style={{
                      ...styles.pillBtn,
                      background: selectedColor === c ? "var(--primary-light)" : "transparent",
                      borderColor: selectedColor === c ? "var(--primary)" : "var(--border-subtle)",
                      color: selectedColor === c ? "var(--primary)" : "var(--text-main)",
                      fontWeight: selectedColor === c ? "600" : "500",
                    }}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div style={styles.optionSection}>
              <span style={styles.optionLabel}>
                Size: <strong>{selectedSize}</strong>
              </span>
              <div style={styles.pillRow}>
                {["Standard", "Cozy Grande", "Heirloom Plush"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    style={{
                      ...styles.pillBtn,
                      background: selectedSize === s ? "var(--primary-light)" : "transparent",
                      borderColor: selectedSize === s ? "var(--primary)" : "var(--border-subtle)",
                      color: selectedSize === s ? "var(--primary)" : "var(--text-main)",
                      fontWeight: selectedSize === s ? "600" : "500",
                    }}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div style={styles.purchaseActionRow}>
              <div style={styles.qtyStepper}>
                <button
                  type="button"
                  style={styles.qtyBtn}
                  onClick={() => handleQtyChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span style={styles.qtyNum}>{quantity}</span>
                <button
                  type="button"
                  style={styles.qtyBtn}
                  onClick={() => handleQtyChange(1)}
                  disabled={quantity >= (product.stock || 10)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn-primary"
                style={styles.addToBagBtn}
                disabled={!isAvailable}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>
                  {isAvailable
                    ? `Add to Bag &bull; ${formatPrice(effectivePrice * quantity)}`
                    : "Temporarily Sold Out"}
                </span>
              </button>
            </div>

            {/* Stock and Shipping Reassurance */}
            <div style={styles.reassuranceStrip}>
              <span style={styles.reassurancePill}>
                <Check size={14} color="#16a34a" /> In stock &bull; Ships within 24h
              </span>
              <span style={styles.reassurancePill}>
                <Truck size={14} color="var(--primary)" /> Complimentary shipping $49+
              </span>
            </div>

            <hr style={styles.divider} />

            {/* Collapsible Accordions */}
            <div style={styles.accordionsBox}>
              {/* Materials & Care */}
              <div style={styles.accordionItem}>
                <button
                  type="button"
                  style={styles.accordionHeader}
                  onClick={() => toggleAccordion("material")}
                >
                  <span style={styles.accordionTitle}>Materials & Care Guide</span>
                  {accordionOpen.material ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {accordionOpen.material && (
                  <p style={styles.accordionContent}>
                    Outer: 100% Ultra-Dense CloudFluff™ micro-denier poly-velour. Stuffing: Hypoallergenic recycled poly-down clusters. Machine washable gentle cold cycle. Tumble dry on lowest delicate fluff heat.
                  </p>
                )}
              </div>

              {/* Shipping & 100-Night Guarantee */}
              <div style={styles.accordionItem}>
                <button
                  type="button"
                  style={styles.accordionHeader}
                  onClick={() => toggleAccordion("shipping")}
                >
                  <span style={styles.accordionTitle}>100-Night Softness Guarantee</span>
                  {accordionOpen.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {accordionOpen.shipping && (
                  <p style={styles.accordionContent}>
                    Take 100 nights to cuddle, sleep with, and enjoy your piece. If you aren't completely in love with its cloud-soft comfort, return it for a complete, hassle-free refund.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(36, 34, 32, 0.65)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
    overflowY: "auto",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "960px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "36px",
    position: "relative",
    boxShadow: "0 24px 64px -16px rgba(36, 34, 32, 0.28)",
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid var(--border-subtle)",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "var(--text-muted)",
    transition: "all 0.2s ease",
  },
  breadcrumbs: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    marginBottom: "24px",
  },
  breadSep: {
    opacity: 0.5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.15fr",
    gap: "36px",
  },
  imageColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  mainImageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "1",
    borderRadius: "18px",
    overflow: "hidden",
    backgroundColor: "#fbf5ee",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: "14px",
    left: "14px",
    backgroundColor: "var(--primary)",
    color: "#ffffff",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "0.74rem",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  thumbnailRow: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
  },
  thumbnailBtn: {
    width: "60px",
    height: "60px",
    borderRadius: "10px",
    overflow: "hidden",
    border: "2px solid transparent",
    padding: 0,
    backgroundColor: "#fbf5ee",
    cursor: "pointer",
    flexShrink: 0,
  },
  thumbnailImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  detailsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  categorySub: {
    fontSize: "0.76rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "var(--primary)",
  },
  productTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "1.9rem",
    fontWeight: "700",
    color: "var(--text-main)",
    lineHeight: "1.2",
  },
  ratingsRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  starCluster: {
    display: "flex",
    gap: "2px",
  },
  ratingText: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
  },
  priceEffective: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--text-main)",
  },
  priceOriginal: {
    fontSize: "1.05rem",
    color: "var(--text-muted)",
    textDecoration: "line-through",
  },
  savingsPill: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "var(--primary)",
    backgroundColor: "var(--primary-light)",
    padding: "3px 8px",
    borderRadius: "999px",
  },
  descriptionText: {
    fontSize: "0.92rem",
    lineHeight: "1.6",
    color: "var(--text-muted)",
  },
  divider: {
    border: 0,
    borderTop: "1px solid var(--border-subtle)",
    margin: "4px 0",
  },
  optionSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  optionLabel: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
  },
  pillRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  pillBtn: {
    padding: "7px 14px",
    borderRadius: "999px",
    border: "1px solid var(--border-subtle)",
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  purchaseActionRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "6px",
  },
  qtyStepper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    padding: "4px 8px",
    backgroundColor: "#ffffff",
  },
  qtyBtn: {
    width: "30px",
    height: "30px",
    border: "none",
    background: "transparent",
    fontSize: "1.1rem",
    cursor: "pointer",
    color: "var(--text-main)",
  },
  qtyNum: {
    width: "28px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  addToBagBtn: {
    flex: 1,
    padding: "13px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "0.92rem",
  },
  reassuranceStrip: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "4px",
  },
  reassurancePill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.78rem",
    color: "var(--text-muted)",
  },
  accordionsBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  accordionItem: {
    borderBottom: "1px solid var(--border-subtle)",
    paddingBottom: "8px",
  },
  accordionHeader: {
    width: "100%",
    background: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    cursor: "pointer",
  },
  accordionTitle: {
    fontSize: "0.86rem",
    fontWeight: "600",
    color: "var(--text-main)",
  },
  accordionContent: {
    fontSize: "0.82rem",
    lineHeight: "1.55",
    color: "var(--text-muted)",
    padding: "4px 0 8px",
  },
};

export default ProductDetailsModal;
