import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { WishlistContext } from "../WishlistContext";
import PlaceCard from "../PlaceCard";

export default function WishlistPage() {
  const { user, ready } = useContext(UserContext);
  const { wishlistIds } = useContext(WishlistContext);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .get("/wishlist")
      .then(({ data }) => {
        setPlaces(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Unable to load wishlist:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, wishlistIds]);

  if (!ready) {
    return <div className="text-center py-16 text-gray-500">Loading...</div>;
  }

  if (ready && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto">
      <div className="flex items-baseline justify-between mb-8 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlists</h1>
          <p className="text-sm text-gray-500 mt-1">
            {places.length} {places.length === 1 ? "saved stay" : "saved stays"}
          </p>
        </div>
        <Link
          to="/"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Explore more stays →
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading your favorites...</div>
      ) : places.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-primary flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">No saved places yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mt-2 mb-6 text-sm">
            As you search, tap the heart icon on any accommodation card to save your favorite stays here.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg hover:bg-opacity-95 transition-all text-sm"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {places.map((place) => (
            <PlaceCard key={place._id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
