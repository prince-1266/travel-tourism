import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
    {
        destination: {
            type: String,
            required: true,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        travelers: {
            type: Number,
            required: true,
            min: 1,
        },
        budget: {
            type: Number,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        itinerary: {
            type: Array, // Stores the AI generated itinerary
            default: [],
        },
        status: {
            type: String,
            enum: ["proposed", "planned", "completed"],
            default: "proposed",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
