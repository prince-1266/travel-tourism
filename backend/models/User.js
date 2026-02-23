import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "", // Name might not be available initially for mobile auth
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null/undefined values
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null/undefined values
    },

    password: {
      type: String,
      // Not required for Google/OTP users
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    wishlist: [{ type: String }], // Store destination IDs
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
