import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Trash2, Plus, Minus, Tag, ShoppingBag } from "lucide-react";
import "../../style/cart.css";

const Cart = ({ setActivePage }) => {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal } = useCart();
  const { user, showToast } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const rawSubtotal = getSubtotal();
  const subtotal = rawSubtotal / 20;
  // Match screenshot values: shipping is $6.99, free over $49
  const shipping = subtotal >= 49 || subtotal === 0 ? 0.00 : 6.99;
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal + shipping - discountAmount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "FLUFFY10") {
      setAppliedDiscount(0.10); // 10% off
      showToast("Promo code FLUFFY10 applied successfully (10% OFF)!", "success");
    } else if (promoCode.trim() !== "") {
      showToast("Invalid promo code. Try 'FLUFFY10'", "warning");
    }
  };

  const handleCheckout = () => {
    if (!user) {
      showToast("Please log in to proceed to checkout", "info");
      setActivePage("login");
    } else {
      setActivePage("checkout");
    }
  };

  return (
    <div className="cart-page-wrapper animate-fade-in">
      <div className="cart-page-container">
        <h1 className="cart-page-title">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="cart-layout-grid">
            {/* Cart Items List */}
            <div className="cart-items-shelf">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card glass-panel">
                  <div className="cart-item-image-wrapper">
                    <img
                      src={item.product?.image_url || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=300&auto=format&fit=crop"}
                      alt={item.product?.name || "Fluffy item"}
                      className="cart-item-image"
                    />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <div>
                        <h3 className="cart-item-name">{item.product?.name || "Cloud Bear Plush"}</h3>
                        <span className="cart-item-variant">Small · Cream</span>
                      </div>
                      <button className="cart-item-delete-btn" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="cart-item-footer">
                      <div className="cart-item-qty-selector">
                        <button
                          className="qty-picker-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-picker-value">{item.quantity}</span>
                        <button
                          className="qty-picker-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= (item.product?.stock || 0)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="cart-item-price-block">
                        <span className="cart-item-price">
                          ${((parseFloat(item.price) / 20) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="cart-summary-sidebar glass-panel">
              <h2 className="summary-title">Order Summary</h2>

              {/* Promo Code section */}
              <div className="promo-section">
                <label className="promo-label">
                  <Tag size={16} /> Promo Code
                </label>
                <div className="promo-input-group">
                  <input
                    type="text"
                    placeholder="Try FLUFFY10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="promo-input"
                  />
                  <button className="promo-apply-btn" onClick={handleApplyPromo}>
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Details */}
              <div className="summary-totals-block">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Discount (10%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <button className="btn-primary checkout-action-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <button
                className="continue-shopping-link-btn"
                onClick={() => setActivePage("shop")}
              >
                or continue shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-cart-page-view glass-panel">
            <ShoppingBag size={64} className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some cloud-soft pillows or plushies to make it happy!</p>
            <button className="btn-primary" onClick={() => setActivePage("shop")}>
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
