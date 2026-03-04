import "dotenv/config";
import mongoose from "mongoose";

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to:", mongoose.connection.name);

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log("--- COLLECTIONS ---");
        for (let col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`${col.name}: ${count}`);
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

check();
