import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import Loader from "../../components/ui/Loader";

function AdminDashboard() {
  const [stats, setStats] = useState({ books: 0, orders: 0, users: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/books/public").catch(() => ({ data: [] })),
      API.get("/orders").catch(() => ({ data: [] })),
      API.get("/admin/users").catch(() => ({ data: [] })),
    ]).then(([booksRes, ordersRes, usersRes]) => {
      const books = Array.isArray(booksRes.data) ? booksRes.data : [];
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      setStats({ books: books.length, orders: orders.length, users: users.length });
      setRecentBooks(books.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Books", value: stats.books, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "from-blue-500 to-blue-600" },
    { label: "Orders", value: stats.orders, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "from-emerald-500 to-emerald-600" },
    { label: "Users", value: stats.users, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "from-purple-500 to-purple-600" },
  ];

  if (loading) return <AdminLayout title="Dashboard"><Loader /></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      <div className="animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((s) => (
            <div key={s.label} className="card p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm text-surface-500">{s.label}</p>
                <p className="text-3xl font-bold text-surface-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Books */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-surface-900 mb-4">Recent Books</h2>
          {recentBooks.length === 0 ? (
            <p className="text-surface-500 text-sm">No books yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-100">
                    <th className="text-left py-3 px-4 text-surface-500 font-medium">Cover</th>
                    <th className="text-left py-3 px-4 text-surface-500 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-surface-500 font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-surface-500 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBooks.map((book) => (
                    <tr key={book.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                      <td className="py-3 px-4">
                        <img src={book.imageUrl || `https://placehold.co/40x50/1e293b/f8fafc?text=B`} alt="" className="w-10 h-14 object-cover rounded-lg" />
                      </td>
                      <td className="py-3 px-4 font-medium text-surface-900">{book.title}</td>
                      <td className="py-3 px-4 text-surface-600">₹{book.price}</td>
                      <td className="py-3 px-4"><span className="badge-brand">{book.category || "—"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;