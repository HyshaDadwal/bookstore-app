import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import UserLayout from "../../components/layout/UserLayout";
import BookCard from "../../components/ui/BookCard";
import SearchBar from "../../components/ui/SearchBar";
import { BookCardSkeleton } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

function Home() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; }
  });

  const { addToCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    API.get("/books/public")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setBooks(data);
        setFiltered(data);
        const cats = [...new Set(data.map((b) => b.category).filter(Boolean))];
        setCategories(cats);
      })
      .catch(() => toast.error("Failed to load books"))
      .finally(() => setLoading(false));
  }, [toast]);

  // Filter books
  useEffect(() => {
    let result = books;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) =>
        b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter((b) => b.category === selectedCategory);
    }
    setFiltered(result);
  }, [searchQuery, selectedCategory, books]);

  const handleSearch = useCallback((q) => setSearchQuery(q), []);
  const handleCategory = useCallback((c) => setSelectedCategory(c), []);

  const handleAddToCart = async (bookId) => {
    const success = await addToCart(bookId);
    if (success) toast.success("Added to cart!");
    else toast.error("Failed to add to cart");
  };

  const toggleWishlist = (bookId) => {
    setWishlist((prev) => {
      const updated = prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      if (updated.includes(bookId)) toast.success("Added to wishlist");
      else toast.info("Removed from wishlist");
      return updated;
    });
  };

  return (
    <UserLayout>
      {/* Hero Section */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="badge-brand text-sm mb-4 inline-block">✨ New Arrivals Every Week</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Discover Your Next <span className="text-gradient">Great Read</span>
            </h1>
            <p className="text-surface-300 text-lg mb-8 max-w-lg">
              Explore our curated collection of books across every genre. From bestsellers to hidden gems.
            </p>
            <div className="flex gap-3">
              <a href="#books-section" className="btn-primary px-6 py-3 text-base">Explore Books</a>
              <a href="#books-section" className="btn bg-white/10 text-white hover:bg-white/20 px-6 py-3 text-base backdrop-blur-sm">Browse Categories</a>
            </div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="books-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">All Books</h2>
            <p className="text-surface-500 text-sm mt-1">{filtered.length} books available</p>
          </div>
          <div className="w-full md:w-auto md:min-w-[400px]">
            <SearchBar onSearch={handleSearch} onCategoryChange={handleCategory} categories={categories} />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No books found"
            subtitle={searchQuery ? `No results for "${searchQuery}"` : "Check back later for new additions."}
            actionLabel={searchQuery ? "Clear Search" : ""}
            onAction={searchQuery ? () => setSearchQuery("") : null}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger">
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={handleAddToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.includes(book.id)}
              />
            ))}
          </div>
        )}
      </section>
    </UserLayout>
  );
}

export default Home;