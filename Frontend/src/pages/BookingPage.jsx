import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    axios.get("/bookings").then(({ data }) => {
      const found = data.find((item) => item._id === id);
      if (found) setBooking(found);
    }).catch(() => setError("Unable to load this booking."));
  }, [id]);

  async function handlePayment() {
    if (!booking || paying) return;
    setError("");
    setPaying(true);
    try {
      const { data } = await axios.post("/placesBooking", { amount: booking.price });

      if (data.mode === "demo") {
        await axios.post("/verify", { response: { demo: true, razorpay_order_id: data.order.id } });
        navigate("/account/bookings");
        return;
      }

      if (!window.Razorpay) {
        setError("Razorpay checkout is not loaded. Configure the real payment integration or use demo mode.");
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
            await axios.post("/verify", { response });
            navigate("/account/bookings");
          } catch (err) {
            setError(err.response?.data?.error || "Payment verification failed.");
          }
        },
        theme: { color: "#000000" },
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to start payment.");
    } finally {
      setPaying(false);
    }
  }

  if (!booking) return <div className="text-center py-12">{error || "Loading booking..."}</div>;

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place?.title || "Your booking"}</h1>
      {booking.place?.address && <AddressLink className="my-2 block">{booking.place.address}</AddressLink>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{error}</div>}
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full"><h2 className="text-2xl mb-4">Your booking information:</h2><BookingDates booking={booking} /></div>
        <button type="button" onClick={handlePayment} disabled={paying} className="primary w-full sm:w-48 disabled:opacity-50">
          {paying ? "Processing..." : `Pay ₹${booking.price}`}
        </button>
      </div>
      {booking.place && <PlaceGallery place={booking.place} />}
    </div>
  );
}
