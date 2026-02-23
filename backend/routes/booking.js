import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  deleteBooking,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Routes
router.post("/", protect, createBooking);
router.get("/my", protect, getUserBookings);
router.delete("/:id", protect, deleteBooking);

// Admin Routes
router.get("/", protect, adminOnly, getAllBookings);

export default router;
