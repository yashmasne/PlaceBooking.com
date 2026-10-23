import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import PaymentModal from "../PaymentModal";
import { useToast } from "../ToastContext";
import { useConfirm } from "../ConfirmContext";
import { FaShieldAlt, FaReceipt, FaLock } from "react-icons/fa";

export default function BookingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

  async function handleCancel() {
    const confirmed = await confirm({
      title: "Cancel this booking?",
      message: `Your reservation at ${booking.place?.title || "this stay"} will be cancelled. This can't be undone.`,
      confirmLabel: "Cancel booking",
      cancelLabel: "Keep booking",
      danger: true,
    });
    if (!confirmed) return;
    setCancelling(true);
    setError("");
    try {
      await axios.delete(`/bookings/${booking._id}`);
      toast.success("Your booking has been cancelled.");
      navigate("/account/bookings");
    } catch (err) {
      const message = err.response?.data?.error || "Unable to cancel booking.";
      setError(message);
      toast.error(message);
      setCancelling(false);
    }
  }

  function handlePaymentSuccess(paymentData) {
    setBooking((prev) => ({
      ...prev,
      paymentStatus: "paid",
      paymentId: paymentData.paymentId,
      paidAt: new Date().toISOString(),
      payment: paymentData,
    }));
    setSuccessMsg("Payment verified and completed successfully!");
    toast.success("Payment successful — your stay is confirmed!", 5000);
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
  const nights = booking.nights || 1;
  const subtotal = booking.subtotal || Math.round(booking.price / 1.17);
  const tax = booking.tax || Math.round(subtotal * 0.12);
  const serviceFee = booking.serviceFee || Math.round(subtotal * 0.05);

  return (
    <div className="my-8 max-w-5xl mx-auto">
      <Link to="/account/bookings" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4 font-medium transition-colors">
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
              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
              : "bg-amber-100 text-amber-800 border-amber-300"
          }`}
        >
          {isPaid ? "Payment Confirmed ✓" : "Payment Pending"}
        </span>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl my-4 border border-red-200 text-sm">{error}</div>}
      {successMsg && <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl my-4 border border-emerald-200 text-sm font-medium">{successMsg}</div>}

      <div className="bg-white p-6 my-6 rounded-3xl shadow-sm border border-gray-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Reservation Summary</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-mono">
              Ref: {booking._id.slice(0, 10)}
            </span>
          </div>

          <BookingDates booking={booking} />

          <div className="mt-5 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Guest Name</p>
              <p className="font-medium text-gray-900">{booking.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Guests</p>
              <p className="font-medium text-gray-900">{booking.numberOfGuests} guests</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Duration</p>
              <p className="font-medium text-gray-900">{nights} {nights === 1 ? "night" : "nights"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Price</p>
              <p className="text-lg font-bold text-primary">₹{booking.price?.toLocaleString()}</p>
            </div>
          </div>

          {/* Transparent Itemized Price Breakdown */}
          <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/70 p-3.5 rounded-2xl text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Accommodation ({nights} nights):</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Goods & Services Tax (GST 12%):</span>
              <span className="font-medium text-gray-900">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>PlaceBooking Service Fee (5%):</span>
              <span className="font-medium text-gray-900">₹{serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200/80 pt-1.5 font-bold text-xs text-gray-900">
              <span>Total Amount:</span>
              <span className="text-primary font-bold">₹{booking.price?.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment receipt confirmation info if paid */}
          {isPaid && (
            <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
              <FaReceipt className="text-emerald-600 text-lg shrink-0" />
              <div>
                <p className="font-bold">Payment Verified & Captured</p>
                <p className="text-emerald-700 font-mono text-[11px]">
                  Transaction ID: {booking.paymentId || booking.payment?.paymentId || "Captured via Razorpay Gateway"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-3">
          {!isPaid ? (
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-gradient-to-r from-primary to-rose-600 hover:from-primary/95 hover:to-rose-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <FaLock className="text-xs" />
              Pay ₹{booking.price?.toLocaleString()}
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-center py-3.5 px-6 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-2">
              <FaShieldAlt /> Confirmed
            </div>
          )}

          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full py-2.5 text-xs text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-2xl disabled:opacity-50 font-semibold transition-colors"
          >
            {cancelling ? "Cancelling..." : "Cancel Reservation"}
          </button>
        </div>
      </div>

      {booking.place && <PlaceGallery place={booking.place} />}

      {/* Payment Selection & Checkout Modal */}
      {showPaymentModal && (
        <PaymentModal
          booking={booking}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
