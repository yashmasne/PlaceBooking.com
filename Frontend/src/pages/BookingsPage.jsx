import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";
import { CiMoneyCheck1 } from "react-icons/ci";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/bookings")
      .then((response) => {
        setBookings(response.data || []);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <AccountNav />
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading your bookings...</div>
      ) : bookings?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700">No bookings found</h2>
          <p className="text-gray-500 mt-1 mb-4">You have not booked any stays yet.</p>
          <Link to="/" className="inline-block bg-primary text-white py-2 px-6 rounded-full font-medium hover:bg-opacity-90">
            Explore places
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => {
            const isPaid = booking.paymentStatus === "paid";
            return (
              <Link
                key={booking._id}
                to={`/account/bookings/${booking._id}`}
                className="flex flex-col sm:flex-row gap-4 bg-gray-100 hover:bg-gray-200/80 transition-colors rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
              >
                <div className="sm:w-56 h-48 sm:h-auto bg-gray-200 shrink-0">
                  <PlaceImg place={booking.place} className="object-cover w-full h-full" />
                </div>
                <div className="py-4 px-4 grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {booking.place?.title || "Booked Accommodation"}
                      </h2>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                          isPaid
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isPaid ? "Paid ✓" : "Payment Pending"}
                      </span>
                    </div>
                    {booking.place?.address && (
                      <p className="text-sm text-gray-500 mt-1">{booking.place.address}</p>
                    )}
                    <BookingDates booking={booking} className="my-3 text-gray-600" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                    <div className="flex gap-2 items-center text-lg font-bold text-gray-900">
                      <CiMoneyCheck1 className="text-2xl text-primary" />
                      Total price: ₹{booking.price}
                    </div>
                    <span className="text-sm text-primary font-medium">
                      {isPaid ? "View details →" : "Pay now →"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
