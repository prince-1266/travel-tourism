import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const results = {
            db: mongoose.connection.name,
            users: await mongoose.connection.db.collection("users").find({}).toArray(),
            admin_singular: await mongoose.connection.db.collection("admin").find({}).toArray()
        };
        fs.writeFileSync("checked_users.json", JSON.stringify(results, null, 2));
        console.log("Results written to checked_users.json");
        await mongoose.connection.close();
    } catch (err) {
        fs.writeFileSync("check_error.txt", err.stack);
    }
};

check();
