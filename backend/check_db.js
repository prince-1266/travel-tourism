import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User.js";

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, { email: 1, phone: 1, role: 1, _id: 0 });
    console.log("Registered Users:", users);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
