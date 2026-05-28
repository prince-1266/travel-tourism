import axios from "axios";

const API_URL = "http://localhost:5001/api/ai/chat";

async function testQuery(message) {
    console.log(`\n-----------------------------------------`);
    console.log(`Sending Message: "${message}"`);
    try {
        const response = await axios.post(API_URL, {
            message: message,
            history: []
        });
        console.log("Response Status:", response.status);
        console.log("Response Data:\n", response.data.data?.response || response.data);
    } catch (error) {
        console.error("Error Status:", error.response?.status);
        console.error("Error Data:", error.response?.data || error.message);
    }
}

async function run() {
    // 1. Test a valid supported place
    await testQuery("Tell me about Somnath Temple and what are the highlights?");
    
    // 2. Test another valid supported place
    await testQuery("Can you suggest some places to explore near Statue of Unity?");

    // 3. Test an unsupported destination
    await testQuery("What can I do in Switzerland or Paris?");

    // 4. Test a general query unrelated to the destinations
    await testQuery("Write a quick python function to print hello world.");
}

run();
