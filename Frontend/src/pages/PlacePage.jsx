import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import { WishlistContext } from "../WishlistContext";
import { UserContext } from "../UserContext";
import { useToast } from "../ToastContext";
import PlaceReviews from "../PlaceReviews";
import PlaceMap from "../PlaceMap";
import { recordRecentlyViewed } from "../RecentlyViewed";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaWifi,
  FaParking,
  FaTv,
  FaDog,
  FaDoorOpen,
  FaBroadcastTower,
  FaRegClock,
  FaCheckCircle,
  FaShareAlt,
} from "react-icons/fa";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`/places/${id}`)
      .then((response) => {
        setPlace(response.data);
        recordRecentlyViewed(response.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Property not found.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const wishlisted = place ? isWishlisted(place._id) : false;

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Couldn't copy the link. You can copy it from the address bar.");
    }
  }

  function handleSave() {
    if (!user) {
      toast.info("Log in to save stays to your wishlist.");
      navigate("/login");
      return;
    }
    toggleWishlist(place._id);
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-400">
        <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Property Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">
          The property you are looking for may have been removed or is currently unavailable.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white font-semibold py-2.5 px-6 rounded-full text-sm"
        >
          ← Back to Homepage
        </Link>
      </div>
    );
  }

  const perksMap = {
    wifi: { label: "High-speed Wi-Fi", icon: FaWifi },
    parking: { label: "Free parking on premises", icon: FaParking },
    tv: { label: "HD Smart TV", icon: FaTv },
    pets: { label: "Pets allowed", icon: FaDog },
    entrance: { label: "Private entrance", icon: FaDoorOpen },
    radio: { label: "Audio system", icon: FaBroadcastTower },
  };

  return (
    <div className="mt-4 max-w-6xl mx-auto pb-16">
      {/* Property Title & Header Bar */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {place.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-gray-900">
              <FaStar className="text-amber-500 text-xs" />
              {place.rating ? Number(place.rating).toFixed(2) : "4.90"}
            </span>
            <span>·</span>
            <a href="#reviews" className="underline font-medium hover:text-gray-900">
              {place.reviewsCount || 12} reviews
            </a>
            <span>·</span>
            <AddressLink className="text-gray-700 underline font-medium">
              {place.address}
            </AddressLink>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 py-1.5 px-3 rounded-lg transition-colors"
            >
              <FaShareAlt />
              {copied ? "Link Copied!" : "Share"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 py-1.5 px-3 rounded-lg transition-colors"
            >
              {wishlisted ? (
                <>
                  <FaHeart className="text-primary" /> Saved
                </>
              ) : (
                <>
                  <FaRegHeart /> Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="my-4">
        <PlaceGallery place={place} />
      </div>

      {/* Main 2-Column Layout */}
      <div className="mt-10 grid gap-12 grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] items-start">
        {/* Left Column: Property Details */}
        <div className="space-y-8">
          {/* Host & Capacity Overview */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Entire {place.category?.toLowerCase() || "residence"} hosted by PlaceBooking Host
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {place.maxGuests} {place.maxGuests === 1 ? "guest" : "guests"} ·{" "}
                {place.bedrooms || 1} {place.bedrooms === 1 ? "bedroom" : "bedrooms"} ·{" "}
                {place.beds || 1} {place.beds === 1 ? "bed" : "beds"} ·{" "}
                {place.bathrooms || 1} {place.bathrooms === 1 ? "bath" : "baths"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-rose-400 text-white font-bold flex items-center justify-center text-lg shadow">
              PB
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4 pb-6 border-b border-gray-200 text-sm">
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-xl text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Self check-in</h3>
                <p className="text-gray-500">Check yourself in with the digital door lock or lockbox.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaRegClock className="text-xl text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Flexible Check-in</h3>
                <p className="text-gray-500">
                  Standard check-in from {place.checkIn}:00 onwards, check-out by {place.checkOut}:00.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="font-bold text-xl text-gray-900 mb-3">About this place</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {place.description || "A clean, comfortable, and well-appointed place for your travel stay."}
            </p>
          </div>

          {/* What this place offers (Amenities / Perks) */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="font-bold text-xl text-gray-900 mb-4">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {place.perks?.length > 0 ? (
                place.perks.map((perk) => {
                  const item = perksMap[perk] || { label: perk, icon: FaCheckCircle };
                  const Icon = item.icon;
                  return (
                    <div key={perk} className="flex items-center gap-3 text-gray-700 text-sm py-1">
                      <Icon className="text-lg text-gray-600 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">Essential amenities included.</p>
              )}
            </div>
          </div>

          {/* Extra Info & House Rules */}
          {place.extraInfo && (
            <div className="pb-6 border-b border-gray-200">
              <h2 className="font-bold text-xl text-gray-900 mb-3">Things to know & house rules</h2>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-sm text-gray-700 leading-relaxed">
                {place.extraInfo}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="relative">
          <BookingWidget place={place} />
        </div>
      </div>

      <PlaceReviews
        place={place}
        onSummaryChange={(summary) => setPlace((prev) => ({ ...prev, ...summary }))}
      />
      <PlaceMap address={place.address} />
    </div>
  );
}
