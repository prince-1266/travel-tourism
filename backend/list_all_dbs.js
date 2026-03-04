import { MongoClient } from 'mongodb';
import "dotenv/config";

async function run() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        console.log("Connected successfully to cluster");

        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();

        console.log("--- DATABASES ON CLUSTER ---");
        for (const dbInfo of dbs.databases) {
            console.log(`\nDatabase: ${dbInfo.name} (${(dbInfo.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
            const db = client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                if (count > 0) {
                    console.log(`  [Data Found] - ${col.name}: ${count} docs`);
                } else {
                    console.log(`  - ${col.name}: 0 docs`);
                }
            }
        }
    } catch (err) {
        console.error("Error listing databases:", err.message);
    } finally {
        await client.close();
    }
}
run();
