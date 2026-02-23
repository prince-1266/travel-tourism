import "dotenv/config";
import nodemailer from "nodemailer";

async function verifyEmail() {
    const email = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    console.log("\n--- Debugging Email Config ---");
    console.log("Email:", email ? email : "MISSING");
    console.log("Pass:", pass ? `${pass.substring(0, 2)}...${pass.substring(pass.length - 2)} (${pass.length} chars without spaces)` : "MISSING");

    if (!email || !pass) {
        console.error("❌ ERROR: Missing credentials in .env file");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: email,
            pass: pass,
        },
    });

    try {
        console.log("\nAttempting to verify connection...");
        await transporter.verify();
        console.log("✅ Connection Successful! Your credentials are correct.");

        console.log("Sending test email...");
        await transporter.sendMail({
            from: email,
            to: email,
            subject: "Test Email Works!",
            text: "If you see this, your backend email configuration is perfect."
        });
        console.log("✅ Test email sent to " + email);
    } catch (err) {
        console.error("\n❌ Connection Failed!");
        console.error("Error Code:", err.code);
        console.error("Message:", err.response || err.message);

        if (err.response && err.response.includes("535")) {
            console.log("\n💡 TIP: Verify that:");
            console.log("1. The email '" + email + "' matches the account used to generate the App Password.");
            console.log("2. You are using an 'App Password', NOT your login password.");
            console.log("3. You removed spaces from the App Password (if any).");
        }
    }
}

verifyEmail();
