import { MongoClient } from 'mongodb';
import "dotenv/config";

async function globalSearch() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const adminDb = client.db().admin();
        const dbsResult = await adminDb.listDatabases();

        console.log("--- GLOBAL CLUSTER SEARCH ---");
        console.log("URI (last part):", uri.split("/").pop());

        for (const dbInfo of dbsResult.databases) {
            const dbName = dbInfo.name;
            if (["admin", "local", "config"].includes(dbName)) continue;

            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();

            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                if (count === 0) continue;

                // Search for the admin email in this collection
                const found = await db.collection(col.name).findOne({
                    $or: [
                        { email: "tripwell.support@gmail.com" },
                        { identifier: "tripwell.support@gmail.com" }
                    ]
                });

                if (found) {
                    console.log(`\n✅ FOUND in DB: "${dbName}", Collection: "${col.name}"`);
                    console.log("Record Details:", JSON.stringify(found, null, 2));
                } else {
                    // Just log that we checked it
                    // console.log(`  Checked ${dbName}.${col.name} (${count} docs)`);
                }
            }
        }
    } catch (err) {
        console.error("Diagnostic Error:", err.message);
    } finally {
        await client.close();
        console.log("\n--- Search Complete ---");
    }
}

globalSearch();
