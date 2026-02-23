
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { processPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", protect, processPayment);

export default router;
