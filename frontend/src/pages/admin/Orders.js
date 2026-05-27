import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import Loader from "../../components/ui/Loader";
import { useToast } from "../../context/ToastContext";

function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [toast]);

  const statusColors = {
    PLACED: "badge bg-indigo-100 text-indigo-700",
    PENDING: "badge bg-amber-100 text-amber-700",
    SHIPPED: "badge bg-blue-100 text-blue-700",
    DELIVERED: "badge bg-emerald-100 text-emerald-700",
    CANCELLED: "badge bg-red-100 text-red-700",
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status?status=${status}`);
      toast.success(`Order #${orderId} → ${status}`);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <AdminLayout title="Orders"><Loader /></AdminLayout>;

  return (
    <AdminLayout title="Orders">
      <div className="animate-fade-in">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-surface-900">#{order.id}</td>
                    <td className="py-3 px-4 text-surface-600">{order.user?.email || order.user?.name || `User #${order.user?.id || "?"}`}</td>
                    <td className="py-3 px-4 font-semibold text-surface-900">₹{order.totalAmount || 0}</td>
                    <td className="py-3 px-4 text-surface-500 text-xs">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "—"}</td>
                    <td className="py-3 px-4"><span className={statusColors[order.status] || "badge-gray"}>{order.status || "PENDING"}</span></td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status || "PENDING"}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
                      >
                        <option value="PLACED">Placed</option>
                        <option value="PENDING">Pending</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <p className="text-center text-surface-500 py-8">No orders yet.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
