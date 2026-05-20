import { useState, useEffect, useRef } from "react";

function SearchBar({ onSearch, onCategoryChange, categories = [], placeholder = "Search books..." }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onSearch(query.trim());
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full" id="search-bar">
      {/* Search Input */}
      <div
        className={`flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border bg-white transition-all duration-300 ${
          isFocused
            ? "border-brand-400 ring-2 ring-brand-100 shadow-md"
            : "border-surface-200 shadow-sm"
        }`}
      >
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-colors ${
            isFocused ? "text-brand-500" : "text-surface-400"
          }`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-surface-800 placeholder-surface-400"
          id="search-input"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-surface-400 hover:text-surface-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <select
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-3 rounded-xl border border-surface-200 bg-white text-surface-700
                     focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
                     shadow-sm cursor-pointer min-w-[160px]"
          id="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default SearchBar;
