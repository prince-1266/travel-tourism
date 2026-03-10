import { MongoClient } from 'mongodb';
import "dotenv/config";

async function listCols() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("traveldb");
        const collections = await db.listCollections().toArray();
        console.log("--- Collections in traveldb ---");
        collections.forEach(c => console.log(c.name));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.close();
    }
}
listCols();
