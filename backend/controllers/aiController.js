import Groq from "groq-sdk";

/* ─────────────────────────────────────────────
   GROQ AI CONTROLLER
   Real AI-powered travel assistant using Groq (Llama).
   Free tier: 30 req/min, 14,400 req/day.
   ───────────────────────────────────────────── */

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Model: Llama 3.3 70B — excellent quality, fast via Groq
const MODEL = "llama-3.3-70b-versatile";

// ─── System prompt for the travel chatbot ───
const TRAVEL_SYSTEM_PROMPT = `You are TripWell AI, the official virtual assistant for the TripWell travel platform. Your role is strictly restricted to helping users with the specific destinations, features, booking steps, pricing, payments, and troubleshooting steps related ONLY to this platform.

### RESTRICTED DESTINATIONS (Gujarat Only)
You must ONLY discuss, recommend, or plan trips for the following six destinations added to the TripWell project. Do NOT under any circumstances recommend or provide details/itineraries for other places (such as Goa, Delhi, Mumbai, Paris, Switzerland, etc.). If a user asks about another place, politely but firmly state that TripWell exclusively focuses on these six premium Gujarat destinations:
1. **Statue of Unity** (Location: Gujarat | Starting Price: ₹5,999 | Rating: 4.8 | World’s tallest statue on the Narmada river)
2. **Rann of Kutch** (Location: Kutch | Starting Price: ₹6,999 | Rating: 4.9 | White salt desert and home of the spectacular Rann Utsav)
3. **Gir National Park** (Location: Junagadh | Starting Price: ₹7,999 | Rating: 4.7 | The exclusive home of majestic Asiatic lions)
4. **Somnath Temple** (Location: Veraval | Starting Price: ₹4,999 | Rating: 4.9 | Highly sacred coastal Jyotirlinga temple)
5. **Dwarka** (Location: Dwarka | Starting Price: ₹4,999 | Rating: 4.8 | Ancient coastal kingdom of Lord Krishna)
6. **Saputara** (Location: Dang | Starting Price: ₹5,499 | Rating: 4.6 | Beautiful and refreshing hill station of Gujarat)

### PLATFORM BOOKING STEPS
Guide users on how to complete a booking on TripWell:
1. **Explore & Plan**: Browse destinations on the Dashboard, input your details (dates, starting city, number of people) in the Trip Planner, and generate your customized itinerary.
2. **Step 1 (Flights)**: Choose your preferred flight from your starting city to the destination.
3. **Step 2 & 3 (Hotels)**: Choose a hotel from the list and view hotel details.
4. **Step 4 (Traveler Details)**: Enter the traveler details (Name, Age, Gender, Passport/Govt ID) for each traveler.
5. **Step 5 (Payment)**: Pay securely via the integrated Razorpay Gateway to confirm the booking.

### PRICING FORMULA
Explain clearly how our booking prices are calculated:
* Total Price = (Flight Price per Person * Number of Persons) + (Hotel Price per Night * Number of Days) + ₹500 (Taxes & Processing Fees).

### PAYMENTS
* All payments are processed securely via the integrated Razorpay Payment Gateway.
* During checkout, your prefilled name and email will be passed to the payment gateway.
* You can complete your mock payment using Razorpay's test modal.

### TROUBLESHOOTING & COMMON ISSUES
* **Flights not loading/showing**: Make sure you have entered a starting city in the Trip Planner.
* **Payment loading or SDK failure**: Check your internet connection and ensure the Razorpay checkout script has loaded.
* **Booking not visible**: After successful payment, your confirmed booking instantly updates and is visible on your "My Bookings" page and user Dashboard.
* **"Trouble connecting" or "Not configured"**: This occurs if the GROQ_API_KEY is not defined in the backend server's .env file. The system administrator needs to add a valid Groq API key and restart the server.

### GENERAL RULES
- Keep responses warm, enthusiastic, concise, and structured with clear headings or bullet points.
- If asked about non-travel topics or destinations outside Gujarat, politely bring the conversation back to the 6 TripWell destinations.`;

// ─────────────────────────────────────────────
// 1. CHAT WITH AI (main chatbot)
// ─────────────────────────────────────────────
export const chatWithAI = async (req, res) => {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            success: false,
            error: "Message is required",
        });
    }

    try {
        // Build conversation history for multi-turn context
        const messages = [
            { role: "system", content: TRAVEL_SYSTEM_PROMPT },
        ];

        if (Array.isArray(history)) {
            for (const msg of history) {
                if (msg.role === "user" && msg.text) {
                    messages.push({ role: "user", content: msg.text });
                } else if (msg.role === "assistant" && msg.text) {
                    messages.push({ role: "assistant", content: msg.text });
                }
            }
        }

        // Add current message
        messages.push({ role: "user", content: message });

        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages,
            max_tokens: 1024,
            temperature: 0.8,
        });

        const response = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again!";

        res.status(200).json({
            success: true,
            data: { response },
        });
    } catch (err) {
        console.error("AI Chat Error:", err.message);

        if (err.message?.includes("API") || err.message?.includes("auth")) {
            return res.status(500).json({
                success: false,
                data: {
                    response:
                        "The AI service is not configured yet. Please add a valid GROQ_API_KEY to the server's .env file.",
                },
            });
        }

        res.status(500).json({
            success: false,
            data: {
                response:
                    "I'm having trouble connecting right now. Please try again in a moment! 🔄",
            },
        });
    }
};

