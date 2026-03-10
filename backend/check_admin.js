import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const checkAdmin = async () => {
    try {
        console.log("--- MongoDB Diagnostic ---");
        console.log("Connecting to:", process.env.MONGO_URI.split("@")[1]);

        await mongoose.connect(process.env.MONGO_URI);
        console.log("CONNECTED to database:", mongoose.connection.name);

        if (mongoose.connection.name !== "tourdb") {
            console.warn("WARNING: You are NOT connected to 'tourdb'. You are connected to:", mongoose.connection.name);
        }

        const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (admin) {
            console.log("SUCCESS: Admin user found!");
            console.log("Name:", admin.name);
            console.log("Role:", admin.role);
        } else {
            console.error("FAILURE: Admin user NOT found in this database.");

            // Check all users to see what IS there
            const allUsers = await User.find({}, { email: 1, _id: 0 });
            console.log("Users currently in this database:", allUsers.length > 0 ? allUsers.map(u => u.email).join(", ") : "None");
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error("ERROR during diagnostic:", err.message);
    }
};

checkAdmin();
