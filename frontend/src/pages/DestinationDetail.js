import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Calendar, MapPin } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import statueOfUnity from "../assets/statue_of_unity.png";
import rannOfKutch from "../assets/rann_of_kutch.png";
import gir from "../assets/gir.png";
import somnath from "../assets/somnath.png";
import dwarka from "../assets/dwarka.png";
import saputara from "../assets/saputara.png";

import WeatherModal from "../components/WeatherModal";

/* ================= DESTINATION DATA ================= */
const data = {
  "statue-of-unity": {
    title: "Statue of Unity",
    location: "Kevadia, Gujarat",
    lat: 21.8380,
    lon: 73.7191,
    description:
      "The world’s tallest statue, dedicated to Sardar Vallabhbhai Patel, located on the banks of the Narmada River.",
    bestTime: "October to March",
    reach: "Vadodara Airport (90 km)",
    images: [statueOfUnity],
    hotels: [
      {
        name: "Tent City Kevadia",
        type: "Luxury Tent Stay ⭐⭐⭐⭐",
        price: "₹8,000 – ₹12,000 / night",
        location: "Near Statue of Unity",
        note: "Best immersive cultural stay",
      },
      {
        name: "Unity Inn",
        type: "3‑Star Hotel ⭐⭐⭐",
        price: "₹3,000 – ₹5,000 / night",
        location: "Kevadia",
        note: "Comfortable & budget‑friendly",
      },
    ],
  },

  "rann-of-kutch": {
    title: "Rann of Kutch",
    location: "Kutch, Gujarat",
    lat: 23.777,
    lon: 70.370,
    description:
      "A vast white salt desert famous for Rann Utsav and cultural nights.",
    bestTime: "November to February",
    reach: "Bhuj Airport",
    images: [rannOfKutch],
    hotels: [
      {
        name: "Rann Utsav Tent City",
        type: "Luxury Cultural Stay ⭐⭐⭐⭐",
        price: "₹7,000 – ₹15,000 / night",
        location: "Dhordo Village",
        note: "Official Rann Utsav stay",
      },
    ],
  },

  gir: {
    title: "Gir National Park",
    location: "Sasan Gir, Gujarat",
    lat: 21.124,
    lon: 70.824,
    description:
      "The only natural habitat of Asiatic lions, famous for jungle safaris.",
    bestTime: "December to March",
    reach: "Junagadh",
    images: [gir],
    hotels: [
      {
        name: "The Fern Gir Forest Resort",
        type: "Eco Resort ⭐⭐⭐⭐",
        price: "₹6,000 – ₹9,000 / night",
        location: "Near Sasan Gir",
        note: "Ideal for safari travelers",
      },
    ],
  },

  somnath: {
    title: "Somnath Temple",
    location: "Somnath, Gujarat",
    lat: 20.888,
    lon: 70.401,
    description:
      "One of the 12 Jyotirlingas of Lord Shiva, located on the Arabian Sea coast.",
    bestTime: "October to March",
    reach: "Veraval",
    images: [somnath],
    hotels: [
      {
        name: "Sarovar Portico",
        type: "4‑Star Hotel ⭐⭐⭐⭐",
        price: "₹4,500 – ₹7,000 / night",
        location: "Near Temple",
        note: "Premium comfort for pilgrims",
      },
    ],
  },

  dwarka: {
    title: "Dwarka",
    location: "Dwarka, Gujarat",
    lat: 22.244,
    lon: 68.968,
    description:
      "One of the Char Dham pilgrimage sites and the kingdom of Lord Krishna.",
    bestTime: "October to March",
    reach: "Jamnagar Airport",
    images: [dwarka],
    hotels: [
      {
        name: "Dwarka Residency",
        type: "Government Hotel ⭐⭐⭐",
        price: "₹2,500 – ₹4,000 / night",
        location: "Near Temple",
        note: "Reliable & clean stay",
      },
    ],
  },

  saputara: {
    title: "Saputara",
    location: "Saputara, Gujarat",
    lat: 20.574,
    lon: 73.755,
    description:
      "The only hill station of Gujarat, famous for scenic views and lakes.",
    bestTime: "September to February",
    reach: "Waghai",
    images: [saputara],
    hotels: [
      {
        name: "Aakar Lords Inn",
        type: "3‑Star Hotel ⭐⭐⭐",
        price: "₹3,500 – ₹5,500 / night",
        location: "Saputara",
        note: "Comfortable hill‑view stay",
      },
    ],
  },
};

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { info } = useNotification();

  /* REAL WEATHER DATA */
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

  const place = data[id];

  const fetchWeather = async () => {
    if (!place?.title) return;
    setWeatherLoading(true);
    setWeatherError(false);
    try {
      let url = `/weather?location=${place.title}`;
      if (place.lat && place.lon) {
        url += `&lat=${place.lat}&lon=${place.lon}`;
      }
      const res = await api.get(url);
      setWeatherData(res.data);
    } catch (err) {
      console.error("Weather fetch failed", err);
      setWeatherError(true);
    } finally {
      setWeatherLoading(false);
    }
  };

  /* FETCH WEATHER ON MOUNT */
  useEffect(() => {
    fetchWeather();
  }, [place]);

  if (!place) return null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 px-6 py-14 max-w-6xl mx-auto text-gray-900 dark:text-white">

        {/* HEADER */}
        <div className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-3xl p-10 mb-10 shadow-xl dark:shadow-none">
          <h1 className="text-4xl font-semibold mb-4 text-gray-900 dark:text-white">{place.title}</h1>
          <p className="text-gray-600 dark:text-white/80">{place.description}</p>

          <div className="flex gap-8 mt-6 text-sm">
            <Info icon={<Calendar />} label="Best Time" value={place.bestTime} />
            <Info icon={<MapPin />} label="How to Reach" value={place.reach} />

            <div className="ml-4">
              {weatherLoading ? (
                <div className="bg-gray-100 dark:bg-white/10 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/70">Fetching Weather...</p>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-white/20 rounded mt-1"></div>
                  </div>
                </div>
              ) : weatherError ? (
                <button
                  onClick={() => fetchWeather()}
                  className="bg-red-500/20 hover:bg-red-500/30 p-3 rounded-xl flex items-center gap-3 transition"
                >
                  <span className="text-2xl">⚠️</span>
                  <div className="text-left">
                    <p className="text-xs text-red-200">Weather Unavailable</p>
                    <p className="font-bold text-xs">Retry?</p>
                  </div>
                </button>
              ) : weatherData ? (
                <button
                  onClick={() => setIsWeatherOpen(true)}
                  className="bg-gray-100 dark:bg-white/20 hover:bg-gray-200 dark:hover:bg-white/30 p-3 rounded-xl flex items-center gap-3 transition group"
                >
                  <div className="text-2xl">{getWeatherEmoji(weatherData.current.code)}</div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition">Live Weather</p>
                    <p className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                      {Math.round(weatherData.current.temp)}°C
                      <span className="font-normal text-gray-400 dark:text-white/80 text-xs">• Click for forecast</span>
                    </p>
                  </div>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {place.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="h-48 w-full object-cover rounded-2xl"
            />
          ))}
        </div>

        {/* HOTELS */}
        <div className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-3xl p-8 mb-10 shadow-xl dark:shadow-none">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Recommended Stays</h2>
          {place.hotels.map((h) => (
            <div key={h.name} className="mb-5">
              <h3 className="font-semibold text-gray-800 dark:text-white">{h.name}</h3>
              <p className="text-sm text-gray-500 dark:text-white/70">{h.type}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">📍 {h.location}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">💰 {h.price}</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-200">✔ {h.note}</p>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/app/plan/${id}`)}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold"
          >
            Plan Trip
          </button>


        </div>
      </div>
    </div>
  );
}

/* ================= INFO COMPONENT ================= */
const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-800/50 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 dark:text-white/60">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

function getWeatherEmoji(code) {
  if (code <= 3) return "☀️";
  if (code <= 48) return "☁️";
  if (code <= 82) return "🌧️";
  return "🌥️";
}