// ─────────────────────────────────────────────
// 2. GENERATE TRIP PLAN
// ─────────────────────────────────────────────
export const generateTripPlan = async (req, res) => {
    const { destination, days, budget, type } = req.body;

    if (!destination || !days) {
        return res.status(400).json({
            success: false,
            error: "Destination and number of days are required",
        });
    }

    try {
        const prompt = `Create a detailed ${days}-day trip itinerary for ${destination}.
${budget ? `Budget: ${budget}` : ""}
${type ? `Trip type: ${type}` : ""}

Respond in this exact JSON format (no markdown, no code fences, just raw JSON):
{
  "destination": "${destination}",
  "days": ${days},
  "type": "${type || "General"}",
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1: [theme]",
      "activities": ["Morning: ...", "Afternoon: ...", "Evening: ..."]
    }
  ],
  "tips": ["tip1", "tip2"],
  "estimatedBudget": "₹X,XXX - ₹X,XXX per person"
}`;

        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: "You are a travel planning expert. Return ONLY valid JSON, no markdown formatting or code fences." },
                { role: "user", content: prompt },
            ],
            max_tokens: 2048,
            temperature: 0.7,
        });

        const text = (completion.choices[0]?.message?.content || "").trim();

        let data;
        try {
            const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            data = JSON.parse(cleaned);
        } catch {
            data = {
                destination,
                days,
                type: type || "General",
                itinerary: [{ day: 1, title: "Your Trip Plan", activities: [text] }],
                note: "Generated by TripWell AI",
            };
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("Trip Plan Error:", err.message);
        res.status(500).json({
            success: false,
            error: "Failed to generate trip plan. Please try again.",
        });
    }
};

// ─────────────────────────────────────────────
// 3. WEATHER SUMMARY
// ─────────────────────────────────────────────
export const getWeatherSummary = async (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({
            success: false,
            error: "Location is required",
        });
    }

    try {
        const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

        const prompt = `For a traveler planning to visit ${location} in ${currentMonth}:

1. What is the typical weather like?
2. What temperature range should they expect?
3. Any weather-related travel tips?

Respond in this exact JSON format (no markdown, no code fences, just raw JSON):
{
  "summary": "one paragraph travel weather summary",
  "temperature": "XX°C - XX°C",
  "condition": "e.g. Sunny & Pleasant"
}`;

        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: "You are a travel weather advisor. Return ONLY valid JSON, no markdown formatting or code fences." },
                { role: "user", content: prompt },
            ],
            max_tokens: 512,
            temperature: 0.5,
        });

        const text = (completion.choices[0]?.message?.content || "").trim();

        let data;
        try {
            const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            data = JSON.parse(cleaned);
        } catch {
            data = {
                summary: text,
                temperature: "N/A",
                condition: "Check local forecast",
            };
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("Weather Summary Error:", err.message);
        res.status(500).json({
            success: false,
            error: "Failed to get weather summary.",
        });
    }
};

// ─────────────────────────────────────────────
// 4. PACKING SUGGESTIONS
// ─────────────────────────────────────────────
export const getPackingSuggestions = async (req, res) => {
    const { destination, days, type } = req.body;

    if (!destination) {
        return res.status(400).json({
            success: false,
            error: "Destination is required",
        });
    }

    try {
        const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

        const prompt = `Create a packing list for a ${days || 3}-day ${type || "general"} trip to ${destination} in ${currentMonth}.

Respond in this exact JSON format (no markdown, no code fences, just raw JSON):
{
  "categories": {
    "Essentials": ["item1", "item2"],
    "Clothing": ["item1", "item2"],
    "Weather Specific": ["item1", "item2"],
    "Toiletries & Health": ["item1", "item2"],
    "Tech & Entertainment": ["item1", "item2"]
  }
}`;

        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: "You are a travel packing expert. Return ONLY valid JSON, no markdown formatting or code fences." },
                { role: "user", content: prompt },
            ],
            max_tokens: 1024,
            temperature: 0.6,
        });

        const text = (completion.choices[0]?.message?.content || "").trim();

        let data;
        try {
            const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            data = JSON.parse(cleaned);
        } catch {
            data = {
                categories: {
                    Essentials: ["ID Proofs", "Phone Charger", "First Aid Kit", "Cash/Cards"],
                    Clothing: ["Comfortable clothes for the weather"],
                    "Weather Specific": [text],
                },
            };
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("Packing Suggestions Error:", err.message);
        res.status(500).json({
            success: false,
            error: "Failed to generate packing suggestions.",
        });
    }
};
