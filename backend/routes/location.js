import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Search any location in India
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q
      )}&countrycodes=in&limit=8`,
      {
        headers: {
          "User-Agent": "travel-tour-project",
        },
      }
    );

    const data = await response.json();

    const results = data.map((place) => ({
      id: place.place_id,
      name: place.display_name,
      lat: place.lat,
      lng: place.lon,
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Location search failed" });
  }
});

export default router;
