import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60, // 60 seconds
    },
});

export default mongoose.model("Otp", otpSchema);
