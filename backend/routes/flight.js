import express from "express";
import Flight from "../models/Flight.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

// console.log("✅ flight routes file loaded");

const router = express.Router();

// TEST ROUTE (VERY IMPORTANT)
router.get("/test", (req, res) => {
  res.json({ message: "Flights route working" });
});

// GET ALL FLIGHTS
router.get("/", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD FLIGHT (ADMIN)
router.post("/", protect, adminOnly, async (req, res) => {
  const flight = await Flight.create(req.body);
  res.json(flight);
});

// DELETE FLIGHT (ADMIN)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Flight.findByIdAndDelete(req.params.id);
  res.json({ message: "Flight deleted" });
});

export default router;
