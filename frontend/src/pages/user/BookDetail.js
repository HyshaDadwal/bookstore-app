import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import UserLayout from "../../components/layout/UserLayout";
import StarRating from "../../components/ui/StarRating";
import Loader from "../../components/ui/Loader";
import BookCard from "../../components/ui/BookCard";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; }
  });

  useEffect(() => {
    setLoading(true);
    API.get("/books/public")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        const found = all.find((b) => String(b.id) === String(id));
        setBook(found || null);
        if (found) {
          setRelated(all.filter((b) => b.category === found.category && b.id !== found.id).slice(0, 4));
        }
      })
      .catch(() => toast.error("Failed to load book"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const handleAddToCart = async () => {
    setAdding(true);
    const success = await addToCart(book.id, quantity);
    if (success) toast.success(`Added ${quantity} to cart!`);
    else toast.error("Failed to add to cart");
    setAdding(false);
  };

  const toggleWishlist = (bookId) => {
    setWishlist((prev) => {
      const updated = prev.includes(bookId) ? prev.filter((i) => i !== bookId) : [...prev, bookId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = book && wishlist.includes(book.id);
  const rating = book ? (book.rating || ((book.id * 7 + 3) % 20) / 4 + 3) : 0;

  if (loading) return <UserLayout><Loader text="Loading book..." /></UserLayout>;
  if (!book) return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Book Not Found</h2>
        <button onClick={() => navigate("/")} className="btn-primary">Go Home</button>
      </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 mb-6 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Book Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="bg-surface-100 rounded-2xl overflow-hidden aspect-[3/4] max-h-[600px]">
            <img src={book.imageUrl || `https://placehold.co/400x550/1e293b/f8fafc?text=${encodeURIComponent(book.title)}`} alt={book.title} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {book.category && <span className="badge-brand mb-3 self-start">{book.category}</span>}
            <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-2">{book.title}</h1>
            <p className="text-lg text-surface-500 mb-4">by {book.author || "Unknown Author"}</p>
            <div className="mb-4"><StarRating rating={rating} size="md" showValue /></div>
            <p className="text-3xl font-bold text-surface-900 mb-6">₹{book.price}</p>
            <p className="text-surface-600 leading-relaxed mb-8">
              {book.description || "A wonderful book that takes you on an unforgettable journey. Dive into the pages and discover new worlds, ideas, and perspectives that will stay with you long after the last page."}
            </p>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-surface-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-surface-600 hover:bg-surface-100 transition-colors">−</button>
                <span className="px-4 py-2.5 font-semibold text-surface-900 min-w-[48px] text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2.5 text-surface-600 hover:bg-surface-100 transition-colors">+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={adding} className="btn-primary px-8 py-3 text-base flex-1">
                {adding ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Add to Cart"}
              </button>
              <button onClick={() => toggleWishlist(book.id)} className={`btn px-4 py-3 border-2 rounded-xl transition-all ${isWishlisted ? "border-red-300 bg-red-50 text-red-500" : "border-surface-200 text-surface-500 hover:border-red-300 hover:text-red-500"}`}>
                <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-surface-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((b) => (
                <BookCard key={b.id} book={b} onAddToCart={(id) => addToCart(id)} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(b.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </UserLayout>
  );
}

export default BookDetail;
