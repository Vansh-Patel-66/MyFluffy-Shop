import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { addressAPI, orderAPI, orderItemAPI } from "../../utils/api";
import { MapPin, CreditCard, ShoppingBag, CheckCircle, ChevronRight, Plus, ShieldCheck, ChevronLeft } from "lucide-react";
import "../../style/checkout.css";

const Checkout = ({ setActivePage }) => {
  const { cartItems, getSubtotal, clearCart } = useCart();
  const { user, showToast } = useAuth();

  // Navigation steps
  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment, 3: Success

  // Address states
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Address form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Order summary metrics
  const subtotal = getSubtotal();
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddress(true);
        const res = await addressAPI.getAll();
        const list = res.data || [];
        // Filter by current user
        const userAddresses = list.filter((a) => a.user_id === user?.id);
        setSavedAddresses(userAddresses);
        if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error("Address fetch error:", err);
      } finally {
        setLoadingAddress(false);
      }
    };
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      showToast("Please fill all fields", "warning");
      return;
    }

    try {
      setLoadingAddress(true);
      const newAddress = await addressAPI.create({
        user_id: user.id,
        full_name: fullName,
        phone,
        address_line: addressLine,
        city,
        state,
        pincode,
        country: "India",
        is_default: savedAddresses.length === 0,
      });
      setSavedAddresses((prev) => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      setShowNewAddressForm(false);
      showToast("Address saved successfully!", "success");
      
      // Clear address fields
      setFullName("");
      setPhone("");
      setAddressLine("");
      setCity("");
      setState("");
      setPincode("");
    } catch (err) {
      showToast("Error saving address", "error");
    } finally {
      setLoadingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast("Please select a shipping address", "warning");
      return;
    }

    try {
      // 1. Create order record
      const order = await orderAPI.create({
        user_id: user.id,
        sub_total_amount: subtotal,
        discount_amount: 0,
        delivery_charge: 0,
        finale_amount: grandTotal,
        tax_amount: tax,
        payment_status: paymentMethod === "cod" ? "pending" : "paid",
        order_status: "pending",
      });

      // 2. Map and add each item as order items in backend
      await Promise.all(
        cartItems.map((item) =>
          orderItemAPI.create({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            gst_rate: 5.0,
            total_price: item.price * item.quantity,
          })
        )
      );

      // 3. Complete checkout
      showToast("Order placed successfully!", "success");
      await clearCart();
      setStep(3); // Go to success view
    } catch (err) {
      console.error("Order error:", err);
      showToast("Checkout failed. Please try again.", "error");
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="checkout-empty glass-panel animate-fade-in">
        <ShoppingBag size={64} color="var(--primary)" />
        <h2>Nothing to Checkout</h2>
        <p>Add cozy items to your cart before proceeding to the checkout steps.</p>
        <button className="btn-primary" onClick={() => setActivePage("shop")}>
          Go to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-in">
      {/* Steps Indicator Progress */}
      <div className="checkout-progress glass-panel">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
          <span className="step-num">1</span>
          <span className="step-label">Shipping Details</span>
        </div>
        <ChevronRight size={16} className="step-sep" />
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          <span className="step-num">2</span>
          <span className="step-label">Secure Payment</span>
        </div>
        <ChevronRight size={16} className="step-sep" />
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
          <span className="step-num">3</span>
          <span className="step-label">Confirmation</span>
        </div>
      </div>

      {step === 1 && (
        <div className="checkout-grid">
          {/* Shipping Address Selection */}
          <div className="checkout-main glass-panel">
            <h2 className="step-title"><MapPin size={22} /> Select Shipping Address</h2>

            {loadingAddress ? (
              <div className="loader-container">
                <span className="spinner"></span>
                <p>Loading your saved addresses...</p>
              </div>
            ) : (
              <div className="address-shelf">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`address-card glass-panel ${selectedAddressId === addr.id ? "selected" : ""}`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <div className="address-header">
                      <strong>{addr.full_name}</strong>
                      {addr.is_default && <span className="default-badge">DEFAULT</span>}
                    </div>
                    <p className="address-phone">📞 {addr.phone}</p>
                    <p className="address-details">
                      {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!showNewAddressForm ? (
              <button className="btn-secondary add-address-btn" onClick={() => setShowNewAddressForm(true)}>
                <Plus size={16} /> Add New Address
              </button>
            ) : (
              <form onSubmit={handleAddNewAddress} className="new-address-form glass-panel">
                <h3>Add a New Address</h3>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    placeholder="Apartment, Suite, Block, Area details"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                  />
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" placeholder="Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" placeholder="Maharashtra" value={state} onChange={(e) => setState(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input type="text" placeholder="400001" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="btn-primary" disabled={loadingAddress}>
                    Save and Select Address
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowNewAddressForm(false)}
                    disabled={savedAddresses.length === 0}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="checkout-step-footer">
              <button 
                className="btn-primary next-step-btn" 
                onClick={() => setStep(2)} 
                disabled={!selectedAddressId}
              >
                Proceed to Payment <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right summary panel */}
          <div className="checkout-summary-column glass-panel">
            <h3>Order Summary</h3>
            <div className="checkout-summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item-row">
                  <span>{item.product?.name} <strong>x{item.quantity}</strong></span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="summary-totals">
              <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="total-row"><span>GST (5%)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="total-row"><span>Delivery</span><span className="shipping-free">FREE</span></div>
              <hr />
              <div className="total-row grand-total-row"><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="checkout-grid">
          {/* Secure Payment details */}
          <div className="checkout-main glass-panel">
            <h2 className="step-title"><CreditCard size={22} /> Secure Checkout Payment</h2>

            <div className="payment-mode-group">
              <button
                className={`payment-mode-btn ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                💳 Credit / Debit Card
              </button>
              <button
                className={`payment-mode-btn ${paymentMethod === "cod" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                📦 Cash on Delivery
              </button>
            </div>

            {paymentMethod === "card" ? (
              <div className="card-simulation-block">
                {/* Credit Card visual mock */}
                <div className="visual-credit-card animate-fade-in">
                  <div className="card-logo">☁️ MyFluffy Card</div>
                  <div className="card-chip"></div>
                  <div className="card-number-visual">{cardNumber || "•••• •••• •••• ••••"}</div>
                  <div className="card-footer-visual">
                    <div>
                      <div className="visual-lbl">CARDHOLDER</div>
                      <div className="visual-val">{cardHolder.toUpperCase() || "NAME SURNAME"}</div>
                    </div>
                    <div>
                      <div className="visual-lbl">EXPIRES</div>
                      <div className="visual-val">{cardExpiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>

                {/* Card input forms */}
                <div className="card-fields-form">
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      maxLength={19}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Expiration Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        maxLength={5}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Security Code (CVV)</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardCvv}
                        maxLength={3}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="cod-alert-box glass-panel animate-fade-in">
                <ShieldCheck size={32} color="var(--success)" />
                <h3>Cash on Delivery Selected</h3>
                <p>Verify your details. An additional verification step may be required upon parcel delivery.</p>
              </div>
            )}

            <div className="checkout-step-footer">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                <ChevronLeft size={16} /> Back to Address
              </button>
              <button className="btn-primary" onClick={handlePlaceOrder}>
                Complete Purchase — ₹{grandTotal.toFixed(2)}
              </button>
            </div>
          </div>

          <div className="checkout-summary-column glass-panel">
            <h3>Checkout Review</h3>
            <div className="checkout-summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item-row">
                  <span>{item.product?.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="summary-totals">
              <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="total-row"><span>GST (5%)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="total-row"><span>Delivery</span><span className="shipping-free">FREE</span></div>
              <hr />
              <div className="total-row grand-total-row"><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="checkout-success glass-panel animate-fade-in">
          <div className="success-icon-shield">
            <CheckCircle size={64} />
          </div>
          <h2>Thank you for your order!</h2>
          <p>Your fluffy cloud-soft items are being packaged carefully and will ship out shortly.</p>
          <div className="order-details-summary-success glass-panel">
            <div className="success-detail-row"><span>Order ID</span><span>#{(Math.random() * 1000000).toFixed(0)}</span></div>
            <div className="success-detail-row"><span>Estimated Delivery</span><span>3-5 Business Days</span></div>
          </div>
          <div className="success-cta-group">
            <button className="btn-primary" onClick={() => setActivePage("orders")}>
              View My Orders
            </button>
            <button className="btn-secondary" onClick={() => setActivePage("shop")}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
