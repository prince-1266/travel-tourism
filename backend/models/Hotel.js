import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String, // e.g., "Paris", "New York"
        required: true,
    },
    rating: {
        type: Number,
        default: 4.0,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    },
    type: {
        type: String, // "Luxury", "Budget", "Resort"
        default: "Hotel"
    },
    description: String,
    amenities: [String],
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);
