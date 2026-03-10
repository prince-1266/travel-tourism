import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

async function verifyAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const adminEmail = process.env.ADMIN_EMAIL;
        const admin = await User.findOne({ email: adminEmail });

        console.log("--- Admin Verification ---");
        if (admin) {
            console.log(`✅ Admin found: ${admin.name} (${admin.email})`);
            console.log(`Role: ${admin.role}`);
        } else {
            console.log(`❌ Admin NOT found with email: ${adminEmail}`);
            const allAdmins = await User.find({ role: "admin" });
            console.log(`Total admins in DB: ${allAdmins.length}`);
            allAdmins.forEach(a => console.log(` - ${a.name}: ${a.email}`));
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error:", err.message);
    }
}

verifyAdmin();
