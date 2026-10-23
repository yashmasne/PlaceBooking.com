import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/bookings/${id}`)
      .then(({ data }) => {
        if (data) setBooking(data);
      })
      .catch(() => {
        // Fallback to getting list
        axios
          .get("/bookings")
          .then(({ data }) => {
            const found = data.find((item) => item._id === id);
            if (found) setBooking(found);
            else setError("Booking not found.");
          })
          .catch(() => setError("Unable to load this booking."));
      });
  }, [id]);

  async function handlePayment() {
    if (!booking || paying || booking.paymentStatus === "paid") return;
    setError("");
    setSuccessMsg("");
    setPaying(true);
    try {
      const { data } = await axios.post("/placesBooking", {
        amount: booking.price,
        bookingId: booking._id,
      });

      if (data.mode === "demo") {
        await axios.post("/verify", {
          bookingId: booking._id,
          response: { demo: true, razorpay_order_id: data.order.id },
        });
        setBooking((prev) => ({ ...prev, paymentStatus: "paid" }));
        setSuccessMsg("Payment completed successfully!");
        return;
      }

      if (!window.Razorpay) {
        setError("Razorpay checkout is not loaded. Configure real credentials or use demo mode.");
        return;
      }

      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "PlaceBooking.com",
        description: "PlaceBooking stay reservation",
        handler: async (response) => {
          try {
            await axios.post("/verify", { bookingId: booking._id, response });
            setBooking((prev) => ({ ...prev, paymentStatus: "paid" }));
            setSuccessMsg("Payment verified and completed!");
          } catch (err) {
            setError(err.response?.data?.error || "Payment verification failed.");
          }
        },
        theme: { color: "#F5385D" },
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to start payment.");
    } finally {
      setPaying(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    setError("");
    try {
      await axios.delete(`/bookings/${booking._id}`);
      navigate("/account/bookings");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to cancel booking.");
      setCancelling(false);
    }
  }

  if (!booking) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">{error || "Loading booking details..."}</p>
        <Link to="/account/bookings" className="inline-block mt-4 text-primary underline">
          ← Back to My Bookings
        </Link>
      </div>
    );
  }

  const isPaid = booking.paymentStatus === "paid";

  return (
    <div className="my-8 max-w-5xl mx-auto">
      <Link to="/account/bookings" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4">
        ← Back to My Bookings
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{booking.place?.title || "Your booking"}</h1>
          {booking.place?.address && <AddressLink className="my-2 block">{booking.place.address}</AddressLink>}
        </div>
        <span
          className={`self-start sm:self-auto text-sm px-4 py-1.5 rounded-full font-semibold border ${
            isPaid
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-amber-100 text-amber-800 border-amber-300"
          }`}
        >
          {isPaid ? "Payment Confirmed ✓" : "Payment Pending"}
        </span>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl my-4 border border-red-200">{error}</div>}
      {successMsg && <div className="bg-green-100 text-green-700 p-3 rounded-xl my-4 border border-green-200">{successMsg}</div>}

      <div className="bg-gray-100 p-6 my-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-gray-200">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your reservation details</h2>
          <BookingDates booking={booking} />
          <div className="mt-4 pt-4 border-t border-gray-300/60 text-sm text-gray-700 space-y-1">
            <p><span className="font-medium text-gray-900">Guest name:</span> {booking.name}</p>
            <p><span className="font-medium text-gray-900">Number of guests:</span> {booking.numberOfGuests}</p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              Total price: ₹{booking.price}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0 flex flex-col gap-3">
          {!isPaid ? (
            <button
              type="button"
              onClick={handlePayment}
              disabled={paying}
              className="primary w-full md:w-48 py-3 disabled:opacity-50 text-base font-semibold shadow-md"
            >
              {paying ? "Processing..." : `Pay ₹${booking.price}`}
            </button>
          ) : (
            <div className="bg-green-50 border border-green-300 text-green-800 text-center py-3 px-6 rounded-2xl font-semibold">
              ✓ Booking Paid
            </div>
          )}

          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full md:w-48 py-2 text-sm text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-2xl disabled:opacity-50 font-medium transition-colors"
          >
            {cancelling ? "Cancelling..." : "Cancel booking"}
          </button>
        </div>
      </div>

      {booking.place && <PlaceGallery place={booking.place} />}
    </div>
  );
}
