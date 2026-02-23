
const fs = require('fs');
const src = "C:\\Users\\m\\.gemini\\antigravity\\brain\\b6f2424f-4152-4405-ba92-617902928a11\\uploaded_media_1769682405918.png";
const dest = "c:\\Users\\m\\OneDrive\\Desktop\\travel and tour\\frontend\\src\\assets\\app-bg.png";

try {
    fs.copyFileSync(src, dest);
    console.log("Success: Image copied");
} catch (e) {
    console.error("Error copying file:", e);
}
