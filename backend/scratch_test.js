import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Testing email configuration...");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set");

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: "bhavika7955@gmail.com",
  subject: "TripWell Registration Test OTP",
  html: "<h3>Your test OTP is: 123456</h3>"
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error occurred:", error.message);
  } else {
    console.log("Email sent successfully:", info.response);
  }
  process.exit();
});
