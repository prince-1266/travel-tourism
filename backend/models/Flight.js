import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    airline: String,
    code: String,
    from: String,
    to: String,
    price: Number,
    seats: Number,
    time: String,
    duration: String,
    type: String, // Non-stop, 1-stop
  },
  { timestamps: true }
);

export default mongoose.model("Flight", flightSchema);
