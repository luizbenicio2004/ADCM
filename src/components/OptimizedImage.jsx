const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ESem imagem%3C/text%3E%3C/svg%3E";

export default function OptimizedImage({ src, alt, className, width, height, priority = false, ...props }) {
  return (
    <img
      src={src || FALLBACK}
      alt={alt || ""}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={width}
      height={height}
      onError={(e) => {
        if (e.currentTarget.src !== FALLBACK) {
          e.currentTarget.src = FALLBACK;
        }
      }}
      className={className}
      {...props}
    />
  );
}
