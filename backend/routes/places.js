import express from "express";
import axios from "axios";

const router = express.Router();
const OPENTRIP_KEY = process.env.OPENTRIP_KEY;

/* SEARCH CITY → PLACES + HOTELS */
router.get("/search", async (req, res) => {
  const { city } = req.query;

  try {
    // 1️⃣ Get city coordinates
    const geo = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: city, format: "json", limit: 1 }
      }
    );

    if (!geo.data.length) {
      return res.status(404).json({ message: "City not found" });
    }

    const { lat, lon } = geo.data[0];

    // 2️⃣ Places to visit
    const places = await axios.get(
      "https://api.opentripmap.com/0.1/en/places/radius",
      {
        params: {
          lat,
          lon,
          radius: 15000,
          kinds: "interesting_places",
          limit: 6,
          apikey: OPENTRIP_KEY,
        },
      }
    );

    // 3️⃣ Hotels
    const hotels = await axios.get(
      "https://api.opentripmap.com/0.1/en/places/radius",
      {
        params: {
          lat,
          lon,
          radius: 15000,
          kinds: "accomodations",
          limit: 6,
          apikey: OPENTRIP_KEY,
        },
      }
    );

    res.json({
      city,
      places: places.data.features,
      hotels: hotels.data.features,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
