const UPLOADS_BASE_URL =
  import.meta.env.VITE_UPLOADS_URL || "http://localhost:8000";

export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : UPLOADS_BASE_URL + src;
  return <img {...rest} src={src} alt={""} />;
}
