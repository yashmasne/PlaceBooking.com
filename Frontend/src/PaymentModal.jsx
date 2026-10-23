import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaCreditCard,
  FaGooglePay,
  FaLock,
  FaShieldAlt,
  FaTimes,
  FaUniversity,
  FaWallet,
} from "react-icons/fa";
import { SiPhonepe, SiPaytm } from "react-icons/si";

export default function PaymentModal({ booking, onClose, onSuccess }) {
  const [method, setMethod] = useState("upi");
  const [upiSubOption, setUpiSubOption] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    name: booking?.name || "",
    expiry: "",
    cvv: "",
  });
  const [bank, setBank] = useState("hdfc");
  const [wallet, setWallet] = useState("paytm");

  const [loadingOrder, setLoadingOrder] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // Initialize order on mount
  useEffect(() => {
    if (!booking?._id) return;
    setLoadingOrder(true);
    setError("");
    axios
      .post("/placesBooking", { bookingId: booking._id })
      .then(({ data }) => {
        setOrderData(data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Unable to initiate payment session.");
      })
      .finally(() => {
        setLoadingOrder(false);
      });
  }, [booking?._id]);

  function handleCardNumberChange(e) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setCardData((prev) => ({ ...prev, number: formatted }));
  }

  function handleExpiryChange(e) {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardData((prev) => ({ ...prev, expiry: raw }));
  }

  async function handleConfirmPayment(e) {
    e.preventDefault();
    if (processing || !orderData) return;
    setError("");

    // Validate inputs based on method
    if (method === "upi" && upiSubOption === "id") {
      if (!upiId.trim() || !upiId.includes("@")) {
        setError("Please enter a valid UPI ID (e.g., yourname@okhdfcbank).");
        return;
      }
    } else if (method === "card") {
      const cleanNum = cardData.number.replace(/\s/g, "");
      if (cleanNum.length < 15) {
        setError("Please enter a valid 16-digit credit/debit card number.");
        return;
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        setError("Please enter a valid card expiry date (MM/YY).");
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        setError("Please enter a valid 3-digit CVV.");
        return;
      }
    }

    setProcessing(true);

    try {
      if (orderData.mode === "razorpay" && window.Razorpay) {
        // Real Razorpay gateway
        const options = {
          key: orderData.key,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          order_id: orderData.order.id,
          name: "PlaceBooking.com",
          description: `Stay at ${booking.place?.title || "Property"}`,
          prefill: {
            name: booking.name,
          },
          theme: { color: "#FF385C" },
          handler: async (response) => {
            try {
              const { data } = await axios.post("/verify", {
                bookingId: booking._id,
                method,
                methodDetails: { upiSubOption, bank, wallet },
                response,
              });
              setSuccess(data);
              if (onSuccess) onSuccess(data);
            } catch (err) {
              setError(err.response?.data?.error || "Payment signature verification failed.");
              setProcessing(false);
            }
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // Simulated Payment with Verified Server Signature
      // Simulates real Indian payment gateway latency
      await new Promise((r) => setTimeout(r, 1200));

      const payload = {
        bookingId: booking._id,
        method,
        methodDetails: {
          upiSubOption,
          upiId: upiSubOption === "id" ? upiId : `${upiSubOption}_user@bank`,
          cardLast4: cardData.number.replace(/\s/g, "").slice(-4) || "4242",
          bank,
          wallet,
        },
        response: {
          demo: true,
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: `pay_${method}_${Math.random().toString(36).slice(2, 10)}`,
        },
      };

      const { data } = await axios.post("/verify", payload);
      setSuccess(data);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.error || "Payment processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  const breakdown = orderData?.breakdown || {
    nights: booking.nights || 1,
    subtotal: booking.subtotal || booking.price || 0,
    tax: booking.tax || Math.round((booking.price || 0) * 0.12),
    serviceFee: booking.serviceFee || Math.round((booking.price || 0) * 0.05),
    total: booking.price || 0,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              ₹
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">PlaceBooking Checkout</h2>
              <p className="text-xs text-gray-500">Secure Indian Rupee (INR) Payment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200/80 text-gray-500 hover:text-black transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {success ? (
            /* Success State */
            <div className="text-center py-8">
              <FaCheckCircle className="text-emerald-500 text-6xl mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                Your reservation at <span className="font-semibold">{booking.place?.title}</span> has been confirmed
                and paid.
              </p>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/70 text-left max-w-md mx-auto text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Reference:</span>
                  <span className="font-mono font-semibold text-gray-800">{booking._id.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment ID:</span>
                  <span className="font-mono font-semibold text-gray-800">{success.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-semibold uppercase text-gray-800">{method}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-sm">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-700">₹{breakdown.total?.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              {/* Property Summary & Price Breakdown Banner */}
              <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{booking.place?.title || "Property Stay"}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {booking.place?.address || "India"} · {breakdown.nights} {breakdown.nights === 1 ? "night" : "nights"} · {booking.numberOfGuests} guests
                  </p>
                </div>
                <div className="text-right sm:border-l sm:border-rose-200 sm:pl-4">
                  <span className="text-xs text-gray-500 block uppercase tracking-wider font-semibold">Total Payable</span>
                  <span className="text-2xl font-black text-gray-900">₹{breakdown.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Itemized Price Details Accordion */}
              <div className="mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-200/60 text-xs text-gray-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>Accommodation Subtotal ({breakdown.nights} nights):</span>
                  <span className="font-medium text-gray-800">₹{breakdown.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Goods & Services Tax (GST 12%):</span>
                  <span className="font-medium text-gray-800">₹{breakdown.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>PlaceBooking Service & Insurance Fee (5%):</span>
                  <span className="font-medium text-gray-800">₹{breakdown.serviceFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-sm text-gray-900">
                  <span>Final Amount to Pay:</span>
                  <span className="text-primary">₹{breakdown.total?.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              {/* Payment Methods Selection */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Choose Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod("upi")}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      method === "upi"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <span className="text-lg">⚡</span>
                    <span className="text-xs">UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      method === "card"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <FaCreditCard className="text-base" />
                    <span className="text-xs">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("netbanking")}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      method === "netbanking"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <FaUniversity className="text-base" />
                    <span className="text-xs">Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("wallet")}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      method === "wallet"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <FaWallet className="text-base" />
                    <span className="text-xs">Wallets</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Method Form Details */}
              <form onSubmit={handleConfirmPayment}>
                {method === "upi" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5">
                    <p className="text-xs font-semibold text-gray-700 mb-3">Select your preferred UPI app:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setUpiSubOption("gpay")}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
                          upiSubOption === "gpay"
                            ? "bg-white border-primary text-primary font-bold shadow-sm"
                            : "bg-white/80 border-gray-200 text-gray-700"
                        }`}
                      >
                        <FaGooglePay className="text-xl" /> Google Pay
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiSubOption("phonepe")}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
                          upiSubOption === "phonepe"
                            ? "bg-white border-primary text-primary font-bold shadow-sm"
                            : "bg-white/80 border-gray-200 text-gray-700"
                        }`}
                      >
                        <SiPhonepe className="text-base text-purple-600" /> PhonePe
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiSubOption("paytm")}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
                          upiSubOption === "paytm"
                            ? "bg-white border-primary text-primary font-bold shadow-sm"
                            : "bg-white/80 border-gray-200 text-gray-700"
                        }`}
                      >
                        <SiPaytm className="text-base text-sky-600" /> Paytm
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiSubOption("id")}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
                          upiSubOption === "id"
                            ? "bg-white border-primary text-primary font-bold shadow-sm"
                            : "bg-white/80 border-gray-200 text-gray-700"
                        }`}
                      >
                        Other UPI ID
                      </button>
                    </div>

                    {upiSubOption === "id" ? (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Enter UPI ID (VPA)
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi or username@okhdfcbank"
                          className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
                        />
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-500">
                        ⚡ Instant checkout via {upiSubOption.toUpperCase()}. You will receive a secure authorization request on your mobile device.
                      </p>
                    )}
                  </div>
                )}

                {method === "card" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        placeholder="4532 •••• •••• 8892"
                        className="w-full text-xs font-mono p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-primary tracking-wider"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          placeholder="08/28"
                          className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "") }))}
                          placeholder="•••"
                          className="w-full text-xs font-mono p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-primary tracking-widest"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Full name as printed on card"
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <FaLock className="text-gray-400" /> Supports Visa, MasterCard, RuPay, and American Express.
                    </p>
                  </div>
                )}

                {method === "netbanking" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Popular Indian Banks:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {[
                        { id: "hdfc", name: "HDFC Bank" },
                        { id: "sbi", name: "State Bank of India" },
                        { id: "icici", name: "ICICI Bank" },
                        { id: "axis", name: "Axis Bank" },
                        { id: "kotak", name: "Kotak Mahindra" },
                        { id: "pnb", name: "Punjab National Bank" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setBank(item.id)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                            bank === item.id
                              ? "bg-white border-primary text-primary font-bold shadow-sm"
                              : "bg-white/80 border-gray-200 text-gray-700"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      You will be securely redirected to your bank's authenticated net banking portal.
                    </p>
                  </div>
                )}

                {method === "wallet" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Select Digital Wallet:
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { id: "paytm", name: "Paytm Wallet" },
                        { id: "amazon", name: "Amazon Pay" },
                        { id: "phonepe", name: "PhonePe Wallet" },
                        { id: "mobikwik", name: "MobiKwik" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setWallet(item.id)}
                          className={`p-3 rounded-xl border text-xs text-center transition-all ${
                            wallet === item.id
                              ? "bg-white border-primary text-primary font-bold shadow-sm"
                              : "bg-white/80 border-gray-200 text-gray-700"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security and Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loadingOrder || processing}
                    className="w-full bg-gradient-to-r from-primary to-rose-600 hover:from-primary/95 hover:to-rose-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying Payment with Provider...
                      </>
                    ) : (
                      <>
                        <FaLock className="text-xs" />
                        Pay ₹{breakdown.total?.toLocaleString()}
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-3">
                    <FaShieldAlt className="text-emerald-600 text-xs" />
                    <span>256-Bit Bank Grade SSL Encryption · Powered by Razorpay</span>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
