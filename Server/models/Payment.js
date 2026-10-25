import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, default: "razorpay" },
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    method: { type: String, default: "upi" },
    status: {
      type: String,
      enum: ["created", "Captured", "failed", "pending", "refunded"],
      default: "created",
      index: true,
    },
    signature: { type: String },
    verifiedAt: { type: Date },
    rawResponse: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
