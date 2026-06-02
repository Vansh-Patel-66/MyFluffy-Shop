import React, { useState } from "react";
import { useCart as useCartContext } from "../../context/CartContext";
import { X, ShoppingCart, ShieldAlert, Heart, Truck, Sparkles } from "lucide-react";

const ProductDetailsModal = ({ product, onClose }) => {
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

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

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div className="product-details-modal glass-panel" style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={modalStyles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <div style={modalStyles.grid}>
          {/* Product Image Cover */}
          <div style={modalStyles.imageArea}>
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop"}
              alt={product.name}
              style={modalStyles.image}
            />
            {parseFloat(product.discount) > 0 && (
              <span className="discount-tag" style={modalStyles.discountTag}>
                -{parseFloat(product.discount)}% OFF
              </span>
            )}
          </div>

          {/* Details Column */}
          <div style={modalStyles.detailsArea}>
            <div style={modalStyles.header}>
              <span style={modalStyles.categoryLabel}>☁️ Therapeutic Pillow</span>
              <h2>{product.name}</h2>
            </div>

            {/* Price section */}
            <div style={modalStyles.priceBlock}>
              <span style={modalStyles.sellingPrice}>₹{parseFloat(product.selling_price).toFixed(2)}</span>
              {parseFloat(product.discount) > 0 && (
                <span style={modalStyles.oldPrice}>₹{parseFloat(product.cost_price).toFixed(2)}</span>
              )}
            </div>

            <hr style={modalStyles.divider} />

            {/* Description */}
            <div style={modalStyles.descriptionBlock}>
              <h4>Description</h4>
              <p>{product.description || "Our premium pillows are custom crafted with hypoallergenic, super fluffy fillings designed to keep your body aligned, delivering the deepest sleeps and coziest cuddles."}</p>
            </div>

            {/* Stock details */}
            <div style={modalStyles.metaBlock}>
              {product.stock > 0 ? (
                <span className="badge badge-success">● {product.stock} items left in stock</span>
              ) : (
                <span className="badge badge-danger">● Temporarily Out of Stock</span>
              )}
            </div>

            {/* Interactive Quantity Selector & Cart adding */}
            {product.stock > 0 ? (
              <div style={modalStyles.actionBlock}>
                <div style={modalStyles.qtyPicker}>
                  <button style={modalStyles.qtyBtn} onClick={() => handleQtyChange(-1)} disabled={quantity <= 1}>
                    -
                  </button>
                  <span style={modalStyles.qtyNum}>{quantity}</span>
                  <button style={modalStyles.qtyBtn} onClick={() => handleQtyChange(1)} disabled={quantity >= product.stock}>
                    +
                  </button>
                </div>

                <button className="btn-primary" style={modalStyles.cartBtn} onClick={handleAddToCart}>
                  <ShoppingCart size={18} /> Add to Cart — ₹{(parseFloat(product.selling_price) * quantity).toFixed(2)}
                </button>
              </div>
            ) : (
              <div style={modalStyles.outOfStockAlert}>
                <ShieldAlert size={20} />
                <span>Notify me when restocked</span>
              </div>
            )}

            <hr style={modalStyles.divider} />

            {/* Benefit Bullets */}
            <div style={modalStyles.bulletsBlock}>
              <div style={modalStyles.bulletItem}>
                <Truck size={16} color="var(--primary)" />
                <span>Free shipping and 30 days hassle-free returns</span>
              </div>
              <div style={modalStyles.bulletItem}>
                <Sparkles size={16} color="var(--secondary)" />
                <span>100% organic cotton breathable shell cover</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "860px",
    background: "rgba(255, 255, 255, 0.95) !important",
    borderRadius: "24px",
    position: "relative",
    padding: "32px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    overflowY: "auto",
    maxHeight: "90vh",
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid var(--border-glass)",
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "32px",
    marginTop: "16px",
  },
  imageArea: {
    position: "relative",
    height: "380px",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#f8f9fa",
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
    background: "var(--secondary)",
    color: "white",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: "800",
    fontSize: "0.8rem",
  },
  detailsArea: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  categoryLabel: {
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    color: "var(--primary)",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  priceBlock: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sellingPrice: {
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    fontSize: "1.8rem",
    color: "var(--text-main)",
  },
  oldPrice: {
    fontSize: "1.1rem",
    color: "var(--text-muted)",
    textDecoration: "line-through",
  },
  divider: {
    border: 0,
    borderTop: "1.5px solid var(--border-glass)",
  },
  descriptionBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  metaBlock: {
    display: "flex",
    gap: "8px",
  },
  actionBlock: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "8px",
  },
  qtyPicker: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid var(--border-glass)",
    borderRadius: "99px",
    overflow: "hidden",
    background: "white",
  },
  qtyBtn: {
    background: "transparent",
    border: "none",
    width: "40px",
    height: "40px",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  qtyNum: {
    width: "36px",
    textAlign: "center",
    fontWeight: "700",
    fontFamily: "var(--font-display)",
  },
  cartBtn: {
    flex: 1,
    justifyContent: "center",
  },
  outOfStockAlert: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    background: "hsl(350, 80%, 95%)",
    color: "var(--danger)",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  bulletsBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  bulletItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem",
    color: "var(--text-muted)",
  },
};

export default ProductDetailsModal;
