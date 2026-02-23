import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// POST /api/contact - Create a new contact message
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

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

        res.status(201).json({ message: "Message sent successfully!", contact: newContact });
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).json({ message: "Server error while saving message." });
    }
});

export default router;
