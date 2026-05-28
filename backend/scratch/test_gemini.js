import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "NONE");

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, respond with 1 word.");
        console.log(`✅ Success for ${modelName}:`, result.response.text().trim());
    } catch (err) {
        console.error(`❌ Error for ${modelName}:`, err.message);
    }
}

async function run() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-2.5-flash");
    await testModel("gemini-pro");
}

run();
