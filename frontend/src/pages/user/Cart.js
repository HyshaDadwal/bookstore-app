import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/layout/UserLayout";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, loading, removeFromCart, fetchCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const handleRemove = async (id) => {
    const success = await removeFromCart(id);
    if (success) toast.info("Item removed from cart");
    else toast.error("Failed to remove item");
  };

  const handlePlaceOrder = async () => {
    if (!user?.id) return;
    try {
      await API.post(`/orders/place?userId=${user.id}`);
      toast.success("Order placed successfully! 🎉");
      await fetchCart();
      navigate("/orders");
    } catch {
      toast.error("Failed to place order");
    }
  };

  if (loading) return <UserLayout><Loader text="Loading cart..." /></UserLayout>;

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-surface-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            subtitle="Looks like you haven't added any books yet. Start exploring!"
            actionLabel="Browse Books"
            onAction={() => navigate("/")}
            icon={
              <svg className="w-16 h-16 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="card p-5 flex gap-5 items-center">
                  <img
                    src={item.book?.imageUrl || `https://placehold.co/80x100/1e293b/f8fafc?text=Book`}
                    alt={item.book?.title}
                    className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-surface-900 text-lg truncate">{item.book?.title}</h3>
                    <p className="text-surface-500 text-sm">{item.book?.author || "Unknown Author"}</p>
                    <p className="text-surface-900 font-semibold mt-1">₹{item.book?.price}</p>
                    <p className="text-surface-500 text-sm mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-lg text-surface-900">₹{(item.book?.price || 0) * (item.quantity || 1)}</p>
                    <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-surface-900 mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-surface-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-surface-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-surface-100 pt-3 flex justify-between text-lg font-bold text-surface-900">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>
                <button onClick={handlePlaceOrder} className="btn-primary w-full mt-6 py-3 text-base">Place Order</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Cart;