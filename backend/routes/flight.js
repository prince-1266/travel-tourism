import express from "express";
import { getFlights, createFlight, deleteFlight } from "../controllers/flightController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFlights);
router.post("/", protect, adminOnly, createFlight);
router.delete("/:id", protect, adminOnly, deleteFlight);

export default router;
