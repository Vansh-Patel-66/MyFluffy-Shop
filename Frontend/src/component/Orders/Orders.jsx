import React, { useState, useEffect } from "react";
import { orderAPI, orderItemAPI, productAPI, getImageUrl } from "../../utils/api";
import { formatPrice } from "../../utils/currency";
import { useAuth } from "../../context/AuthContext";
import { ShoppingBag, ChevronDown, ChevronUp, Package, Calendar, ShieldCheck, Truck, Check } from "lucide-react";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [ordersRes, prodsRes, itemsRes] = await Promise.all([
          orderAPI.getAll(),
          productAPI.getAll(),
          orderItemAPI.getAll(),
        ]);

        const allOrders = ordersRes.data || [];
        const allItems = itemsRes.data || [];

        // Filter orders for logged-in user or show all if admin
        const userOrders = allOrders.filter((o) => o.user_id === user.id);
        userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(userOrders);

        // Map products for fast lookup
        const prodsMap = {};
        (prodsRes || []).forEach((p) => {
          prodsMap[p.id] = p;
        });
        setProducts(prodsMap);

        // Map items grouped by order_id
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
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status, type) => {
    const s = (status || "").toLowerCase();
    if (type === "order") {
      switch (s) {
        case "delivered":
          return <span style={{ ...orderStyles.badge, backgroundColor: "#f0fdf4", color: "#16a34a" }}>Delivered</span>;
        case "shipped":
          return <span style={{ ...orderStyles.badge, backgroundColor: "#eff6ff", color: "#2563eb" }}>In Transit</span>;
        case "cancelled":
          return <span style={{ ...orderStyles.badge, backgroundColor: "#fef2f2", color: "#dc2626" }}>Cancelled</span>;
        default:
          return <span style={{ ...orderStyles.badge, backgroundColor: "#fefce8", color: "#ca8a04" }}>Preparing Order</span>;
      }
    } else {
      switch (s) {
        case "paid":
          return <span style={{ ...orderStyles.badge, backgroundColor: "#f0fdf4", color: "#16a34a" }}>Paid Securely</span>;
        case "failed":
          return <span style={{ ...orderStyles.badge, backgroundColor: "#fef2f2", color: "#dc2626" }}>Payment Failed</span>;
        default:
          return <span style={{ ...orderStyles.badge, backgroundColor: "#fefce8", color: "#ca8a04" }}>Payment Pending</span>;
      }
    }
  };

  if (loading) {
    return (
      <div style={orderStyles.pageLoading}>
        <span className="spinner"></span>
        <p style={{ marginTop: "12px", color: "var(--text-muted)" }}>Loading order history...</p>
      </div>
    );
  }

  return (
    <div style={orderStyles.page} className="animate-fade-in">
      <div style={orderStyles.header}>
        <span style={orderStyles.eyebrow}>PURCHASE ARCHIVE</span>
        <h1 style={orderStyles.pageTitle}>Your Cozy Orders</h1>
        <p style={orderStyles.subtitle}>
          Track ongoing shipments, view receipts, and re-order your favorite cloud-soft pieces.
        </p>
      </div>

      {orders.length > 0 ? (
        <div style={orderStyles.list}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const items = orderItemsMap[order.id] || [];
            const finaleAmount = parseFloat(order.finale_amount || 0);

            return (
              <div key={order.id} style={orderStyles.card}>
                {/* Header Row */}
                <div style={orderStyles.cardHeader} onClick={() => toggleExpandOrder(order.id)}>
                  <div style={orderStyles.metaGroup}>
                    <div style={orderStyles.iconBox}>
                      <Package size={22} color="var(--primary)" />
                    </div>
                    <div>
                      <strong style={orderStyles.orderId}>
                        Order #{order.id.substring(0, 8).toUpperCase()}
                      </strong>
                      <div style={orderStyles.dateRow}>
                        <Calendar size={13} color="var(--text-muted)" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={orderStyles.middleGroup}>
                    <span style={orderStyles.summaryLbl}>Total</span>
                    <strong style={orderStyles.summaryVal}>{formatPrice(finaleAmount)}</strong>
                  </div>

                  <div style={orderStyles.statusGroup}>
                    {getStatusBadge(order.order_status, "order")}
                    {getStatusBadge(order.payment_status, "payment")}
                  </div>

                  <button style={orderStyles.toggleBtn} aria-label="Expand order details">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Progress Pipeline */}
                {isExpanded && order.order_status !== "cancelled" && (
                  <div style={orderStyles.pipelineContainer}>
                    <div style={orderStyles.pipelineLine}>
                      <div
                        style={{
                          ...orderStyles.pipelineActiveLine,
                          width:
                            order.order_status?.toLowerCase() === "delivered"
                              ? "100%"
                              : order.order_status?.toLowerCase() === "shipped"
                              ? "50%"
                              : "10%",
                        }}
                      />
                    </div>
                    <div style={orderStyles.pipelineSteps}>
                      <div style={orderStyles.pipelineStep}>
                        <div style={{ ...orderStyles.stepDot, backgroundColor: "var(--primary)" }} />
                        <span style={orderStyles.stepLbl}>Order Received</span>
                      </div>
                      <div style={orderStyles.pipelineStep}>
                        <div
                          style={{
                            ...orderStyles.stepDot,
                            backgroundColor:
                              ["shipped", "delivered"].includes(order.order_status?.toLowerCase())
                                ? "var(--primary)"
                                : "var(--border-subtle)",
                          }}
                        />
                        <span style={orderStyles.stepLbl}>In Transit</span>
                      </div>
                      <div style={orderStyles.pipelineStep}>
                        <div
                          style={{
                            ...orderStyles.stepDot,
                            backgroundColor:
                              order.order_status?.toLowerCase() === "delivered"
                                ? "var(--primary)"
                                : "var(--border-subtle)",
                          }}
                        />
                        <span style={orderStyles.stepLbl}>Delivered</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={orderStyles.expandedBlock}>
                    <hr style={orderStyles.divider} />
                    <h3 style={orderStyles.detailsHeading}>Items in Package ({items.length})</h3>

                    <div style={orderStyles.itemsShelf}>
                      {items.map((item) => {
                        const prod = products[item.product_id] || {};
                        const itemPrice = parseFloat(item.price || 0);
                        const itemTotal = itemPrice * (item.quantity || 1);
                        const imgSrc = getImageUrl(prod.image_url) || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=200&auto=format&fit=crop";

                        return (
                          <div key={item.id} style={orderStyles.itemRow}>
                            <img src={imgSrc} alt={prod.name || "Cozy Item"} style={orderStyles.itemImg} />
                            <div style={orderStyles.itemMeta}>
                              <strong style={orderStyles.itemTitle}>{prod.name || "Curated Comfort Item"}</strong>
                              <span style={orderStyles.itemQuantity}>Qty: {item.quantity}</span>
                            </div>
                            <div style={orderStyles.itemPriceCol}>
                              <strong style={orderStyles.itemTotalText}>{formatPrice(itemTotal)}</strong>
                              <span style={orderStyles.itemUnitPrice}>{formatPrice(itemPrice)} each</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <hr style={orderStyles.divider} />

                    <div style={orderStyles.invoiceFooter}>
                      <div style={orderStyles.guaranteeCallout}>
                        <ShieldCheck size={16} color="var(--primary)" />
                        <span>Protected by our 100-Night Softness Guarantee</span>
                      </div>
                      <div style={orderStyles.invoiceNumbers}>
                        <div style={orderStyles.invoiceRow}>
                          <span>Subtotal</span>
                          <span>{formatPrice(parseFloat(order.sub_total_amount || finaleAmount))}</span>
                        </div>
                        <div style={orderStyles.invoiceRow}>
                          <span>Shipping</span>
                          <span>
                            {parseFloat(order.delivery_charge || 0) === 0 ? (
                              <strong style={{ color: "#16a34a" }}>FREE</strong>
                            ) : (
                              formatPrice(parseFloat(order.delivery_charge))
                            )}
                          </span>
                        </div>
                        <div style={{ ...orderStyles.invoiceRow, ...orderStyles.grandRow }}>
                          <span>Total Paid</span>
                          <span>{formatPrice(finaleAmount)}</span>
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
        <div style={orderStyles.emptyState}>
          <div style={{ fontSize: "3rem" }}>📦</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>No orders placed yet</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: "400px" }}>
            When you complete a purchase, your tracking numbers, item breakdowns, and receipts will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

const orderStyles = {
  page: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "36px 24px 80px",
  },
  pageLoading: {
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 36px",
  },
  eyebrow: {
    fontSize: "0.74rem",
    fontWeight: "700",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--primary)",
    display: "block",
    marginBottom: "4px",
  },
  pageTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "2.4rem",
    fontWeight: "700",
    color: "var(--text-main)",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "var(--text-muted)",
    marginTop: "8px",
    lineHeight: "1.6",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid var(--border-subtle)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "var(--shadow-sm)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    gap: "16px",
  },
  metaGroup: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  iconBox: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "var(--primary-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  orderId: {
    fontFamily: "var(--font-sans)",
    fontSize: "0.98rem",
    color: "var(--text-main)",
    display: "block",
  },
  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    marginTop: "2px",
  },
  middleGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  summaryLbl: {
    fontSize: "0.74rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  summaryVal: {
    fontSize: "1.1rem",
    color: "var(--text-main)",
  },
  statusGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  badge: {
    fontSize: "0.76rem",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "999px",
    letterSpacing: "0.04em",
  },
  toggleBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "50%",
  },
  pipelineContainer: {
    margin: "24px 0 12px",
    padding: "0 16px",
  },
  pipelineLine: {
    position: "relative",
    height: "4px",
    backgroundColor: "var(--bg-warm)",
    borderRadius: "999px",
    marginBottom: "10px",
  },
  pipelineActiveLine: {
    height: "100%",
    backgroundColor: "var(--primary)",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },
  pipelineSteps: {
    display: "flex",
    justifyContent: "space-between",
  },
  pipelineStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  stepDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  stepLbl: {
    fontSize: "0.74rem",
    color: "var(--text-muted)",
    fontWeight: "500",
  },
  expandedBlock: {
    marginTop: "16px",
  },
  divider: {
    border: 0,
    borderTop: "1px solid var(--border-subtle)",
    margin: "16px 0",
  },
  detailsHeading: {
    fontFamily: "var(--font-sans)",
    fontSize: "0.94rem",
    fontWeight: "600",
    color: "var(--text-main)",
    marginBottom: "12px",
  },
  itemsShelf: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  itemRow: {
    display: "grid",
    gridTemplateColumns: "50px 1fr auto",
    gap: "14px",
    alignItems: "center",
  },
  itemImg: {
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    objectFit: "cover",
    backgroundColor: "#fbf5ee",
  },
  itemMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  itemTitle: {
    fontSize: "0.9rem",
    color: "var(--text-main)",
  },
  itemQuantity: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
  },
  itemPriceCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  itemTotalText: {
    fontSize: "0.94rem",
    color: "var(--text-main)",
  },
  itemUnitPrice: {
    fontSize: "0.76rem",
    color: "var(--text-muted)",
  },
  invoiceFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "16px",
  },
  guaranteeCallout: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
  invoiceNumbers: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "220px",
  },
  invoiceRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "var(--text-muted)",
  },
  grandRow: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "var(--text-main)",
    borderTop: "1px solid var(--border-subtle)",
    paddingTop: "6px",
    marginTop: "4px",
  },
  emptyState: {
    background: "#ffffff",
    border: "1px dashed var(--border-subtle)",
    borderRadius: "24px",
    padding: "60px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
};

export default Orders;
