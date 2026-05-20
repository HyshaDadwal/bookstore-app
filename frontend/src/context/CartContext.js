import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    setLoading(true);
    try {
      const res = await API.get(`/cart/${user.id}`);
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (bookId, quantity = 1) => {
    if (!user?.id) return;
    try {
      await API.post(`/cart/add?userId=${user.id}&bookId=${bookId}&quantity=${quantity}`);
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      return false;
    }
  }, [user?.id, fetchCart]);

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      await API.delete(`/cart/${cartItemId}`);
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      return false;
    }
  }, [fetchCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.book?.price || 0) * (item.quantity || 1),
    0
  );

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
