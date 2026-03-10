import { MongoClient } from 'mongodb';
import "dotenv/config";

async function inspectAdminCol() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("traveldb");
        const adminCol = db.collection("admin");
        const count = await adminCol.countDocuments();
        console.log(`--- admin collection in traveldb ---`);
        console.log(`Document count: ${count}`);

        if (count > 0) {
            const docs = await adminCol.find({}).toArray();
            console.log("Documents:", JSON.stringify(docs, null, 2));
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.close();
    }
}
inspectAdminCol();
