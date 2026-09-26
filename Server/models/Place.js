import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    photos: { type: [String], default: [] },
    description: { type: String, default: "" },
    perks: { type: [String], default: [] },
    extraInfo: { type: String, default: "" },
    checkIn: { type: Number, default: 14 },
    checkOut: { type: Number, default: 11 },
    maxGuests: { type: Number, min: 1, default: 1 },
    price: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Place", placeSchema);
