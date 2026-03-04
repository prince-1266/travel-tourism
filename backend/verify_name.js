import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await User.findOne({ role: "admin" });
    console.log("Admin Name:", admin?.name);
    await mongoose.connection.close();
};
check();
