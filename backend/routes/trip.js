
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createTrip,
    getUserTrips,
    getTripById,
} from "../controllers/tripController.js";

const router = express.Router();

router.post("/", protect, createTrip);
router.get("/", protect, getUserTrips);
router.get("/:id", protect, getTripById);

export default router;
