import express from "express";
import { getHotels, createHotel } from "../controllers/hotelController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/hotels (Public)
router.get("/", getHotels);

// POST /api/hotels (Admin only)
router.post("/", protect, adminOnly, createHotel);

export default router;
