import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

console.log("Testing MongoDB connection to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MONGO DB CONNECTED SUCCESSFULLY!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ MONGO DB CONNECTION FAILED:", err.message);
    process.exit(1);
  });
