import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import { useToast } from "../../context/ToastContext";

function AdminBooks() {
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: "", author: "", price: "", stock: "", category: "", imageUrl: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchBooks = async () => {
    try {
      const res = await API.get("/books/public");
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error("Failed to load books"); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchBooks(); }, []);

  const openAdd = () => {
    setEditBook(null);
    setForm({ title: "", author: "", price: "", stock: "", category: "", imageUrl: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditBook(book);
    setForm({ title: book.title || "", author: book.author || "", price: book.price || "", stock: book.stock || "", category: book.category || "", imageUrl: book.imageUrl || "", description: book.description || "" });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) { toast.warning("Title and price are required"); return; }
    setSaving(true);
    try {
      if (editBook) {
        await API.put(`/books/${editBook.id}`, { ...form, price: Number(form.price), stock: Number(form.stock) });
        toast.success("Book updated!");
      } else {
        await API.post("/books", { ...form, price: Number(form.price), stock: Number(form.stock) });
        toast.success("Book added!");
      }
      setShowModal(false);
      fetchBooks();
    } catch { toast.error("Failed to save book"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try { await API.delete(`/books/${id}`); toast.success("Book deleted"); fetchBooks(); }
    catch { toast.error("Delete failed"); }
  };

  const filtered = books.filter((b) => b.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLayout title="Books"><Loader /></AdminLayout>;

  return (
    <AdminLayout title="Books">
      <div className="animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <input type="text" placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} className="input max-w-xs" />
          <button onClick={openAdd} className="btn-primary">+ Add Book</button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Cover</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Author</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-surface-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr key={book.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4"><img src={book.imageUrl || `https://placehold.co/40x50/1e293b/f8fafc?text=B`} alt="" className="w-10 h-14 object-cover rounded-lg" /></td>
                    <td className="py-3 px-4 font-medium text-surface-900">{book.title}</td>
                    <td className="py-3 px-4 text-surface-600">{book.author}</td>
                    <td className="py-3 px-4 text-surface-600">₹{book.price}</td>
                    <td className="py-3 px-4"><span className="badge-brand">{book.category || "—"}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(book)} className="btn-ghost text-xs px-3 py-1.5">Edit</button>
                        <button onClick={() => handleDelete(book.id)} className="btn-danger text-xs px-3 py-1.5">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-surface-500 py-8">No books found.</p>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editBook ? "Edit Book" : "Add Book"} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Author</label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Price *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Stock *</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Image URL</label>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : editBook ? "Update" : "Add Book"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default AdminBooks;
