import express from "express";
import axios from "axios";

const router = express.Router();

/* GET WEATHER FOR A LOCATION */
/* GET WEATHER FOR A LOCATION */
router.get("/", async (req, res) => {
    const { location, lat: qLat, lon: qLon } = req.query;

    if (!location && (!qLat || !qLon)) {
        return res.status(400).json({ message: "Location or coordinates are required" });
    }

    try {
        let lat, lon, display_name;

        // 1️⃣ Get Coordinates (Direct or Geocode)
        if (qLat && qLon) {
            lat = qLat;
            lon = qLon;
            display_name = location || "Custom Location";
        } else {
            // Geocoding fallback
            const geoRes = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: { q: location, format: "json", limit: 1 },
                    headers: { "User-Agent": "TripPlannerApp/1.0" }
                }
            );

            if (!geoRes.data.length) {
                return res.status(404).json({ message: "Location not found" });
            }

            lat = geoRes.data[0].lat;
            lon = geoRes.data[0].lon;
            display_name = geoRes.data[0].display_name;
        }

        // 2️⃣ Fetch Weather (OpenMeteo)
        // Fetching: Current weather, Hourly (24h), Daily (7 days)
        const weatherRes = await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude: lat,
                longitude: lon,
                current: "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m",
                hourly: "temperature_2m,weather_code,precipitation_probability",
                daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
                timezone: "auto",
                forecast_days: 7
            }
        });

        const data = weatherRes.data;

        res.json({
            success: true,
            location: display_name,
            current: {
                temp: data.current.temperature_2m,
                code: data.current.weather_code,
                humidity: data.current.relative_humidity_2m,
                wind: data.current.wind_speed_10m
            },
            daily: data.daily.time.map((date, i) => ({
                date,
                maxTemp: data.daily.temperature_2m_max[i],
                minTemp: data.daily.temperature_2m_min[i],
                code: data.daily.weather_code[i],
                sunrise: data.daily.sunrise[i],
                sunset: data.daily.sunset[i]
            })),
            hourly: data.hourly.time.slice(0, 24).map((time, i) => ({
                time,
                temp: data.hourly.temperature_2m[i],
                code: data.hourly.weather_code[i],
                precip: data.hourly.precipitation_probability[i]
            }))
        });

    } catch (err) {
        console.error("Weather API Error:", err.message);
        res.status(500).json({ message: "Failed to fetch weather data" });
    }
});

export default router;
