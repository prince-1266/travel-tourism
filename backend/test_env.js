import "dotenv/config";
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("PASS_LENGTH:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "MISSING");
