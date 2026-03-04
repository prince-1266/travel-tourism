import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Flight from "../models/Flight.js";
import mongoose from "mongoose";

export const getAdminStats = async (req, res) => {
    try {
        // -------------------------

        const [userCount, bookingCount, flightCount, bookings] = await Promise.all([
            User.countDocuments({ role: "user" }),
            Booking.countDocuments(),
            Flight.countDocuments(),
            Booking.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email")
        ]);


        const totalRevenueResult = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        const recentUsers = await User.find({ role: "user" }).sort({ createdAt: -1 }).limit(5).select("name email createdAt");

        res.json({
            users: userCount,
            bookings: bookingCount,
            flights: flightCount,
            revenue: totalRevenue,
            recentBookings: bookings,
            recentUsers
        });
    } catch (err) {
        console.error("Error fetching admin stats:", err);
        res.status(500).json({ message: "Failed to fetch dashboard statistics", error: err.message });
    }
};
