import "dotenv/config";
import mongoose from "mongoose";

const testConn = async () => {
    console.log("Testing connection to:", process.env.MONGO_URI.split("@")[1]); // Log only the cluster part for safety
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });
        console.log("SUCCESS: Connected to MongoDB!");
        console.log("Database Name:", conn.connection.name);
        await mongoose.connection.close();
    } catch (err) {
        console.error("FAILURE: Could not connect to MongoDB.");
        console.error("Reason:", err.message);
        process.exit(1);
    }
};

testConn();
