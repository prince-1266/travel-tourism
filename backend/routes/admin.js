import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET ALL USERS */
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
});

/* DELETE USER */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "admin") {
    return res.status(403).json({ message: "Cannot delete admin" });
  }

  await user.deleteOne();
  res.json({ message: "User deleted" });
});


export default router;
