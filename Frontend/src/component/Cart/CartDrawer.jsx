import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard, ShoppingBag } from "lucide-react";
import "../../style/cart.css";

const CartDrawer = ({ isOpen, onClose, setActivePage }) => {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal } = useCart();
  const { user } = useAuth();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const tax = subtotal * 0.05; // 5% GST
  const grandTotal = subtotal + tax;

  const handleCheckoutClick = () => {
    onClose();
    if (user) {
      setActivePage("checkout");
    } else {
      setActivePage("login");
    }
  };

  return (
    <div className="cart-overlay animate-fade-in" onClick={onClose}>
      <div className="cart-drawer glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingCart size={22} />
            <h2>Your Shopping Cart</h2>
          </div>
          <button className="close-drawer-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <hr className="cart-divider" />

        {/* Scrollable Cart Items */}
        <div className="cart-items-container">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row glass-panel">
                <div className="item-img-container">
                  <img
                    src={item.product?.image_url || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=300&auto=format&fit=crop"}
                    alt={item.product?.name || "Fluffy item"}
                    className="item-img"
                  />
                </div>

                <div className="item-meta">
                  <h4>{item.product?.name || "Cloud Pillow"}</h4>
                  <span className="item-price">₹{parseFloat(item.price).toFixed(2)}</span>
                  
                  {/* Quantity selector */}
                  <div className="qty-controls">
                    <button className="qty-action-btn" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-action-btn" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Remove trigger */}
                <button className="trash-btn" title="Remove item" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-cart-view">
              <ShoppingBag size={48} className="empty-icon" />
              <h3>Your cart is empty</h3>
              <p>Add some ultra-soft pillows or plushies to make it happy!</p>
              <button className="btn-primary" onClick={() => { onClose(); setActivePage("shop"); }}>
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer-sheet">
            <div className="cart-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Estimated GST (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Charges</span>
                <span className="shipping-free">FREE</span>
              </div>
              <hr className="cart-divider" />
              <div className="total-row grand-total-row">
                <span>Total Amount</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn-primary checkout-btn" onClick={handleCheckoutClick}>
              Proceed to Checkout <CreditCard size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
