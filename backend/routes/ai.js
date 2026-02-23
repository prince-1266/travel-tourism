import express from "express";
import {
    generateTripPlan,
    getWeatherSummary,
    getPackingSuggestions,
    chatWithAI,
} from "../controllers/aiController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Assessing middleware existence later

const router = express.Router();

// All AI routes should be protected ideally, or at least safe
router.post("/plan", generateTripPlan);
router.get("/weather", getWeatherSummary);
router.post("/packing", getPackingSuggestions);
router.post("/chat", chatWithAI);

export default router;
