import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import { FaStar, FaShieldAlt } from "react-icons/fa";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setName(user.name || "");
  }, [user]);

  const numberOfNights =
    checkIn && checkOut
      ? differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
      : 0;

  async function bookThisPlace() {
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }
    if (!checkIn || !checkOut || numberOfNights <= 0) {
      setError("Please select valid check-in and check-out dates.");
      return;
    }
    if (Number(numberOfGuests) < 1 || Number(numberOfGuests) > place.maxGuests) {
      setError(`Guests must be between 1 and ${place.maxGuests}.`);
      return;
    }
    if (!name.trim()) {
      setError("Please enter the guest name.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/bookings", {
        checkIn,
        checkOut,
        numberOfGuests: Number(numberOfGuests),
        name: name.trim(),
        place: place._id,
      });
      setRedirect(`/account/bookings/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to create booking.");
    } finally {
      setLoading(false);
    }
  }

  if (redirect) return <Navigate to={redirect} />;

  const subtotal = numberOfNights > 0 ? numberOfNights * place.price : 0;

  return (
    <div className="bg-white shadow-xl border border-gray-200/80 p-6 rounded-3xl sticky top-24">
      {/* Price Header */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-gray-900">
            ₹{place.price?.toLocaleString()}
          </span>
          <span className="text-gray-500 font-normal text-sm"> / night</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
          <FaStar className="text-amber-500 text-xs" />
          <span>{place.rating ? Number(place.rating).toFixed(2) : "4.90"}</span>
          <span className="text-gray-400 font-normal">({place.reviewsCount || 12})</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Date & Guest Picker Box */}
      <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-inner bg-white">
        <div className="grid grid-cols-2 divide-x divide-gray-300">
          <div className="py-2.5 px-3.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700">Check-in</label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(ev) => setCheckIn(ev.target.value)}
              className="w-full text-xs font-medium text-gray-800 bg-transparent focus:outline-none cursor-pointer mt-0.5"
            />
          </div>
          <div className="py-2.5 px-3.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700">Checkout</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(ev) => setCheckOut(ev.target.value)}
              className="w-full text-xs font-medium text-gray-800 bg-transparent focus:outline-none cursor-pointer mt-0.5"
            />
          </div>
        </div>

        <div className="border-t border-gray-300 py-2.5 px-3.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700">Guests</label>
          <select
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
            className="w-full text-xs font-medium text-gray-800 bg-transparent focus:outline-none cursor-pointer mt-0.5"
          >
            {Array.from({ length: place.maxGuests || 4 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "guest" : "guests"} (max {place.maxGuests})
              </option>
            ))}
          </select>
        </div>

        {numberOfNights > 0 && (
          <div className="border-t border-gray-300 py-2.5 px-3.5 bg-gray-50/50">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700">Guest name</label>
            <input
              type="text"
              value={name}
              placeholder="Full name for reservation"
              onChange={(ev) => setName(ev.target.value)}
              className="w-full text-xs font-medium text-gray-800 bg-transparent focus:outline-none mt-0.5"
            />
          </div>
        )}
      </div>

      {/* Reserve Button */}
      <button
        type="button"
        onClick={bookThisPlace}
        disabled={loading}
        className="w-full mt-4 bg-gradient-to-r from-primary to-rose-500 hover:from-primary/95 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 text-base"
      >
        {loading ? "Checking availability..." : user ? "Reserve Stay" : "Log in to reserve"}
      </button>

      <p className="text-center text-xs text-gray-400 mt-2">
        You won't be charged yet
      </p>

      {/* Pricing Breakdown */}
      {numberOfNights > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span className="underline">
              ₹{place.price?.toLocaleString()} × {numberOfNights} {numberOfNights === 1 ? "night" : "nights"}
            </span>
            <span className="font-medium text-gray-800">₹{subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Goods & Services Tax (12% GST)</span>
            <span className="font-medium text-gray-800">₹{Math.round(subtotal * 0.12)?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">PlaceBooking service fee (5%)</span>
            <span className="font-medium text-gray-800">₹{Math.round(subtotal * 0.05)?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-sm pt-2.5 border-t border-gray-200">
            <span>Total Payable Amount</span>
            <span className="text-primary font-bold">
              ₹{(subtotal + Math.round(subtotal * 0.12) + Math.round(subtotal * 0.05))?.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Assurance Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
        <FaShieldAlt className="text-primary text-base shrink-0" />
        <span>PlaceBooking Guarantee · Verified listing & support</span>
      </div>
    </div>
  );
}
