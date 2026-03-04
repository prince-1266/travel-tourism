import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const adminEmail = process.env.ADMIN_EMAIL || "modhprince12663515@gmail.com";
        const admins = await User.find({ role: "admin" });
        console.log("DIAGNOSTIC_RESULT_START");
        console.log("Admin Email in ENV:", adminEmail);
        console.log("Total Admin Users Found:", admins.length);
        admins.forEach((admin, index) => {
            console.log(`Admin ${index + 1}: Name="${admin.name}", Email="${admin.email}"`);
        });
        console.log("DIAGNOSTIC_RESULT_END");
        await mongoose.connection.close();
    } catch (err) {
        console.error("DIAGNOSTIC_ERROR:", err.message);
    }
};
check();
