import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/contact - Create a new contact message
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

        console.log(`[Contact] Received message from ${email}`);

        if (!firstName || !lastName || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newContact = new Contact({
            firstName,
            lastName,
            email,
            subject,
            message,
        });

        await newContact.save();

        // Create transporter only when needed to ensure process.env is ready
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "tripwell.support@gmail.com",
            subject: `New Contact Message: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4F46E5;">New TripWell Support Message</h2>
                    <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `,
        };

        try {
            console.log(`[Contact] Attempting to send notification to tripwell.support@gmail.com via ${process.env.EMAIL_USER}`);
            await transporter.sendMail(mailOptions);
            console.log("✅ [Contact] Notification email sent successfully.");
        } catch (emailError) {
            console.error("❌ [Contact] Email notification failed:", emailError.message);
        }

        res.status(201).json({ message: "Message sent successfully!", contact: newContact });
    } catch (error) {
        console.error("❌ [Contact] Server error:", error.message);
        res.status(500).json({ message: "Server error while saving message." });
    }
});

export default router;
