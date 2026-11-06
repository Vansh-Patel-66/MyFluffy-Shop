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
import AdminLogin from "./component/Admin/AdminLogin";
import Footer from "./component/Footer/Footer";

import "./App.css";

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      return path === "/admin/login" ? "adminLogin" : "admin";
    }
    return "home";
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleLoginSuccess = (loggedInUser) => {
    // Normal login doesn't allow admin entry anymore (or we just redirect them if they somehow logged in)
    if (loggedInUser && loggedInUser.role === "admin") {
      setActivePage("admin");
      window.history.pushState({}, "", "/admin");
    } else {
      setActivePage("home");
      window.history.pushState({}, "", "/");
    }
  };

  const handleAdminLoginSuccess = (loggedInUser) => {
    if (loggedInUser && loggedInUser.role === "admin") {
      setActivePage("admin");
      window.history.pushState({}, "", "/admin");
    }
  };

  // Sync back button / URL changes
  React.useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/admin")) {
        setActivePage(path === "/admin/login" ? "adminLogin" : "admin");
      } else {
        setActivePage("home");
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const changePage = (page) => {
    setActivePage(page);
    if (page === "admin") {
      window.history.pushState({}, "", "/admin");
    } else if (page === "adminLogin") {
      window.history.pushState({}, "", "/admin/login");
    } else {
      window.history.pushState({}, "", "/");
    }
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
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      case "adminLogin":
        if (user && user.role === "admin") {
          return <AdminDashboard />;
        }
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      case "login":
        if (user) {
          return <Home setActivePage={changePage} setSelectedProduct={setSelectedProduct} setSelectedCategory={setSelectedCategory} />;
        }
        return <Login onLoginSuccess={handleLoginSuccess} setActivePage={changePage} />;
      case "signup":
        if (user) {
          return <Home setActivePage={changePage} setSelectedProduct={setSelectedProduct} setSelectedCategory={setSelectedCategory} />;
        }
        return <Signup setActivePage={changePage} />;
      case "home":
      default:
        return (
          <Home
            setActivePage={changePage}
            setSelectedProduct={setSelectedProduct}
            setSelectedCategory={setSelectedCategory}
          />
        );
    }
  };

  const isAdminRoute = activePage === "admin" || activePage === "adminLogin";

  return (
    <div className="app-viewport">
      {/* Dynamic Navigation Header */}
      {!isAdminRoute && (
        <Navbar
          activePage={activePage}
          setActivePage={changePage}
          setShopCategory={setSelectedCategory}
        />
      )}

      {/* Main Container */}
      <main style={{ flex: 1 }}>
        {renderActivePage()}
      </main>

      {/* Render Reusable Footer globally (except in Admin Portal) */}
      {!isAdminRoute && <Footer setActivePage={changePage} />}

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