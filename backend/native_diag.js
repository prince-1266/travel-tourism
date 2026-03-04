import "dotenv/config";
import { MongoClient } from "mongodb";

const run = async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        const db = client.db();
        const users = await db.collection("users").find({}).toArray();

        console.log("DIAGNOSTIC_START");
        console.log("Total Users:", users.length);
        users.forEach(u => {
            console.log(`- ID: ${u._id}, Email: ${u.email}, Phone: ${u.phone}, Name: "${u.name}", Role: ${u.role}`);
        });
        console.log("DIAGNOSTIC_END");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
};

run();
