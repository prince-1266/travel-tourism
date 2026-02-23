import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true
    },
    flight: {
      type: Object, // Storing snapshot of flight details to avoid issues if flight changes
    },
    hotel: {
      type: Object, // Storing snapshot of hotel details
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: false
    },
    startDate: Date,
    endDate: Date,
    travelers: Number,
    travelersDetails: [{
      name: String,
      age: String,
      gender: String,
      phone: String
    }],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
