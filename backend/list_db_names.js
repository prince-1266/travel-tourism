import { MongoClient } from 'mongodb';
import "dotenv/config";

async function listDbs() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const admin = client.db().admin();
        const result = await admin.listDatabases();
        console.log("DB_NAMES_START");
        result.databases.forEach(db => console.log(db.name));
        console.log("DB_NAMES_END");
    } catch (err) {
        console.error("LIST_ERROR:", err.message);
    } finally {
        await client.close();
        process.exit();
    }
}
listDbs();
