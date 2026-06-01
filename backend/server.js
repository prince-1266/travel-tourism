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

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  console.log("⏳ Connecting to MongoDB Atlas...");
  mongoose.set("bufferCommands", false);
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`🚀 MongoDB Connected: ${conn.connection.name}`);
  isConnected = true;
};

// Database connection middleware
app.use(async (req, res, next) => {
  if (req.path === "/api/auth/test-email" || req.path === "/api/auth/diag") {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ Database connection error in middleware:", err.message);
    res.status(500).json({
      message: "Database connection failed. Please ensure the backend MONGO_URI environment variable is correct and MongoDB Atlas allows access from all IPs.",
      error: err.message
    });
  }
});


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminUsersRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/ai", aiRoutes);
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

// Start local server only if not running inside Vercel serverless environment
if (!process.env.VERCEL) {
  connectDB().catch((err) => {
    console.error("❌ Pre-connecting MongoDB failed:", err.message);
  });
  startServer(PORT);
}

export default app;
