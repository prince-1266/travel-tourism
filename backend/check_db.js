import "dotenv/config";
import mongoose from "mongoose";
import Otp from "./models/Otp.js";

async function checkDb() {
    console.log("--- MongoDB Diagnostic ---");
    console.log("Connecting to:", process.env.MONGO_URI.split("@")[1]);

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const testPhone = "DIAGNOSTIC_TEST";
        const testOtp = "123456";

        console.log("Attempting to write test OTP...");
        await Otp.deleteMany({ phone: testPhone });
        await Otp.create({ phone: testPhone, otp: testOtp });
        console.log("✅ Write successful");

        console.log("Attempting to read test OTP...");
        const found = await Otp.findOne({ phone: testPhone });
        if (found && found.otp === testOtp) {
            console.log("✅ Read successful");
        } else {
            console.error("❌ Read failed: Data mismatch");
        }

        console.log("Cleaning up...");
        await Otp.deleteMany({ phone: testPhone });
        console.log("✅ Cleanup successful");

        console.log("\nCONCLUSION: Your Database is working perfectly.");
    } catch (err) {
        console.error("\n❌ DATABASE ERROR:");
        console.error(err.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
}

checkDb();
