import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import Flight from "./models/Flight.js";

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to:", mongoose.connection.name);

        const uCount = await User.countDocuments();
        const uRoleCount = await User.countDocuments({ role: "user" });
        const bCount = await Booking.countDocuments();
        const fCount = await Flight.countDocuments();

        const rev = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        console.log("--- DB STATS ---");
        console.log("Total Users:", uCount);
        console.log("Users with role 'user':", uRoleCount);
        console.log("Total Bookings:", bCount);
        console.log("Total Flights:", fCount);
        console.log("Revenue Aggregation:", rev);

        if (bCount > 0) {
            const sample = await Booking.findOne();
            console.log("Sample Booking fields:", Object.keys(sample.toObject()));
            console.log("Sample Booking totalPrice:", sample.totalPrice);
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

check();
