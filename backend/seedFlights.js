import mongoose from "mongoose";
import dotenv from "dotenv";
import Flight from "./models/Flight.js";

dotenv.config();

const SAMPLE_FLIGHTS = [
    {
        airline: "IndiGo",
        code: "6E-204",
        from: "Delhi",
        to: "Destination",
        time: "08:00 AM - 10:30 AM",
        duration: "2h 30m",
        price: 4500,
        type: "Non-stop",
        seats: 60
    },
    {
        airline: "Air India",
        code: "AI-505",
        from: "Delhi",
        to: "Destination",
        time: "11:15 AM - 01:45 PM",
        duration: "2h 30m",
        price: 5200,
        type: "Non-stop",
        seats: 50
    },
    {
        airline: "Vistara",
        code: "UK-993",
        from: "Delhi",
        to: "Destination",
        time: "05:45 PM - 08:30 PM",
        duration: "2h 45m",
        price: 6800,
        type: "Non-stop",
        seats: 45
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Clear existing flights if any (optional, but good for clean slate)
        await Flight.deleteMany({});
        console.log("Cleared existing flights...");

        await Flight.insertMany(SAMPLE_FLIGHTS);
        console.log("✅ Flights Seeded Successfully!");

        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedDB();
