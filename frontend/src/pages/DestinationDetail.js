import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Calendar, MapPin, Compass, Sparkles } from "lucide-react";
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
    lat: 21.838,
    lon: 73.7191,
    description:
      "The world’s tallest statue, dedicated to Sardar Vallabhbhai Patel, located on the banks of the Narmada River.",
    bestTime: "October to March",
    reach: "Vadodara Airport (90 km)",
    images: [
      "https://worldarchitecture.org/cdnimgfiles/extuploadc/amitdavereuters.jpg",
      "https://i0.wp.com/www.opindia.com/wp-content/uploads/2018/10/statue-of-unity.jpg?resize=696%2C522&ssl=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-k24OGNBkTfRkbv6RvDtm-xrjXO1Ac09AJw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoMJK841X-EvR-Ldm3H2R0nSglxWAWlMePKQ&s"
    ],
    explore: [
      { name: "Valley of Flowers", detail: "A stunning 17km stretch of colorful blooms along the Narmada River." },
      { name: "Sardar Sarovar Dam", detail: "One of the world's largest gravity dams with a majestic panoramic view." },
      { name: "Unity Glow Garden", detail: "A magical theme park that creates a shimmering light fest every evening." }
    ],
    famous: [
      { trait: "World's Tallest", detail: "Standing at 182 meters, it's exactly double the height of Statue of Liberty." },
      { trait: "Laser Show", detail: "Features high-tech projection mapping narrating the life of Sardar Patel." }
    ]
  },

  "rann-of-kutch": {
    title: "Rann of Kutch",
    location: "Kutch, Gujarat",
    lat: 23.777,
    lon: 70.37,
    description:
      "A vast white salt desert famous for Rann Utsav and cultural nights.",
    bestTime: "November to February",
    reach: "Bhuj Airport",
    images: [
      "https://www.tripsavvy.com/thmb/Yh7C0nh6CKbB5BmhRz3il-V8sm8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-537000923-541774dbe2d44759815fdf0719b04685.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQPgvxcXHAuzDNcXvDGVcsf-GarnIb5tZOHQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsggeBLyqn2FmYzC0gNnY1PEUDSN320GFq8w&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeYxF_kyCPcjyv17HOCf-tev9J8GoBztzJLQ&s"
    ],
    explore: [
      { name: "White Desert", detail: "The centerpiece of Kutch, known for its surreal white saline crust." },
      { name: "Kalo Dungar", detail: "Highest point in Kutch offering a panoramic view of the Great Rann." },
      { name: "Hodka Village", detail: "Famous for traditional 'Bhungas' (mud houses) and intricate handicrafts." }
    ],
    famous: [
      { trait: "Rann Utsav", detail: "A 3-month long festival celebrating the culture, dance, and music of Kutch." },
      { trait: "Full Moon Night", detail: "The desert glows like silver under the moonlight, creating a divine view." }
    ]
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
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-jEwfy9BunhxotonIJpxMvps5yzr3p5-6Zg&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoASOQEPFoPSN6m7HsMCHxdx_bfUjCnrk6vA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYUQp2HmWKv0eYMwkDu_xR7a9CvTt17ZffEg&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVHfMlnHPIatcdX-QRH5goimLKJCciSNL7sA&s"
    ],
    explore: [
      { name: "Jungle Safari", detail: "Experience a jeep safari through the dense deciduous teak forest." },
      { name: "Devalia Safari Park", detail: "Gated area that ensures higher chances of spotting lions and leopards." },
      { name: "Jamjir Waterfall", detail: "A magnificent perpetual waterfall located in the heart of the forest." }
    ],
    famous: [
      { trait: "Asiatic Lions", detail: "The only place in the world where these majestic lions live in the wild." },
      { trait: "Maladhari Culture", detail: "Traditional forest-dwelling communities co-existing with the wild cats." }
    ]
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
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHA8YKr7J916iMpgceayRVrNob0EGpkC12kQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHiYu2hs8Khxg0_Ce2bfGAqztPgcb_GGgzBA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTegPZBiM0OXtltSEY6LvXqQ_vyJY1Vx_LyWw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc1HftRLhDDXf7yjR4Pqdb9sBX6XlxHmijfA&s"
    ],
    explore: [
      { name: "Main Dwelling", detail: "The stunning sea-facing architecture built in Chalukya style." },
      { name: "Triveni Sangam", detail: "Confluence of Hiran, Kapila, and Saraswati rivers before meeting the sea." },
      { name: "Prabhas Patan", detail: "Oldest town near the temple with rich archaeological and religious history." }
    ],
    famous: [
      { trait: "First Jyotirlinga", detail: "Known as the 'Shrine Eternal', it is the first of 12 sacred Shiva shrines." },
      { trait: "Light & Sound Show", detail: "Spectacular narration of the temple's history against the night sky." }
    ]
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
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTffaNX46taQIBHCP0WaWLkLwfPLGc-MuPXYw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsFIHymQxBLOyVsSIzCbWw8ZISzPX92RSviw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4zs1uayYVsT_pF0vpmeHh34TuJgykz8JTmg&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4Fd7u8LsHm06NvRO2yD-bt1ysAMNQ4OpYIg&s"
    ],
    explore: [
      { name: "Bet Dwarka", detail: "Reached by a fun ferry ride, believed to be the original home of Krishna." },
      { name: "Nageshwar Jyotirlinga", detail: "Features a giant 85-foot sitting Shiva statue, visible from afar." },
      { name: "Sudama Setu", detail: "Beautiful suspension bridge over the Gomti river with stunning views." }
    ],
    famous: [
      { trait: "Krishna's Kingdom", detail: "The main temple (Jagat Mandir) is over 2,500 years old." },
      { trait: "Flag Hoisting", detail: "Unique ritual where the massive temple flag is changed 5 times a day." }
    ]
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
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmnSl013sANafs9uzC1vpu9TgKsvsyd3GWBw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb2pXT41lplbIReWwZs25TXhXDwWYTIiKP-g&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl5H1S2q4Zq22yHDoN0efytEFNoyDXB3oo9g&s",
      "https://ik.imagekit.io/yd29mwkn4/images/uploads/packages/large/47488.jpg"
    ],
    explore: [
      { name: "Saputara Lake", detail: "Picturesque lake offering boating against a backdrop of rolling hills." },
      { name: "Sunset Point", detail: "Accessible by ropeway, offers a bird's-eye view of the Dang forest." },
      { name: "Gira Falls", detail: "Magnificent 75-feet tall seasonal waterfall located 49km away." }
    ],
    famous: [
      { trait: "Hill Retreat", detail: "The only high-altitude plateau in Gujarat with a pleasant climate year-round." },
      { trait: "Tribal Culture", detail: "Famous for Dang Darbar and traditional Warli painting workshops." }
    ]
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
    <div className="min-h-screen relative py-32 px-6">
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-[3rem] p-12 mb-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-gray-100">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-indigo-950 uppercase tracking-tighter drop-shadow-sm">{place.title}</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-4xl">{place.description}</p>

          <div className="flex gap-8 mt-6 text-sm">
            <Info icon={<Calendar />} label="Best Time" value={place.bestTime} />
            <Info icon={<MapPin />} label="How to Reach" value={place.reach} />

            <div className="ml-auto">
              {weatherLoading ? (
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 animate-pulse border border-gray-100">
                  <span className="text-3xl text-gray-300">⏳</span>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fetching Weather...</p>
                    <div className="h-5 w-24 bg-gray-200 rounded-md mt-1"></div>
                  </div>
                </div>
              ) : weatherError ? (
                <button
                  onClick={() => fetchWeather()}
                  className="bg-rose-50 hover:bg-rose-100 p-4 rounded-2xl flex items-center gap-4 transition border border-rose-100"
                >
                  <span className="text-3xl">⚠️</span>
                  <div className="text-left">
                    <p className="text-xs font-black text-rose-400 uppercase tracking-widest">Weather Error</p>
                    <p className="font-black text-rose-600 text-sm">RETRY?</p>
                  </div>
                </button>
              ) : weatherData ? (
                <button
                  onClick={() => setIsWeatherOpen(true)}
                  className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-2xl flex items-center gap-4 transition group border border-indigo-100"
                >
                  <div className="text-4xl">{getWeatherEmoji(weatherData.current.code)}</div>
                  <div className="text-left">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest group-hover:text-indigo-600 transition">Live Conditions</p>
                    <p className="font-black flex items-center gap-3 text-indigo-950 text-xl tracking-tighter">
                      {Math.round(weatherData.current.temp)}°C
                      <span className="font-bold text-indigo-300 text-xs tracking-normal">• FORECAST</span>
                    </p>
                  </div>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <h2 className="text-4xl font-black mb-8 text-white uppercase tracking-tight drop-shadow-lg">Photo Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {place.images.map((img, i) => (
            <div key={i} className="group overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white/10 bg-indigo-950/20 aspect-[4/3]">
              <img
                src={img}
                alt={`${place.title} ${i + 1}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80";
                }}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* DISCOVER LOCAL EXPERIENCES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

          {/* PLACES TO EXPLORE */}
          <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                <Compass size={32} />
              </div>
              <h2 className="text-4xl font-black text-indigo-950 uppercase tracking-tight">Places to Explore</h2>
            </div>

            <div className="space-y-8 flex-grow">
              {place.explore.map((item, i) => (
                <div key={i} className="group relative pl-10">
                  <div className="absolute left-0 top-1.5 w-6 h-6 bg-indigo-50 rounded-full border-2 border-indigo-200 transition-all group-hover:bg-indigo-600 group-hover:border-indigo-600" />
                  <h3 className="text-xl font-black text-indigo-950 mb-1 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed leading-snug">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAMOUS HIGHLIGHTS */}
          <div className="bg-indigo-950 rounded-[3.5rem] p-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-indigo-900 flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-yellow-400 text-indigo-950 rounded-2xl shadow-lg shadow-yellow-100/20">
                <Sparkles size={32} />
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tight">Famous Highlights</h2>
            </div>

            <div className="space-y-10 flex-grow">
              {place.famous.map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black text-yellow-400 uppercase tracking-[0.2em]">Signature</span>
                    <div className="h-px bg-white/20 flex-grow" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{item.trait}</h3>
                  <p className="text-indigo-100/60 font-medium text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(`/app/plan/${id}`)}
            className="px-16 py-6 bg-indigo-600 text-white text-2xl font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 uppercase tracking-widest transform hover:-translate-y-2 active:scale-95"
          >
            Start Planning Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= INFO COMPONENT ================= */
const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-5">
    <div className="text-indigo-600 bg-indigo-50 p-4 rounded-2xl shadow-sm border border-indigo-100">{icon}</div>
    <div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-black text-indigo-950 tracking-tight">{value}</p>
    </div>
  </div>
);

function getWeatherEmoji(code) {
  if (code <= 3) return "☀️";
  if (code <= 48) return "☁️";
  if (code <= 82) return "🌧️";
  return "🌥️";
}
