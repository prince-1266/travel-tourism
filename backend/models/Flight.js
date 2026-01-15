import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    airline: String,
    from: String,
    to: String,
    price: Number,
    seats: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Flight", flightSchema);
