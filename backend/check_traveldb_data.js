import "dotenv/config";
import mongoose from "mongoose";

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to:", mongoose.connection.name);

        const users = await mongoose.connection.db.collection("users").find({}).toArray();
        console.log("--- USERS COLLECTION ---");
        users.forEach(u => console.log(`- Email: ${u.email}, Role: ${u.role}, Phone: ${u.phone}`));

        const admins = await mongoose.connection.db.collection("admins").find({}).toArray();
        console.log("--- ADMINS COLLECTION (possible custom name) ---");
        admins.forEach(u => console.log(`- Email: ${u.email}, Role: ${u.role}`));

        const admin_col = await mongoose.connection.db.collection("admin").find({}).toArray();
        console.log("--- ADMIN COLLECTION (singular) ---");
        admin_col.forEach(u => console.log(`- Email: ${u.email || u.username}, Role: ${u.role}`));

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

check();
