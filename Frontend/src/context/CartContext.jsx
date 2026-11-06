import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { cartAPI, cartItemAPI, productAPI } from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token, showToast } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);

  // Load guest cart from local storage on mount
  useEffect(() => {
    if (!user) {
      const savedCart = localStorage.getItem("guestCart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [user]);

  // Load and sync cart when user logs in
  useEffect(() => {
    const syncUserCart = async () => {
      if (!user || !token) {
        setCartId(null);
        return;
      }

      try {
        setLoadingCart(true);
        // 1. Fetch all carts to see if this user already has one
        const carts = await cartAPI.getAllCarts();
        let userCart = carts.find((c) => c.user_id === user.id);

        // 2. If no cart exists, create one in the backend
        if (!userCart) {
          userCart = await cartAPI.create(user.id);
        }

        setCartId(userCart.id);

        // 3. Get all cart items from backend and filter by this cart_id
        const [itemsResponse, prodsData] = await Promise.all([
          cartItemAPI.getAll(),
          productAPI.getAll()
        ]);
        const allItems = itemsResponse.data || [];
        const userItems = allItems.filter((item) => item.cart_id === userCart.id);
        const productsList = prodsData || [];

        // Map items from backend format to frontend structured format
        const mappedItems = userItems.map((item) => {
          const matchingProduct = productsList.find((p) => p.id === item.product_id);
          return {
            dbId: item.id, // Keep backend record ID to update/delete
            id: item.product_id, // Product UUID
            quantity: item.quantity,
            price: parseFloat(item.price),
            product: matchingProduct,
          };
        });

        setCartItems(mappedItems);
      } catch (err) {
        console.error("Error syncing cart with backend:", err);
        // Fall back to local storage silently
        const savedCart = localStorage.getItem(`cart_${user.id}`);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setLoadingCart(false);
      }
    };

    syncUserCart();
  }, [user, token]);

  // Persist guest/user cart in local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem("guestCart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, qty = 1) => {
    try {
      const existingItem = cartItems.find((item) => item.id === product.id);
      const newQty = existingItem ? existingItem.quantity + qty : qty;

      if (newQty > product.stock) {
        showToast("Cannot add more than available in stock.", "warning");
        return;
      }

      const finalPrice = product.selling_price * (1 - (product.discount || 0) / 100);

      if (user && cartId) {
        if (existingItem) {
          // Update existing item in backend
          const updatedItem = await cartItemAPI.update(existingItem.dbId, {
            quantity: newQty,
            price: finalPrice,
          });
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === product.id
                ? { ...item, quantity: newQty }
                : item
            )
          );
        } else {
          // Add new item to backend
          const newItem = await cartItemAPI.create({
            cart_id: cartId,
            product_id: product.id,
            quantity: qty,
            price: finalPrice,
          });
          setCartItems((prev) => [
            ...prev,
            {
              dbId: newItem.id,
              id: product.id,
              quantity: qty,
              price: parseFloat(finalPrice),
              product,
            },
          ]);
        }
      } else {
        // Offline / Guest operation
        if (existingItem) {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + qty }
                : item
            )
          );
        } else {
          setCartItems((prev) => [
            ...prev,
            {
              id: product.id,
              quantity: qty,
              price: parseFloat(finalPrice),
              product,
            },
          ]);
        }
      }
      showToast(`${product.name} added to cart!`, "success");
    } catch (err) {
      console.error("Cart add error:", err);
      // Fallback
      setCartItems((prev) => {
        const item = prev.find((i) => i.id === product.id);
        if (item) {
          return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
        }
        return [...prev, { id: product.id, quantity: qty, price: parseFloat(finalPrice), product }];
      });
      showToast(`${product.name} added to local cart`, "success");
    }
  };

  const updateQuantity = async (productId, amount) => {
    const item = cartItems.find((item) => item.id === productId);
    if (!item) return;

    const newQty = item.quantity + amount;
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQty > (item.product?.stock || 0)) {
      showToast("Cannot add more than available in stock.", "warning");
      return;
    }

    try {
      if (user && item.dbId) {
        await cartItemAPI.update(item.dbId, {
          quantity: newQty,
          price: item.price,
        });
      }
      setCartItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      console.error("Cart update quantity error:", err);
      // Fallback
      setCartItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    try {
      if (user && item.dbId) {
        await cartItemAPI.delete(item.dbId);
      }
      setCartItems((prev) => prev.filter((i) => i.id !== productId));
      showToast("Item removed from cart", "info");
    } catch (err) {
      console.error("Cart remove error:", err);
      setCartItems((prev) => prev.filter((i) => i.id !== productId));
      showToast("Item removed from local cart", "info");
    }
  };

  const clearCart = async () => {
    try {
      if (user && cartItems.length > 0) {
        await Promise.all(
          cartItems.map((item) => item.dbId && cartItemAPI.delete(item.dbId))
        );
      }
    } catch (err) {
      console.error("Clear cart error:", err);
    } finally {
      setCartItems([]);
      localStorage.removeItem(user ? `cart_${user.id}` : "guestCart");
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loadingCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getSubtotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
