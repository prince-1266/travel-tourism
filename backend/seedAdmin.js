import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to: ${mongoose.connection.name}`);
        console.log(`URI being used: ${process.env.MONGO_URI.replace(/\/\/.*@/, "//***@")}`); // Hide credentials

        const adminEmail = process.env.ADMIN_EMAIL || "modhprince12663515@gmail.com";
        const adminPhone = process.env.ADMIN_PHONE || "+916353248918";
        const adminPassword = "123456";

        console.log(`Searching for admin with email: ${adminEmail} or phone: ${adminPhone}`);

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            $or: [{ email: adminEmail }, { phone: adminPhone }]
        });

        if (existingAdmin) {
            console.log("Admin user found in DB. Updating role and name...");
            existingAdmin.role = "admin";
            existingAdmin.name = "Prince Modh.";
            await existingAdmin.save();
            console.log("Admin user updated successfully.");
        } else {
            console.log("Admin user NOT found. Creating new admin...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const newAdmin = new User({
                name: "Prince Modh.",
                email: adminEmail,
                phone: adminPhone,
                password: hashedPassword,
                role: "admin",
                isVerified: true
            });

            await newAdmin.save();
            console.log("New Admin user created successfully.");
            console.log(`Email: ${adminEmail}`);
            console.log(`Phone: ${adminPhone}`);
            console.log(`Password: ${adminPassword}`);
        }

        mongoose.connection.close();
        console.log("Seeding complete. Connection closed.");
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
};

seedAdmin();
