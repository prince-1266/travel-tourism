const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { fullName, email, mobile, password } = req.body;

  try {
    // Check if user exists by email OR mobile
    let user = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (user) {
      return res.status(400).json({
        message: "User already exists with this email or mobile",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      mobile,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN (EMAIL OR MOBILE) ================= */
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find user by email OR mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
