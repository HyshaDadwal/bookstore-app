import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import UserLayout from "../../components/layout/UserLayout";
import BookCard from "../../components/ui/BookCard";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

function Wishlist() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; }
  });

  useEffect(() => {
    API.get("/books/public")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        setBooks(all.filter((b) => wishlistIds.map(String).includes(String(b.id))));
      })
      .catch(() => toast.error("Failed to load wishlist"))
      .finally(() => setLoading(false));
  }, [wishlistIds, toast]);

  const handleAddToCart = async (bookId) => {
    const success = await addToCart(bookId);
    if (success) toast.success("Added to cart!");
    else toast.error("Failed to add to cart");
  };

  const toggleWishlist = (bookId) => {
    setWishlistIds((prev) => {
      const updated = prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      if (!updated.includes(bookId)) toast.info("Removed from wishlist");
      return updated;
    });
  };

  if (loading) return <UserLayout><Loader text="Loading wishlist..." /></UserLayout>;

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-surface-900 mb-8">My Wishlist</h1>

        {books.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            subtitle="Save books you love by tapping the heart icon."
            actionLabel="Explore Books"
            onAction={() => navigate("/")}
            icon={
              <svg className="w-16 h-16 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} onToggleWishlist={toggleWishlist} isWishlisted={true} />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Wishlist;
