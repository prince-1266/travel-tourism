
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

/* PROCESS PAYMENT (SIMULATION) */
export const processPayment = async (req, res) => {
    try {
        const { bookingId, amount, method, cardDetails } = req.body;

        // Simulate Payment Gateway Delay
        // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        // await delay(2000);

        // Create Payment Record
        const payment = new Payment({
            bookingId,
            userId: req.user.id,
            amount,
            method,
            status: "completed", // Auto-complete for demo
            transactionId: "TXN" + Date.now(),
        });

        await payment.save();

        // Update Booking Status
        const booking = await Booking.findById(bookingId);
        if (booking) {
            booking.status = "confirmed";
            booking.paymentId = payment._id;
            await booking.save();
        }

        res.status(200).json({
            success: true,
            message: "Payment successful",
            payment,
        });
    } catch (err) {
        res.status(500).json({ message: "Payment failed", error: err.message });
    }
};
