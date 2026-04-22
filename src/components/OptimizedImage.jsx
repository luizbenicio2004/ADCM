const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ESem imagem%3C/text%3E%3C/svg%3E";

function buildSrcSet(src, widths) {
  if (!src || src.startsWith("data:")) return undefined;
  return widths
    .map((w) => {
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}w=${w} ${w}w`;
    })
    .join(", ");
}

/**
 * OptimizedImage — <img> com lazy loading, srcset responsivo e fallback.
 *
 * Props extras:
 *   priority        bool      carrega eager (acima do fold)
 *   sizes           string    atributo sizes do HTML
 *   responsiveSizes number[]  larguras para srcset (padrão: [400,800,1200])
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes,
  responsiveSizes = [400, 800, 1200],
  ...props
}) {
  const effectiveSrc = src || FALLBACK;
  const srcSet = src ? buildSrcSet(src, responsiveSizes) : undefined;
  const effectiveSizes =
    sizes || (srcSet ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw" : undefined);

  return (
    <img
      src={effectiveSrc}
      srcSet={srcSet}
      sizes={effectiveSizes}
      alt={alt || ""}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={width}
      height={height}
      onError={(e) => {
        if (e.currentTarget.src !== FALLBACK) {
          e.currentTarget.src = FALLBACK;
          e.currentTarget.srcset = "";
        }
      }}
      className={className}
      {...props}
    />
  );
}
