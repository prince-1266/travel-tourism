import { useEffect, useState } from "react";
import { Heart, Trash2, MapPin, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useNotification } from "../context/NotificationContext";

import statueOfUnity from "../assets/statue_of_unity.png";
import rannOfKutch from "../assets/rann_of_kutch.png";
import gir from "../assets/gir.png";
import somnath from "../assets/somnath.png";
import dwarka from "../assets/dwarka.png";
import saputara from "../assets/saputara.png";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const placesMap = {
    "statue-of-unity": { name: "Statue of Unity", image: statueOfUnity, location: "Gujarat" },
    "rann-of-kutch": { name: "Rann of Kutch", image: rannOfKutch, location: "Kutch" },
    "gir": { name: "Gir National Park", image: gir, location: "Junagadh" },
    "somnath": { name: "Somnath Temple", image: somnath, location: "Veraval" },
    "dwarka": { name: "Dwarka", image: dwarka, location: "Dwarka" },
    "saputara": { name: "Saputara", image: saputara, location: "Dang" },
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(prev => prev.filter(item => item !== id));
      success("Removed from wishlist");
    } catch (err) {
      error("Failed to remove");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">
      Loading Collections...
    </div>
  );

  return (
    <div className="min-h-screen pt-6 px-4 md:px-8 pb-20 relative overflow-hidden">
      {/* DYNAMIC BACKGROUND GLOWS */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-left mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Sparkles size={12} className="text-yellow-400" />
            Curated Collection
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight drop-shadow-2xl leading-none flex items-center gap-3">
            My Wishlist <span className="text-rose-500 animate-pulse">❤️</span>
          </h1>
          <p className="mt-2 text-sm text-blue-100/50 font-medium tracking-tight max-w-lg">
            Your personal gallery of Gujarat's most extraordinary destinations.
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center glass-glow rounded-[4rem] p-20 border border-white/10 max-w-2xl mx-auto shadow-2xl"
            >
              <div className="text-[100px] mb-8 animate-bounce">🌊</div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
                No Treasures Found
              </h2>
              <p className="text-blue-100/50 font-bold mb-12 text-lg">
                Your heart is open for new adventures.<br />Start exploring the wonders of Gujarat.
              </p>
              <button
                onClick={() => navigate("/app/destinations")}
                className="px-12 py-6 bg-white text-indigo-950 font-black text-sm uppercase tracking-[0.2em] rounded-3xl hover:bg-yellow-400 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
              >
                Discover Places
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {wishlist.map(id => {
                const place = placesMap[id] || { name: "Unknown Place", image: "", location: "Gujarat" };
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={id}
                    className="group glass-glow rounded-[3rem] overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl hover:-translate-y-4"
                  >
                    <div className="h-72 overflow-hidden relative">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromWishlist(id); }}
                        className="absolute top-6 right-6 p-4 bg-black/20 backdrop-blur-xl rounded-2xl text-white hover:bg-rose-600 transition-all duration-300 shadow-xl border border-white/10 group/btn"
                      >
                        <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-blue-200 transition-colors">{place.name}</h3>
                      <div className="flex items-center gap-2 text-blue-100/30 font-bold mb-8 uppercase tracking-widest text-[10px]">
                        <MapPin size={16} className="text-indigo-400" />
                        {place.location}
                      </div>
                      <button
                        onClick={() => navigate(`/app/destination/${id}`)}
                        className="w-full py-5 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] group-hover:bg-white group-hover:text-indigo-950 transition-all duration-500 border border-white/10"
                      >
                        Explore Journal
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
