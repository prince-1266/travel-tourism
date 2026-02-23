import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= GOOGLE LOGIN ================= */
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        googleId,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random password
        role: "user",
      });
    } else if (!user.googleId) {
      // Link googleId if user exists but not linked
      user.googleId = googleId;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Google verify error:", err);
    res.status(400).json({ message: "Invalid Google Token" });
  }
});

/* ================= SEND OTP (MOCKED / EMAIL) ================= */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/send-otp", async (req, res) => {
  const { phone, email, type } = req.body; // type: 'register' | 'reset'

  if (!phone && !email) {
    return res.status(400).json({ message: "Phone or Email is required" });
  }

  try {
    let targetEmail = email;
    let targetPhone = phone;
    let user = null;

    if (phone) {
      user = await User.findOne({ phone });
    } else if (email) {
      user = await User.findOne({ email });
      if (user) targetPhone = user.phone;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate Phone Format (Indian)
    // Only check if phone is provided directly (not derived from user for reset)
    if (phone && phone.startsWith("+91")) {
      const indianPhoneRegex = /^\+91[6-9]\d{9}$/;
      if (!indianPhoneRegex.test(phone)) {
        return res
          .status(400)
          .json({ message: "Invalid Indian phone number. Must start with 6-9." });
      }
    }

    // VALIDATION Check
    if (type === "register") {
      if (user) {
        return res.status(400).json({ message: "User already registered" });
      }

      // Check if email is already taken (even if not verified yet, or if user exists with different phone but same email)
      // Note: We already check 'user' above which finds by phone OR email. 
      // But let's be specific for better error message if they provided an email that exists.
      if (email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "Email is already registered" });
        }
      }

      // For registration, we need an email to send OTP (if user provided one)
      if (!targetEmail) {
        // If they only provided phone, we can't send real OTP without SMS gateway
        // We will fallback to mock
      }
    } else if (type === "reset") {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      // If user found, prefer their registered email
      if (user.email) targetEmail = user.email;
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove existing OTPs for the identifier (Phone is primary key for OTP table currently)
    // If we have phone, use it. If not (email only registration?), we might need to adjust OTP model.
    // Current OTP model uses 'phone'. Let's stick to phone as key if available.
    // If registration is Email-only (not supported yet), we'd need change. 
    // BUT frontend registration requires Phone. So we always have phone.

    // Fallback: If no phone provided (e.g. forgot password via email input), we need to find phone from user.
    // We did that above (user.phone).

    const otpKey = targetPhone || (email ? email : null);

    if (!otpKey) {
      return res.status(400).json({ message: "Cannot associate OTP with a user/phone" });
    }

    await Otp.deleteMany({ phone: otpKey });
    await Otp.create({ phone: otpKey, otp }); // Saving to DB

    console.log(`OTP for ${otpKey} (${type}): ${otp}`);

    // SEND EMAIl IF AVAILABLE
    if (targetEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: targetEmail,
        subject: `${type === 'register' ? 'Registration' : 'Reset Password'} OTP - TripWell`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4F46E5;">TripWell 🌍</h2>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                Use the following OTP to complete your ${type === 'register' ? 'registration' : 'password reset'} process.
              </p>
              <h1 style="font-size: 32px; font-weight: bold; color: #111827; letter-spacing: 5px; margin: 0;">
                ${otp}
              </h1>
              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                This code is valid for 5 minutes. Do not share it with anyone.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
              <p>&copy; ${new Date().getFullYear()} TripWell. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          // Don't fail the request, just log. Client might see mock OTP in dev.
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.json({ success: true, message: `OTP sent to ${targetEmail}`, otp }); // Return OTP for dev convenience still?
    }

    res.json({ success: true, message: "OTP sent (Mocked - check console)", otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= VERIFY OTP & RESET PASSWORD ================= */
router.post("/verify-otp-reset", async (req, res) => {
  const { phone, email, otp, newPassword } = req.body;

  if ((!phone && !email) || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Resolve Phone if Email provided
    let targetPhone = phone;
    if (!targetPhone && email) {
      const user = await User.findOne({ email });
      if (user) targetPhone = user.phone;
    }

    if (!targetPhone) {
      return res.status(400).json({ message: "User not found" });
    }

    const otpRecord = await Otp.findOne({ phone: targetPhone, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ phone: targetPhone });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Delete used OTP
    await Otp.deleteMany({ phone: targetPhone });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  let { name, email, phone, password, otp } = req.body;

  try {
    if (!name || !email || !phone || !password || !otp) {
      return res.status(400).json({ message: "All fields are required including OTP" });
    }

    // Verify OTP first
    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ NORMALIZE (DO NOT CHANGE COUNTRY CODE)
    email = email.trim().toLowerCase();
    phone = phone.replace(/\s|-/g, ""); // keep +91 intact

    // Validate Phone Format (Indian)
    if (phone.startsWith("+91")) {
      const indianPhoneRegex = /^\+91[6-9]\d{9}$/;
      if (!indianPhoneRegex.test(phone)) {
        return res.status(400).json({ message: "Invalid Indian phone number. Must start with 6-9." });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: "Phone number is already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone, // e.g. +917984171823
      password: hashedPassword,
      role: "user",
    });

    // Delete used OTP
    await Otp.deleteMany({ phone });

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  let { identifier, password, role } = req.body;

  try {
    identifier = identifier.trim().replace(/\s|-/g, "");

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found with this email/mobile" });
    }

    // If user has no password (e.g. google/otp only user)
    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google or OTP" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message:
          user.role === "admin"
            ? "Admin cannot login as user"
            : "User cannot login as admin",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET USER PROFILE ================= */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/me", protect, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) {
      // Check if email is taken by another user
      const exists = await User.findOne({ email });
      if (exists && exists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully", // Added message for frontend notification
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ================= CHANGE PASSWORD ================= */
router.put("/me/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.password) {
      // if user has no password, allow setting one directly? Or maybe require OTP?
      // For now, let's assume they can't change password if they don't have one via this route.
      return res.status(400).json({ message: "User has no password set. Use Forgot Password." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE ACCOUNT ================= */
router.delete("/me", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
