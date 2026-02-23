import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* GET USER WISHLIST */
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("wishlist");
        res.json({ wishlist: user.wishlist || [] });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ADD TO WISHLIST */
router.post("/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const placeId = req.params.id;

        if (!user.wishlist.includes(placeId)) {
            user.wishlist.push(placeId);
            await user.save();
        }
        res.json({ wishlist: user.wishlist, message: "Added to wishlist" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* REMOVE FROM WISHLIST */
router.delete("/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(id => id !== req.params.id);
        await user.save();
        res.json({ wishlist: user.wishlist, message: "Removed from wishlist" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
