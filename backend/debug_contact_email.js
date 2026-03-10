import "dotenv/config";
import nodemailer from "nodemailer";

async function testContactEmail() {
    process.env.EMAIL_USER = "tripwell.support@gmail.com";
    process.env.EMAIL_PASS = "inbezrwobdoapxwj";

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "tripwell.support@gmail.com",
        subject: "Debug: Contact Notification Test",
        html: "<h3>This is a test notification</h3>",
    };

    try {
        console.log("Attempting to send email...");
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Email failed:", error);
    }
}

testContactEmail();
