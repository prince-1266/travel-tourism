import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import adminUsersRoutes from "./routes/adminUsers.js";
import bookingRoutes from "./routes/booking.js";
import flightRoutes from "./routes/flight.js";
import locationRoutes from "./routes/location.js";
import placesRoutes from "./routes/places.js";
import aiRoutes from "./routes/ai.js";
import tripRoutes from "./routes/trip.js";
import paymentRoutes from "./routes/payment.js";
import wishlistRoutes from "./routes/wishlist.js";
import weatherRoutes from "./routes/weather.js";
import hotelRoutes from "./routes/hotels.js";
import contactRoutes from "./routes/contact.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminUsersRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/contact", contactRoutes);


const PORT = process.env.PORT || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
    }
  });
};

startServer(PORT);
