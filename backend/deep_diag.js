import { MongoClient } from 'mongodb';
import "dotenv/config";
import fs from 'fs';

async function deepDiag() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    const results = {
        envAdminEmail: process.env.ADMIN_EMAIL,
        dbs: []
    };

    try {
        await client.connect();
        const adminDb = client.db().admin();
        const dbsList = await adminDb.listDatabases();

        for (const dbInfo of dbsList.databases) {
            const dbName = dbInfo.name;
            if (['admin', 'local', 'config'].includes(dbName)) continue;

            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            const dbResult = { name: dbName, collections: [] };

            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                const sample = await db.collection(col.name).find({
                    $or: [
                        { email: process.env.ADMIN_EMAIL },
                        { role: 'admin' }
                    ]
                }).toArray();

                if (sample.length > 0) {
                    dbResult.collections.push({
                        name: col.name,
                        count: count,
                        adminRecords: sample.map(s => ({ email: s.email, role: s.role, name: s.name }))
                    });
                } else if (col.name === 'users' || col.name === 'admins' || col.name === 'admin') {
                    dbResult.collections.push({
                        name: col.name,
                        count: count,
                        adminRecords: []
                    });
                }
            }
            results.dbs.push(dbResult);
        }

        fs.writeFileSync('deep_diag_result.json', JSON.stringify(results, null, 2));
        console.log("Diagnostic complete. Results written to deep_diag_result.json");
    } catch (err) {
        fs.writeFileSync('deep_diag_error.txt', err.message);
        console.error("Diagnostic failed:", err.message);
    } finally {
        await client.close();
        process.exit();
    }
}

deepDiag();
