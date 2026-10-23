const UPLOADS_BASE_URL = (
  import.meta.env.VITE_UPLOADS_URL || "http://localhost:8000"
).replace(/\/$/, "");

export default function Image({ src, className = "", alt = "", ...rest }) {
  if (!src) return null;

  let finalSrc = src;
  if (/^(https?:|\/\/|data:)/i.test(src)) {
    finalSrc = src;
  } else if (src.startsWith("/")) {
    finalSrc = `${UPLOADS_BASE_URL}${src}`;
  } else {
    finalSrc = `${UPLOADS_BASE_URL}/uploads/${src}`;
  }

  return (
    <img
      {...rest}
      className={className}
      src={finalSrc}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src =
          "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Cpath d='M160 120a20 20 0 1 0 0-40 20 20 0 0 0 0 40zm-40 80l40-50 30 35 45-60 65 75H120z' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='80%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3EImage not available%3C/text%3E%3C/svg%3E";
      }}
    />
  );
}
