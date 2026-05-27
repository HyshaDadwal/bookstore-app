import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import UserLayout from "../../components/layout/UserLayout";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function Orders() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    API.get(`/orders/user/${user.id}`)
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [user?.id, toast]);

  const statusColors = {
    PLACED: "badge bg-indigo-100 text-indigo-700",
    PENDING: "badge bg-amber-100 text-amber-700",
    SHIPPED: "badge bg-blue-100 text-blue-700",
    DELIVERED: "badge bg-emerald-100 text-emerald-700",
    CANCELLED: "badge bg-red-100 text-red-700",
  };

  if (loading) return <UserLayout><Loader text="Loading orders..." /></UserLayout>;

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-surface-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            subtitle="You haven't placed any orders yet. Start shopping!"
            actionLabel="Browse Books"
            onAction={() => navigate("/")}
            icon={
              <svg className="w-16 h-16 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-surface-500">Order #{order.id}</p>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={statusColors[order.status] || "badge-gray"}>
                      {order.status || "PENDING"}
                    </span>
                    <span className="text-lg font-bold text-surface-900">₹{order.totalAmount || 0}</span>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="border-t border-surface-100 pt-4 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img src={item.book?.imageUrl || `https://placehold.co/48x60/1e293b/f8fafc?text=Book`} alt="" className="w-12 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="font-medium text-surface-800 text-sm">{item.book?.title || "Book"}</p>
                          <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm">₹{(item.book?.price || 0) * (item.quantity || 1)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Orders;