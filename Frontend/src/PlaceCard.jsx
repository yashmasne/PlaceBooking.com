import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from "./Image.jsx";
import { WishlistContext } from "./WishlistContext";
import { UserContext } from "./UserContext";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

export default function PlaceCard({ place }) {
  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const wishlisted = isWishlisted(place._id);
  const photo = place.photos?.[0] || null;

  async function handleHeartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    await toggleWishlist(place._id);
  }

  return (
    <div className="group relative flex flex-col">
      <Link to={`/place/${place._id}`} className="block">
        <div className="relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-gray-100 mb-3 shadow-sm group-hover:shadow-md transition-shadow">
          {photo ? (
            <Image
              src={photo}
              alt={place.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-12 h-12 mb-2 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="text-xs font-medium">PlaceBooking Stay</span>
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 active:scale-95 transition-transform z-10"
          >
            {wishlisted ? (
              <FaHeart className="text-primary text-2xl drop-shadow-md animate-pulse" />
            ) : (
              <FaRegHeart className="text-white text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-white/90" />
            )}
          </button>

          {/* Category Pill */}
          {place.category && (
            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {place.category}
            </span>
          )}
        </div>

        {/* Content details */}
        <div className="flex justify-between items-start text-sm">
          <h2 className="font-semibold text-gray-900 truncate pr-2">
            {place.address}
          </h2>
          <div className="flex items-center gap-1 shrink-0 font-medium text-gray-900">
            <FaStar className="text-amber-500 text-xs" />
            <span>{place.rating ? Number(place.rating).toFixed(2) : "4.90"}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm truncate mt-0.5">
          {place.title}
        </p>

        <p className="text-gray-400 text-xs mt-0.5">
          {place.maxGuests} {place.maxGuests === 1 ? "guest" : "guests"} · {place.bedrooms || 1} {place.bedrooms === 1 ? "bedroom" : "bedrooms"}
        </p>

        <div className="mt-2 text-sm text-gray-900">
          <span className="font-bold text-base">₹{place.price?.toLocaleString()}</span>{" "}
          <span className="text-gray-500 font-normal">night</span>
        </div>
      </Link>
    </div>
  );
}
