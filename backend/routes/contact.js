import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import axios from "axios";

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

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4F46E5;">New TripWell Support Message</h2>
                <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            </div>
        `;

        if (process.env.RESEND_API_KEY) {
            try {
                console.log(`[Contact] Attempting to send notification to tripwell.support@gmail.com via Resend...`);
                await axios.post("https://api.resend.com/emails", {
                    from: "TripWell Support <onboarding@resend.dev>",
                    to: "tripwell.support@gmail.com",
                    subject: `New Contact Message: ${subject}`,
                    html: htmlContent
                }, {
                    headers: {
                        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                });
                console.log("✅ [Contact] Notification email sent successfully via Resend.");
            } catch (emailError) {
                console.error("❌ [Contact] Resend notification failed:", emailError.response?.data || emailError.message);
            }
        } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Create transporter only when needed to ensure process.env is ready
            // and use short connection/socket timeouts (5s) to avoid hanging
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                connectionTimeout: 5000,
                greetingTimeout: 5000,
                socketTimeout: 5000,
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: "tripwell.support@gmail.com",
                subject: `New Contact Message: ${subject}`,
                html: htmlContent,
            };

            try {
                console.log(`[Contact] Attempting to send notification to tripwell.support@gmail.com via SMTP (${process.env.EMAIL_USER})...`);
                await transporter.sendMail(mailOptions);
                console.log("✅ [Contact] Notification email sent successfully via SMTP.");
            } catch (emailError) {
                console.error("❌ [Contact] SMTP notification failed:", emailError.message);
            }
        } else {
            console.log("[Contact] Email notification skipped: No email credentials or Resend API key configured.");
        }

        res.status(201).json({ message: "Message sent successfully!", contact: newContact });
    } catch (error) {
        console.error("❌ [Contact] Server error:", error.message);
        res.status(500).json({ message: "Server error while saving message." });
    }
});

export default router;
