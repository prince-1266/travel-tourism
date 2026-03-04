import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to:", mongoose.connection.name);

        const admin = await User.findOne({ role: "admin" });
        if (admin) {
            console.log("Admin found in this DB:", admin.email);
        } else {
            console.log("No admin found in this DB. Seeding may be required.");
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

verify();
