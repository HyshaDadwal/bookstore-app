import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import Loader from "../../components/ui/Loader";
import { useToast } from "../../context/ToastContext";

function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <AdminLayout title="Users"><Loader /></AdminLayout>;

  return (
    <AdminLayout title="Users">
      <div className="animate-fade-in">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-surface-900">{u.id}</td>
                    <td className="py-3 px-4 text-surface-800">{u.name || "—"}</td>
                    <td className="py-3 px-4 text-surface-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-surface-100 text-surface-600"}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && <p className="text-center text-surface-500 py-8">No users found.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
