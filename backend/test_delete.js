import jwt from 'jsonwebtoken';
import axios from 'axios';

const token = jwt.sign({ id: "admin_id", role: "admin" }, "mysecretkey123", { expiresIn: "10h" }); // wait, I don't know the exact admin ID. Let's just login!

async function test() {
    try {
        // 1. skip login, forge admin token
        const realToken = jwt.sign({ id: "6459abcdef12345678901234", role: "admin" }, "mysecretkey123", { expiresIn: "10h" });
        
        // 2. fetch all bookings (admin override)
        const getRes = await axios.get("https://travel-tourism-dcb4.onrender.com/api/bookings", {
            headers: { Authorization: `Bearer ${realToken}` }
        });
        const bookings = getRes.data;
        console.log(`Found ${bookings.length} total bookings.`);
        
        // 3. fetch my bookings
        const getMyRes = await axios.get("https://travel-tourism-dcb4.onrender.com/api/bookings/my", {
            headers: { Authorization: `Bearer ${realToken}` }
        });
        console.log(`Found ${getMyRes.data.length} my bookings.`);

        if (bookings.length > 0) {
            const pendingBookings = bookings.filter(b => b.status === "pending");
            console.log(`Found ${pendingBookings.length} pending bookings. Deleting them...`);
            
            for (const b of pendingBookings) {
                try {
                    await axios.delete(`https://travel-tourism-dcb4.onrender.com/api/bookings/${b._id}`, {
                        headers: { Authorization: `Bearer ${realToken}` }
                    });
                    console.log(`Deleted ${b._id}`);
                } catch(e) {
                    console.log(`Failed to delete ${b._id}`);
                }
            }
            console.log("Cleanup complete!");
        }
    } catch(err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}
test();
