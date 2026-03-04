import { MongoClient } from 'mongodb';
import "dotenv/config";

async function run() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const dbName = process.env.MONGO_URI.split('/').pop().split('?')[0];
        const db = client.db(dbName);
        console.log("Checking database:", dbName);

        const collections = await db.listCollections().toArray();
        console.log("Found collections:", collections.length);

        for (const collection of collections) {
            const count = await db.collection(collection.name).countDocuments();
            console.log(`- ${collection.name}: ${count} documents`);
            if (count > 0) {
                const sample = await db.collection(collection.name).findOne();
                console.log(`  Sample keys:`, Object.keys(sample));
            }
        }
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
