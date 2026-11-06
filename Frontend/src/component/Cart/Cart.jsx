import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/currency";
import { getImageUrl } from "../../utils/api";
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";
import "../../style/cart.css";

const FREE_SHIPPING_THRESHOLD = 49.0;
const STANDARD_SHIPPING_RATE = 6.99;

const Cart = ({ setActivePage }) => {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal } = useCart();
  const { user, showToast } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: string, rate: number }

  const subtotal = getSubtotal();
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = qualifiesForFreeShipping ? 0.0 : STANDARD_SHIPPING_RATE;
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const discountRate = appliedPromo ? appliedPromo.rate : 0;
  const discountAmount = subtotal * discountRate;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === "FLUFFY10") {
      setAppliedPromo({ code: "FLUFFY10", rate: 0.1 });
      showToast("Promo FLUFFY10 applied (10% OFF)!", "success");
    } else if (cleanCode === "COZY20") {
      setAppliedPromo({ code: "COZY20", rate: 0.2 });
      showToast("VIP Promo COZY20 applied (20% OFF)!", "success");
    } else {
      showToast("Invalid promo code. Try 'FLUFFY10' or 'COZY20'", "warning");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    showToast("Promo code removed", "info");
  };

  const handleCheckout = () => {
    if (!user) {
      showToast("Please sign in or create an account to proceed", "info");
      setActivePage("login");
    } else {
      setActivePage("checkout");
    }
  };

  return (
    <div className="cart-page-wrapper animate-fade-in">
      <div className="cart-page-container">
        {/* Page Header */}
        <div className="cart-header-row">
          <div>
            <span className="cart-eyebrow">YOUR BAG</span>
            <h1 className="cart-page-title">Shopping Bag</h1>
          </div>
          <button className="cart-continue-btn" onClick={() => setActivePage("shop")}>
            Continue Shopping <ArrowRight size={15} />
          </button>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-layout-grid">
            {/* Left Column: Items & Shipping Meter */}
            <div className="cart-items-column">
              {/* Free Shipping Progress Meter */}
              <div className="shipping-progress-card">
                <div className="shipping-progress-header">
                  <div className="shipping-icon-circle">
                    <Truck size={17} color="var(--primary)" />
                  </div>
                  <p className="shipping-progress-text">
                    {qualifiesForFreeShipping ? (
                      <strong>🎉 You've unlocked Complimentary US Shipping!</strong>
                    ) : (
                      <>
                        Add <strong>{formatPrice(remainingForFreeShipping)}</strong> more to unlock <strong>FREE Shipping</strong>
                      </>
                    )}
                  </p>
                </div>
                <div className="shipping-progress-track">
                  <div
                    className="shipping-progress-fill"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="cart-items-shelf">
                {cartItems.map((item) => {
                  const prod = item.product || {};
                  const itemUnitPrice = parseFloat(item.price);
                  const itemTotalPrice = itemUnitPrice * item.quantity;
                  const itemImg = getImageUrl(prod.image_url) || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=300&auto=format&fit=crop";

                  return (
                    <article key={item.id} className="cart-item-card">
                      <div className="cart-item-image-wrapper">
                        <img
                          src={itemImg}
                          alt={prod.name || "Cozy Item"}
                          className="cart-item-image"
                        />
                      </div>

                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <div>
                            <span className="cart-item-cat-label">
                              {prod.category?.name || "Curated Cozy"}
                            </span>
                            <h3 className="cart-item-name">{prod.name || "Handmade Plushie"}</h3>
                          </div>
                          <button
                            className="cart-item-delete-btn"
                            title="Remove item"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="cart-item-footer">
                          {/* Stepper */}
                          <div className="cart-item-qty-selector">
                            <button
                              className="qty-picker-btn"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="qty-picker-value">{item.quantity}</span>
                            <button
                              className="qty-picker-btn"
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.quantity >= (prod.stock || 10)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="cart-item-price-block">
                            <span className="cart-item-price">
                              {formatPrice(itemTotalPrice)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="cart-item-unit-note">
                                {formatPrice(itemUnitPrice)} each
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <aside className="cart-summary-sidebar">
              <h2 className="summary-title">Order Summary</h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="promo-section">
                <label className="promo-label" htmlFor="promoInput">
                  <Tag size={15} /> Promo or Gift Code
                </label>
                <div className="promo-input-group">
                  <input
                    id="promoInput"
                    type="text"
                    placeholder="e.g. FLUFFY10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="promo-input"
                  />
                  <button type="submit" className="promo-apply-btn">
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="applied-promo-tag">
                    <span>Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.rate * 100}% off)</span>
                    <button type="button" onClick={handleRemovePromo} className="remove-promo-btn">
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Cost Breakdown */}
              <div className="summary-totals-block">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-val">{formatPrice(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="summary-row discount-row">
                    <span>Discount ({appliedPromo.rate * 100}%)</span>
                    <span className="summary-val-discount">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Estimated Shipping</span>
                  <span className="summary-val">
                    {shipping === 0 ? <strong style={{ color: "#16a34a" }}>FREE</strong> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Taxes (Calculated at checkout)</span>
                  <span className="summary-val">$0.00</span>
                </div>

                <hr className="summary-divider" />

                <div className="summary-row total-row">
                  <span>Estimated Total</span>
                  <span className="total-val">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button className="btn-primary checkout-cta-btn" onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight size={17} />
              </button>

              {/* Reassurance Badges */}
              <div className="checkout-trust-box">
                <div className="trust-item">
                  <ShieldCheck size={16} color="var(--primary)" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="trust-item">
                  <Sparkles size={16} color="var(--primary)" />
                  <span>100-Night Softness Guarantee</span>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="empty-cart-state">
            <div className="empty-cart-emblem">🧸</div>
            <h2 className="empty-cart-title">Your shopping bag is empty</h2>
            <p className="empty-cart-desc">
              Looks like you haven't added any cloud-soft items yet. Explore our handcrafted collection to find your next comfort companion.
            </p>
            <button className="btn-primary" onClick={() => setActivePage("shop")}>
              Explore Cozy Catalog <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
