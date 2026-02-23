import Booking from "../models/Booking.js";

/* CREATE NEW BOOKING */
export const createBooking = async (req, res) => {
    try {
        const {
            destination,
            flight,
            hotel,
            tripId,
            startDate,
            endDate,
            travelers,
            travelersDetails,
            totalPrice,
        } = req.body;

        const newBooking = new Booking({
            user: req.user.id,
            destination,
            flight,
            hotel,
            tripId,
            startDate,
            endDate,
            travelers,
            travelersDetails,
            totalPrice,
            status: "pending", // Payment pending
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(500).json({ message: "Failed to create booking", error: err.message });
    }
};

/* GET USER BOOKINGS */
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate("tripId")
            .populate("paymentId")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

/* GET ALL BOOKINGS (ADMIN) */
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

/* DELETE BOOKING */
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
            // Check if user is owner OR admin
            return res.status(401).json({ message: "Not authorized" });
        }

        await booking.deleteOne();
        res.json({ message: "Booking removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
