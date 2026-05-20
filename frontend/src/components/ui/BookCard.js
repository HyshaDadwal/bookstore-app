import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

function BookCard({ book, onAddToCart, onToggleWishlist, isWishlisted = false }) {
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (addingToCart) return;
    setAddingToCart(true);
    try {
      await onAddToCart(book.id);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist(book.id);
  };

  const handleClick = () => {
    navigate(`/book/${book.id}`);
  };

  // Generate a pseudo-random rating from the book id for demo purposes
  const rating = book.rating || ((book.id * 7 + 3) % 20) / 4 + 3;

  return (
    <div
      onClick={handleClick}
      className="card-hover group cursor-pointer overflow-hidden"
      id={`book-card-${book.id}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-surface-100 aspect-[3/4]">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton rounded-none" />
        )}

        <img
          src={book.imageUrl || `https://placehold.co/300x400/1e293b/f8fafc?text=${encodeURIComponent(book.title?.slice(0, 10) || "Book")}`}
          alt={book.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = `https://placehold.co/300x400/1e293b/f8fafc?text=${encodeURIComponent(book.title?.slice(0, 10) || "Book")}`;
            setImageLoaded(true);
          }}
        />

        {/* Category Badge */}
        {book.category && (
          <span className="absolute top-3 left-3 badge-brand backdrop-blur-sm">
            {book.category}
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200
            ${isWishlisted
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/80 text-surface-500 hover:bg-red-50 hover:text-red-500"
            }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="font-bold text-surface-900 text-lg leading-tight mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {book.title}
        </h3>

        <p className="text-surface-500 text-sm mb-2 line-clamp-1">
          {book.author || "Unknown Author"}
        </p>

        <StarRating rating={rating} size="sm" />

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-surface-900">
            ₹{book.price}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="btn-primary text-xs px-4 py-2"
          >
            {addingToCart ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
