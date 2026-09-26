import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

bookingSchema.index({ place: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model("Booking", bookingSchema);
