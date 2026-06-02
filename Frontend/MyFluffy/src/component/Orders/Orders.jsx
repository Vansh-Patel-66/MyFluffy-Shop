import React, { useState, useEffect } from "react";
import { orderAPI, orderItemAPI, productAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { ShoppingBag, ChevronDown, ChevronUp, Package, Calendar, Tag, ShieldCheck, HelpCircle } from "lucide-react";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // 1. Fetch all orders and all products
        const [ordersRes, prodsRes, itemsRes] = await Promise.all([
          orderAPI.getAll(),
          productAPI.getAll(),
          orderItemAPI.getAll(),
        ]);

        const allOrders = ordersRes.data || [];
        const allItems = itemsRes.data || [];

        // 2. Filter orders for this user
        const userOrders = allOrders.filter((o) => o.user_id === user.id);
        
        // Sort orders by latest date
        userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(userOrders);

        // 3. Create products map for quick lookup
        const prodsMap = {};
        (prodsRes || []).forEach((p) => {
          prodsMap[p.id] = p;
        });
        setProducts(prodsMap);

        // 4. Create items map grouped by order_id
        const itemsGroup = {};
        (allItems || []).forEach((item) => {
          if (!itemsGroup[item.order_id]) {
            itemsGroup[item.order_id] = [];
          }
          itemsGroup[item.order_id].push(item);
        });
        setOrderItemsMap(itemsGroup);
      } catch (err) {
        console.error("Orders fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProducts();
  }, [user]);

  const toggleExpandOrder = (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Status mapping
  const getStatusBadge = (status, type) => {
    const s = status.toLowerCase();
    if (type === "order") {
      switch (s) {
        case "delivered":
          return <span className="badge badge-success">Delivered</span>;
        case "shipped":
          return <span className="badge badge-info">Shipped</span>;
        case "cancelled":
          return <span className="badge badge-danger">Cancelled</span>;
        default:
          return <span className="badge badge-warning">Pending Package</span>;
      }
    } else {
      // Payment status
      switch (s) {
        case "paid":
          return <span className="badge badge-success">Paid securely</span>;
        case "failed":
          return <span className="badge badge-danger">Failed</span>;
        default:
          return <span className="badge badge-warning">Pending Payment</span>;
      }
    }
  };

  if (loading) {
    return (
      <div className="loader-container" style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <span className="spinner"></span>
        <p style={{ marginTop: "12px", color: "var(--text-muted)" }}>Loading order histories...</p>
      </div>
    );
  }

  return (
    <div style={orderStyles.page} className="animate-fade-in">
      <div style={orderStyles.header}>
        <h1>My Purchase History</h1>
        <p>Review and track your recent orders and fluffy bedding details</p>
      </div>

      {orders.length > 0 ? (
        <div style={orderStyles.list}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const items = orderItemsMap[order.id] || [];

            return (
              <div key={order.id} className="glass-panel" style={orderStyles.card}>
                {/* Collapsed top view bar */}
                <div style={orderStyles.cardHeader} onClick={() => toggleExpandOrder(order.id)}>
                  <div style={orderStyles.metaGroup}>
                    <div style={orderStyles.iconBox}><Package size={22} color="var(--primary)" /></div>
                    <div>
                      <strong style={orderStyles.orderId}>Order #{order.id.substring(0, 8).toUpperCase()}</strong>
                      <div style={orderStyles.dateRow}>
                        <Calendar size={12} /> <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={orderStyles.middleGroup}>
                    <div>
                      <span style={orderStyles.summaryLbl}>Total Price</span>
                      <strong style={orderStyles.summaryVal}>₹{parseFloat(order.finale_amount).toFixed(2)}</strong>
                    </div>
                  </div>

                  <div style={orderStyles.statusGroup}>
                    {getStatusBadge(order.order_status, "order")}
                    {getStatusBadge(order.payment_status, "payment")}
                  </div>

                  <button style={orderStyles.toggleBtn}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Tracking Progress Pipeline Indicator */}
                {isExpanded && order.order_status !== "cancelled" && (
                  <div style={orderStyles.pipelineContainer} className="animate-fade-in">
                    <div style={orderStyles.pipelineLine}>
                      <div
                        style={{
                          ...orderStyles.pipelineActiveLine,
                          width: order.order_status.toLowerCase() === "delivered" ? "100%" : order.order_status.toLowerCase() === "shipped" ? "50%" : "0%",
                        }}
                      ></div>
                    </div>
                    <div style={orderStyles.pipelineSteps}>
                      <div style={orderStyles.pipelineStep}>
                        <div style={{ ...orderStyles.stepDot, backgroundColor: "var(--success)" }}></div>
                        <span style={orderStyles.stepLbl}>Order Received</span>
                      </div>
                      <div style={orderStyles.pipelineStep}>
                        <div
                          style={{
                            ...orderStyles.stepDot,
                            backgroundColor: ["shipped", "delivered"].includes(order.order_status.toLowerCase()) ? "var(--success)" : "var(--border-glass)",
                          }}
                        ></div>
                        <span style={orderStyles.stepLbl}>Package Shipped</span>
                      </div>
                      <div style={orderStyles.pipelineStep}>
                        <div
                          style={{
                            ...orderStyles.stepDot,
                            backgroundColor: order.order_status.toLowerCase() === "delivered" ? "var(--success)" : "var(--border-glass)",
                          }}
                        ></div>
                        <span style={orderStyles.stepLbl}>Out for Delivery</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded items breakdown drawer list */}
                {isExpanded && (
                  <div style={orderStyles.expandedBlock} className="animate-fade-in">
                    <hr style={orderStyles.divider} />
                    <h3>Item Details ({items.length})</h3>
                    <div style={orderStyles.itemsShelf}>
                      {items.map((item) => {
                        const prod = products[item.product_id] || {};
                        return (
                          <div key={item.id} style={orderStyles.itemRow}>
                            <img
                              src={prod.image_url || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=200&auto=format&fit=crop"}
                              alt={prod.name || "Cloud beddings"}
                              style={orderStyles.itemImg}
                            />
                            <div style={orderStyles.itemMeta}>
                              <strong>{prod.name || "Cozy Pillow"}</strong>
                              <span style={orderStyles.itemQuantity}>Qty: {item.quantity}</span>
                            </div>
                            <div style={orderStyles.itemPriceCol}>
                              <strong>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</strong>
                              <span style={orderStyles.itemUnitPrice}>₹{parseFloat(item.price).toFixed(2)} each</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <hr style={orderStyles.divider} />

                    <div style={orderStyles.invoiceFooter}>
                      <div style={orderStyles.bulletBox}>
                        <ShieldCheck size={18} color="var(--success)" />
                        <span>This order is covered under our 100-Night Softness Guarantee.</span>
                      </div>
                      <div style={orderStyles.invoiceNumbers}>
                        <div style={orderStyles.invoiceRow}>
                          <span>Tax GST (5%)</span>
                          <span>₹{parseFloat(order.tax_amount).toFixed(2)}</span>
                        </div>
                        <div style={orderStyles.invoiceRow}>
                          <span>Delivery Fees</span>
                          <span style={{ color: "var(--success)" }}>FREE</span>
                        </div>
                        <div style={{ ...orderStyles.invoiceRow, ...orderStyles.grandRow }}>
                          <span>Final Amount Paid</span>
                          <span>₹{parseFloat(order.finale_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="checkout-empty glass-panel animate-fade-in" style={{ padding: "60px 40px", maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
          <ShoppingBag size={54} color="var(--primary)" />
          <h2>No Purchases Found</h2>
          <p>You haven't ordered any fluffy blankets or pillows yet! Let's explore our catalog first.</p>
          <button className="btn-primary" style={{ marginTop: "16px" }} onClick={() => (window.location.hash = "#shop")}>
            Browse Shop Catalog
          </button>
        </div>
      )}
    </div>
  );
};

const orderStyles = {
  page: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  header: {
    textAlign: "center",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  card: {
    padding: "24px 32px",
    borderRadius: "20px !important",
    cursor: "pointer",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
  },
  metaGroup: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "var(--primary-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  orderId: {
    fontSize: "1.1rem",
    color: "var(--text-main)",
  },
  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    marginTop: "2px",
  },
  middleGroup: {
    display: "flex",
    flexDirection: "column",
  },
  summaryLbl: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
  },
  summaryVal: {
    fontSize: "1.2rem",
    color: "var(--text-main)",
    fontFamily: "var(--font-display)",
  },
  statusGroup: {
    display: "flex",
    gap: "8px",
  },
  toggleBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
  },
  pipelineContainer: {
    margin: "24px 0 12px 0",
    padding: "0 12px",
  },
  pipelineLine: {
    height: "4px",
    background: "var(--border-glass)",
    borderRadius: "99px",
    position: "relative",
  },
  pipelineActiveLine: {
    position: "absolute",
    height: "100%",
    left: 0,
    background: "var(--success)",
    borderRadius: "99px",
    transition: "width 0.4s ease",
  },
  pipelineSteps: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "-6px",
  },
  pipelineStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  stepDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    zIndex: 2,
    border: "2px solid white",
  },
  stepLbl: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "var(--text-muted)",
  },
  expandedBlock: {
    marginTop: "20px",
  },
  divider: {
    border: 0,
    borderTop: "1.5px solid var(--border-glass)",
    margin: "20px 0",
  },
  itemsShelf: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "16px",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "12px",
    background: "white",
    borderRadius: "12px",
    border: "1px solid var(--border-glass)",
  },
  itemImg: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  itemMeta: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  itemQuantity: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
  itemPriceCol: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
  },
  itemUnitPrice: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
  invoiceFooter: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "24px",
    alignItems: "center",
    marginTop: "20px",
  },
  bulletBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px",
    background: "hsl(142, 70%, 95%)",
    color: "var(--success)",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  invoiceNumbers: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  invoiceRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "var(--text-muted)",
  },
  grandRow: {
    fontSize: "1.1rem",
    fontWeight: "800",
    color: "var(--text-main)",
    fontFamily: "var(--font-display)",
    marginTop: "4px",
  },
};

export default Orders;
