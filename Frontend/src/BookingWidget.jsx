import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

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
      setError("Please log in to book this property.");
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

  const total = numberOfNights > 0 ? numberOfNights * place.price : 0;

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        ₹ {place.price} <span className="text-base text-gray-500">/ night</span>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-xl mt-4" role="alert">
          {error}
        </div>
      )}

      <div className="border rounded-2xl mt-4 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="py-3 px-4">
            <label className="text-sm font-medium">Check in</label>
            <input type="date" value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(ev) => setCheckIn(ev.target.value)} />
          </div>
          <div className="py-3 px-4 border-t sm:border-t-0 sm:border-l">
            <label className="text-sm font-medium">Check out</label>
            <input type="date" value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(ev) => setCheckOut(ev.target.value)} />
          </div>
        </div>

        <div className="py-3 px-4 border-t">
          <label className="text-sm font-medium">Number of guests</label>
          <input type="number" value={numberOfGuests} min="1" max={place.maxGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)} />
        </div>

        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label className="text-sm font-medium">Guest name</label>
            <input type="text" value={name}
              onChange={(ev) => setName(ev.target.value)} />
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="flex justify-between font-semibold mt-4 px-1">
          <span>Total ({numberOfNights} night{numberOfNights !== 1 ? "s" : ""})</span>
          <span>₹ {total}</span>
        </div>
      )}

      <button type="button" onClick={bookThisPlace} disabled={loading}
        className="primary mt-4 disabled:opacity-50">
        {loading ? "Booking..." : user ? "Book this place" : "Log in to book"}
      </button>
    </div>
  );
}
