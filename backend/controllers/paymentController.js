import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import Razorpay from "razorpay";
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        };

        const order = await instance.orders.create(options);
        
        if (!order) return res.status(500).send("Some error occured");

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Order creation failed", error: err.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
            amount
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Create Payment Record
            const payment = new Payment({
                bookingId,
                userId: req.user.id,
                amount: amount,
                method: "Razorpay",
                status: "completed",
                transactionId: razorpay_payment_id,
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
                message: "Payment successfully verified",
                payment,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid Signature",
            });
        }
    } catch (err) {
        res.status(500).json({ message: "Payment verification failed", error: err.message });
    }
};
