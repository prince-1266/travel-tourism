import { MongoClient } from 'mongodb';
import "dotenv/config";

async function exhaustiveDiag() {
    const uri = process.env.MONGO_URI;
    console.log("--- Exhaustive Cluster Diagnostic ---");
    console.log("Connecting with URI:", uri.replace(/\/\/.*@/, "//***@"));

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const adminDb = client.db().admin();
        const dbsResult = await adminDb.listDatabases();

        for (const dbInfo of dbsResult.databases) {
            const dbName = dbInfo.name;
            if (["admin", "local", "config"].includes(dbName)) continue;

            console.log(`\n🔍 Checking Database: ${dbName}`);
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();

            for (const col of collections) {
                const colName = col.name;
                const count = await db.collection(colName).countDocuments();
                console.log(`  - Collection: ${colName} (Docs: ${count})`);

                if (colName === "users" || colName === "Users") {
                    const sampleUsers = await db.collection(colName).find({}, { projection: { name: 1, email: 1, role: 1, phone: 1 } }).toArray();
                    sampleUsers.forEach(u => {
                        console.log(`    👤 User: Name="${u.name}", Email="${u.email}", Phone="${u.phone}", Role="${u.role}"`);
                    });
                }
            }
        }
    } catch (err) {
        console.error("❌ Diagnostic Error:", err.message);
    } finally {
        await client.close();
        console.log("\n--- Diagnostic End ---");
    }
}

exhaustiveDiag();
