import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Component imports
import Navbar from "./component/Navbar/Navbar";
import Toast from "./component/Toast/Toast";
import Login from "./component/Login/login";
import Home from "./component/home/home";
import Shop from "./component/Shop/Shop";
import ProductDetailsModal from "./component/ProductDetails/ProductDetailsModal";
import CartDrawer from "./component/Cart/CartDrawer";
import Checkout from "./component/Checkout/Checkout";
import Orders from "./component/Orders/Orders";
import Contact from "./component/Contact/Contact";
import AboutUs from "./component/AboutUs/AboutUs";
import AdminDashboard from "./component/Admin/AdminDashboard";

import "./App.css";

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleLoginSuccess = () => {
    setActivePage("home");
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "shop":
        return <Shop setSelectedProduct={setSelectedProduct} />;
      case "contact":
        return <Contact />;
      case "about":
        return <AboutUs setActivePage={setActivePage} />;
      case "orders":
        return <Orders />;
      case "checkout":
        return <Checkout setActivePage={setActivePage} />;
      case "admin":
        if (user && user.role === "admin") {
          return <AdminDashboard />;
        }
        return <Home setActivePage={setActivePage} setSelectedProduct={setSelectedProduct} />;
      case "login":
        if (user) {
          return <Home setActivePage={setActivePage} setSelectedProduct={setSelectedProduct} />;
        }
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case "home":
      default:
        return (
          <Home
            userEmail={user ? user.email : "Guest"}
            setActivePage={setActivePage}
            setSelectedProduct={setSelectedProduct}
          />
        );
    }
  };

  return (
    <div className="app-viewport">
      {/* Dynamic Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
      />

      {/* Main Container */}
      <main style={{ flex: 1, paddingBottom: "60px" }}>
        {renderActivePage()}
      </main>

      {/* Global Interactive Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        setActivePage={setActivePage}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Toast />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;