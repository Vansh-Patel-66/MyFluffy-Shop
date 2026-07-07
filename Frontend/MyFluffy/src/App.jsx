import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Component imports
import Navbar from "./component/Navbar/Navbar";
import Toast from "./component/Toast/Toast";
import Login from "./component/Login/login";
import Signup from "./component/Login/signup";
import Home from "./component/home/home";
import Shop from "./component/Shop/Shop";
import ProductDetailsModal from "./component/ProductDetails/ProductDetailsModal";
import Cart from "./component/Cart/Cart";
import Checkout from "./component/Checkout/Checkout";
import Orders from "./component/Orders/Orders";
import Contact from "./component/Contact/Contact";
import AboutUs from "./component/AboutUs/AboutUs";
import AdminDashboard from "./component/Admin/AdminDashboard";
import Footer from "./component/Footer/Footer";

import "./App.css";

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleLoginSuccess = () => {
    setActivePage("home");
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "shop":
        return (
          <Shop
            setSelectedProduct={setSelectedProduct}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case "cart":
        return <Cart setActivePage={setActivePage} />;
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
        return <Home setActivePage={setActivePage} setSelectedProduct={setSelectedProduct} setSelectedCategory={setSelectedCategory} />;
      case "login":
        if (user) {
          return <Home setActivePage={setActivePage} setSelectedProduct={setSelectedProduct} setSelectedCategory={setSelectedCategory} />;
        }
        return <Login onLoginSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      case "signup":
        if (user) {
          return <Home setActivePage={setActivePage} setSelectedProduct={setSelectedProduct} setSelectedCategory={setSelectedCategory} />;
        }
        return <Signup setActivePage={setActivePage} />;
      case "home":
      default:
        return (
          <Home
            setActivePage={setActivePage}
            setSelectedProduct={setSelectedProduct}
            setSelectedCategory={setSelectedCategory}
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
        setShopCategory={setSelectedCategory}
      />

      {/* Main Container */}
      <main style={{ flex: 1 }}>
        {renderActivePage()}
      </main>

      {/* Render Reusable Footer globally (except in Admin Portal) */}
      {activePage !== "admin" && <Footer setActivePage={setActivePage} />}

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        setActivePage={setActivePage}
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