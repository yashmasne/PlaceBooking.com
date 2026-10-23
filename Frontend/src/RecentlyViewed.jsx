import { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Image from "./Image.jsx";

const STORAGE_KEY = "placebooking.recentlyViewed";
const MAX_ITEMS = 8;

// localStorage can be unavailable (private mode, blocked site data), so every access is guarded.
function readRecent() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeRecent(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or blocked: recently viewed is a convenience, so fail silently.
  }
}

export function recordRecentlyViewed(place) {
  if (!place?._id) return;
  const snapshot = {
    _id: place._id,
    title: place.title,
    address: place.address,
    photo: place.photos?.[0] || null,
    price: place.price,
    rating: place.rating,
  };
  writeRecent([snapshot, ...readRecent().filter((item) => item._id !== place._id)].slice(0, MAX_ITEMS));
}

export default function RecentlyViewed() {
  const [items, setItems] = useState(readRecent);

  if (items.length === 0) return null;

  function clearAll() {
    writeRecent([]);
    setItems([]);
  }

  return (
    <section className="pt-6 pb-2 border-b border-gray-100" aria-labelledby="recently-viewed-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="recently-viewed-heading" className="text-lg font-bold text-gray-900">
          Recently viewed
        </h2>
        <button
          type="button"
          onClick={clearAll}
          className="bg-transparent text-xs font-semibold text-gray-500 underline hover:text-gray-900"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
        {items.map((item) => (
          <Link
            key={item._id}
            to={`/place/${item._id}`}
            className="group w-44 shrink-0"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-2 shadow-sm group-hover:shadow-md transition-shadow">
              {item.photo && (
                <Image
                  src={item.photo}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
              <span>
                <span className="font-semibold text-gray-900">₹{Number(item.price || 0).toLocaleString("en-IN")}</span> night
              </span>
              {item.rating > 0 && (
                <span className="flex items-center gap-1 text-gray-700">
                  <FaStar className="text-amber-500" />
                  {Number(item.rating).toFixed(2)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
