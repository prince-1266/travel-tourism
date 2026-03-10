import { MongoClient } from 'mongodb';
import "dotenv/config";

async function diag() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const dbs = ["traveldb", "tourdb"];

        console.log("--- MULTI-DB DIAGNOSTIC ---");
        for (const dbName of dbs) {
            const db = client.db(dbName);
            const user = await db.collection("users").findOne({ role: "admin" });
            console.log(`\nDatabase: ${dbName}`);
            if (user) {
                console.log(`✅ Admin found: ${user.name} (${user.email})`);
            } else {
                console.log(`❌ No admin found.`);
                const count = await db.collection("users").countDocuments();
                console.log(`Total users in this DB: ${count}`);
            }
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.close();
    }
}
diag();
