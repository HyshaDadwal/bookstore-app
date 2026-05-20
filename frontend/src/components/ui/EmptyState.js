function EmptyState({
  icon,
  title = "Nothing here yet",
  subtitle = "",
  actionLabel = "",
  onAction = null,
}) {
  const defaultIcon = (
    <svg className="w-16 h-16 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 animate-fade-in">
      <div className="mb-6">
        {icon || defaultIcon}
      </div>

      <h3 className="text-xl font-semibold text-surface-700 mb-2">
        {title}
      </h3>

      {subtitle && (
        <p className="text-surface-500 text-center max-w-md mb-6">
          {subtitle}
        </p>
      )}

      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
