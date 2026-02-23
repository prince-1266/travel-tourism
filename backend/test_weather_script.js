const axios = require("axios");

const testWeather = async (location) => {
    console.log(`Testing location: ${location}`);
    try {
        // 1. Geocoding
        console.log("1. Calling Nominatim...");
        const geoRes = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: { q: location, format: "json", limit: 1 },
                headers: { "User-Agent": "TripPlannerApp/1.0" }
            }
        );

        if (!geoRes.data.length) {
            console.error("❌ Location not found by Nominatim");
            return;
        }

        const { lat, lon, display_name } = geoRes.data[0];
        console.log(`✅ Found: ${display_name} (${lat}, ${lon})`);

        // 2. Weather
        console.log("2. Calling OpenMeteo...");
        const weatherRes = await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude: lat,
                longitude: lon,
                current: "temperature_2m",
            }
        });
        console.log(`✅ Weather Data: ${JSON.stringify(weatherRes.data.current)}`);

    } catch (err) {
        console.error("❌ Error:", err.message);
        if (err.response) {
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
        }
    }
};

testWeather("Statue of Unity");
testWeather("Rann of Kutch");
