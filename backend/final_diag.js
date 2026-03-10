import { MongoClient } from 'mongodb';
import "dotenv/config";

async function finalDiag() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const dbs = await client.db().admin().listDatabases();
        console.log("--- DATABASES ---");
        dbs.databases.forEach(db => console.log(`- ${db.name}`));

        const dbName = process.env.MONGO_URI.split('/').pop().split('?')[0] || "traveldb";
        const db = client.db(dbName);
        console.log(`\n--- COLLECTIONS IN ${dbName} ---`);
        const collections = await db.listCollections().toArray();
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} docs`);
            if (col.name === 'users' || col.name === 'admin' || col.name === 'admins') {
                const users = await db.collection(col.name).find({}).toArray();
                users.forEach(u => {
                    console.log(`  [USER] Email: ${u.email}, Phone: ${u.phone}, Role: ${u.role}, Name: ${u.name}`);
                });
            }
        }

    } catch (err) {
        console.error("DIAGNOSTIC ERROR:", err.message);
    } finally {
        await client.close();
        process.exit();
    }
}

finalDiag();
