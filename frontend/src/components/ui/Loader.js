function Loader({ size = "md", fullPage = false, text = "Loading..." }) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-surface-200 border-t-brand-500 animate-spin`}
        style={{ borderStyle: "solid" }}
      />
      {text && <p className="text-sm text-surface-500 font-medium animate-pulse-soft">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
}

/**
 * Skeleton loader for content placeholders
 */
export function Skeleton({ className = "", count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  );
}

/**
 * Book card skeleton for loading states
 */
export function BookCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="skeleton h-56 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default Loader;
