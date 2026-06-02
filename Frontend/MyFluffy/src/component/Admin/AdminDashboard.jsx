import React, { useState, useEffect } from "react";
import { productAPI, categoryAPI, orderAPI, authAPI, contactAPI, analyticsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, TrendingUp, ShoppingBag, FolderHeart, FilePlus, Edit3, Trash2, Settings, UserCheck, Inbox, Plus, RefreshCw, Eye } from "lucide-react";
import "../../style/admin.css";

const AdminDashboard = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Main collections state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState({ total_sales: 0, total_orders: 0, total_users: 0 });

  // Dialog / Edit states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form Fields - Products
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodCost, setProdCost] = useState("");
  const [prodSelling, setProdSelling] = useState("");
  const [prodDiscount, setProdDiscount] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodIsActive, setProdIsActive] = useState(true);

  // Form Fields - Categories
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const refreshData = async () => {
    try {
      setLoading(true);
      const [prods, cats, ords, usrs, conts, anas] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
        orderAPI.getAll(),
        authAPI.getUsers(),
        contactAPI.getAll(),
        analyticsAPI.get().catch(() => []), // Catch if empty database sync
      ]);

      setProducts(prods || []);
      setCategories(cats || []);
      setOrders(ords.data || []);
      setUsers(usrs.data || []);
      setContacts(conts.data || conts || []);

      if (anas && anas.length > 0) {
        setAnalytics(anas[0]);
      } else {
        // Calculate totals dynamically
        const totalSales = (ords.data || []).reduce((acc, o) => acc + parseFloat(o.finale_amount), 0);
        setAnalytics({
          total_sales: totalSales,
          total_orders: (ords.data || []).length,
          total_users: (usrs.data || []).length,
        });
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      showToast("Error retrieving admin records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const openAddProduct = () => {
    setEditingProduct(null);
    setProdName("");
    setProdDesc("");
    setProdCost("");
    setProdSelling("");
    setProdDiscount("0");
    setProdStock("10");
    setProdCategoryId(categories[0]?.id || "");
    setProdImageUrl("");
    setProdIsActive(true);
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description || "");
    setProdCost(p.cost_price);
    setProdSelling(p.selling_price);
    setProdDiscount(p.discount || "0");
    setProdStock(p.stock);
    setProdCategoryId(p.category_id || "");
    setProdImageUrl(p.image_url || "");
    setProdIsActive(p.is_active);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!prodName || !prodSelling || !prodStock) {
      showToast("Fields name, price, stock are required", "warning");
      return;
    }

    const payload = {
      name: prodName,
      description: prodDesc,
      cost_price: parseFloat(prodCost || prodSelling),
      selling_price: parseFloat(prodSelling),
      discount: parseFloat(prodDiscount || 0),
      stock: parseInt(prodStock),
      category_id: prodCategoryId || null,
      image_url: prodImageUrl || null,
      is_active: prodIsActive,
    };

    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, payload);
        showToast("Product updated successfully!", "success");
      } else {
        await productAPI.create(payload);
        showToast("New product created!", "success");
      }
      setShowProductModal(false);
      refreshData();
    } catch (err) {
      showToast("Failed to save product details", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productAPI.delete(id);
      showToast("Product deleted", "info");
      refreshData();
    } catch (err) {
      showToast("Could not delete product", "error");
    }
  };

  const openAddCategory = () => {
    setEditingCategory(null);
    setCatName("");
    setCatDesc("");
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catName || !catDesc) {
      showToast("Name and Description are required", "warning");
      return;
    }

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, { name: catName, description: catDesc });
        showToast("Category updated", "success");
      } else {
        await categoryAPI.create({ name: catName, description: catDesc });
        showToast("New category added", "success");
      }
      setShowCategoryModal(false);
      refreshData();
    } catch (err) {
      showToast("Error saving category", "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category? Products matching it will lose their category association.")) return;
    try {
      await categoryAPI.delete(id);
      showToast("Category removed", "info");
      refreshData();
    } catch (err) {
      showToast("Could not delete category", "error");
    }
  };

  const handleUpdateOrderStatus = async (id, field, value) => {
    try {
      await orderAPI.update(id, { [field]: value });
      showToast(`Order status updated to ${value}`, "success");
      refreshData();
    } catch (err) {
      showToast("Failed to change order status", "error");
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await contactAPI.delete(id);
      showToast("Message archived", "info");
      refreshData();
    } catch (err) {
      showToast("Error archving contact", "error");
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      {/* Title block */}
      <div className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="admin-shield"><ShieldCheck size={28} /></div>
          <div>
            <h1>Corporate Admin Portal</h1>
            <p>Modify inventory items, review customer logs, and manage shipping statuses</p>
          </div>
        </div>
        <button className="btn-secondary refresh-btn" onClick={refreshData} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh Records
        </button>
      </div>

      {/* Tabs list */}
      <div className="admin-tabs-row glass-panel">
        <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
          📊 Analytics Dashboard
        </button>
        <button className={`tab-btn ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
          🧸 Product Inventory ({products.length})
        </button>
        <button className={`tab-btn ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
          ☁️ Categories ({categories.length})
        </button>
        <button className={`tab-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
          📦 Customer Orders ({orders.length})
        </button>
        <button className={`tab-btn ${activeTab === "support" ? "active" : ""}`} onClick={() => setActiveTab("support")}>
          📥 Inbox Inquiries ({contacts.length})
        </button>
      </div>

      {/* Tab contents */}
      <div className="admin-tab-body">
        {activeTab === "overview" && (
          <div className="dashboard-view animate-fade-in">
            {/* Quick Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-box glass-panel">
                <div className="m-icon icon-sales"><TrendingUp size={22} /></div>
                <div>
                  <span>Total Sales Amount</span>
                  <strong>₹{parseFloat(analytics.total_sales || 0).toFixed(2)}</strong>
                </div>
              </div>
              <div className="metric-box glass-panel">
                <div className="m-icon icon-orders"><ShoppingBag size={22} /></div>
                <div>
                  <span>Client Orders</span>
                  <strong>{analytics.total_orders || 0} Orders</strong>
                </div>
              </div>
              <div className="metric-box glass-panel">
                <div className="m-icon icon-users"><UserCheck size={22} /></div>
                <div>
                  <span>Registered Clients</span>
                  <strong>{analytics.total_users || 0} Profiles</strong>
                </div>
              </div>
            </div>

            {/* Custom Bar Chart Visual Graph */}
            <div className="chart-wrapper glass-panel">
              <h3>Monthly Performance Metrics (Mock)</h3>
              <div className="cozy-graph">
                <div className="graph-bar-row">
                  <div className="bar-cylinder" style={{ height: "65%" }}>
                    <span className="bar-tooltip">₹32,500</span>
                  </div>
                  <span className="bar-month">Jan</span>
                </div>
                <div className="graph-bar-row">
                  <div className="bar-cylinder" style={{ height: "45%" }}>
                    <span className="bar-tooltip">₹22,100</span>
                  </div>
                  <span className="bar-month">Feb</span>
                </div>
                <div className="graph-bar-row">
                  <div className="bar-cylinder" style={{ height: "85%" }}>
                    <span className="bar-tooltip">₹45,600</span>
                  </div>
                  <span className="bar-month">Mar</span>
                </div>
                <div className="graph-bar-row">
                  <div className="bar-cylinder active-cylinder" style={{ height: "95%" }}>
                    <span className="bar-tooltip">₹56,200</span>
                  </div>
                  <span className="bar-month">Apr</span>
                </div>
                <div className="graph-bar-row">
                  <div className="bar-cylinder" style={{ height: "70%" }}>
                    <span className="bar-tooltip">₹38,000</span>
                  </div>
                  <span className="bar-month">May</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="inventory-view animate-fade-in">
            <div className="table-header-row">
              <h3>Inventory Catalog</h3>
              <button className="btn-primary" onClick={openAddProduct}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="table-wrapper glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Prices</th>
                    <th>Stock status</th>
                    <th>Visible</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const cat = categories.find((c) => c.id === p.category_id);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="table-prod-info">
                            <img src={p.image_url || "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=150&auto=format&fit=crop"} alt="" className="table-prod-img" />
                            <div>
                              <strong>{p.name}</strong>
                              <span>{cat ? cat.name : "Uncategorized"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-pricing">
                            <strong>₹{parseFloat(p.selling_price).toFixed(2)}</strong>
                            <span>Cost: ₹{parseFloat(p.cost_price).toFixed(2)} ({p.discount}% Off)</span>
                          </div>
                        </td>
                        <td>
                          {p.stock > 0 ? (
                            <span className="badge badge-success">{p.stock} In Stock</span>
                          ) : (
                            <span className="badge badge-danger">OUT OF STOCK</span>
                          )}
                        </td>
                        <td>
                          {p.is_active ? (
                            <span className="badge badge-info">Visible</span>
                          ) : (
                            <span className="badge badge-warning">Hidden</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="action-icon-btn edit-action" title="Edit Product" onClick={() => openEditProduct(p)}>
                              <Edit3 size={16} />
                            </button>
                            <button className="action-icon-btn delete-action" title="Delete Product" onClick={() => handleDeleteProduct(p.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="categories-view animate-fade-in">
            <div className="table-header-row">
              <h3>E-Commerce Category Layouts</h3>
              <button className="btn-primary" onClick={openAddCategory}>
                <Plus size={16} /> Add Category
              </button>
            </div>

            <div className="table-wrapper glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category Title</th>
                    <th>Descriptions</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.description}</td>
                      <td>
                        <button className="action-icon-btn delete-action" title="Delete Category" onClick={() => handleDeleteCategory(c.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-view animate-fade-in">
            <h3>Customer Orders Tracker</h3>

            <div className="table-wrapper glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order UUID</th>
                    <th>Total Billing</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <strong>#{o.id.substring(0, 8).toUpperCase()}</strong>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Date: {new Date(o.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td><strong>₹{parseFloat(o.finale_amount).toFixed(2)}</strong></td>
                      <td>
                        <select
                          value={o.payment_status}
                          className="table-select-badge"
                          onChange={(e) => handleUpdateOrderStatus(o.id, "payment_status", e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={o.order_status}
                          className="table-select-badge"
                          onChange={(e) => handleUpdateOrderStatus(o.id, "order_status", e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="inbox-view animate-fade-in">
            <h3>Client Support Inbox Inquiries</h3>

            <div className="table-wrapper glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Inquirer</th>
                    <th>Support Category</th>
                    <th>Message Details</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <strong>{c.name}</strong>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{c.email}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-info">{c.type || "General Inquiry"}</span></td>
                      <td><p style={{ maxWidth: "350px", fontSize: "0.85rem", lineHeight: "1.4" }}>{c.message}</p></td>
                      <td>
                        <button className="action-icon-btn delete-action" title="Archive Query" onClick={() => handleDeleteContact(c.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Adding / Editing Products Modal Overlay Form */}
      {showProductModal && (
        <div className="admin-modal-overlay animate-fade-in" onClick={() => setShowProductModal(false)}>
          <div className="admin-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? "🔧 Update Inventory Details" : "🧸 Insert New Product"}</h3>
            <hr />

            <form onSubmit={handleProductSubmit} className="admin-modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="Fluffy Cloud Pillow" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select value={prodCategoryId} onChange={(e) => setProdCategoryId(e.target.value)}>
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock Count</label>
                  <input type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required min="0" />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Cost Price (₹)</label>
                  <input type="number" placeholder="500" value={prodCost} onChange={(e) => setProdCost(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Selling Price (₹)</label>
                  <input type="number" placeholder="400" value={prodSelling} onChange={(e) => setProdSelling(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input type="number" placeholder="0" value={prodDiscount} onChange={(e) => setProdDiscount(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input type="text" placeholder="https://images.unsplash.com/...image.jpg" value={prodImageUrl} onChange={(e) => setProdImageUrl(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Detailed Description</label>
                <textarea rows={3} placeholder="Cozy material specs..." value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}></textarea>
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="prodActive" checked={prodIsActive} onChange={(e) => setProdIsActive(e.target.checked)} />
                <label htmlFor="prodActive">Product visible in Catalog</label>
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn-primary">Save Product Details</button>
                <button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="admin-modal-overlay animate-fade-in" onClick={() => setShowCategoryModal(false)}>
          <div className="admin-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <h3>☁️ Add Category</h3>
            <hr />

            <form onSubmit={handleCategorySubmit} className="admin-modal-form">
              <div className="form-group">
                <label>Category Title</label>
                <input type="text" placeholder="Weighted Blankets" value={catName} onChange={(e) => setCatName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Brief Description</label>
                <textarea rows={3} placeholder="Therapeutic weighted cotton cover blanks..." value={catDesc} onChange={(e) => setCatDesc(e.target.value)} required></textarea>
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn-primary">Save Category</button>
                <button type="button" className="btn-secondary" onClick={() => setShowCategoryModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
