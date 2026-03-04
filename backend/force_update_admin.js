import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const forceUpdate = async () => {
    console.log("Connecting to:", process.env.MONGO_URI.split("@")[1]); // Log host only for safety
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully!");

        const result = await User.updateMany(
            { role: "admin" },
            { $set: { name: "Prince Modh" } }
        );

        console.log("Update Result:", result);

        const updatedAdmins = await User.find({ role: "admin" });
        console.log("Current Admins in DB:");
        updatedAdmins.forEach(a => console.log(`- ${a.email}: ${a.name}`));

        await mongoose.connection.close();
        console.log("Connection closed. DONE.");
        process.exit(0);
    } catch (err) {
        console.error("FATAL ERROR:", err);
        process.exit(1);
    }
};

forceUpdate();
