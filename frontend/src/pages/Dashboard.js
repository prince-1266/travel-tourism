import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useState } from "react";
import { MapPin, Heart, Star, Tag, Sparkles } from "lucide-react";
import api from "../api/axios";
import statueOfUnity from "../assets/statue_of_unity.png";
import rannOfKutch from "../assets/rann_of_kutch.png";
import gir from "../assets/gir.png";
import somnath from "../assets/somnath.png";
import dwarka from "../assets/dwarka.png";
import saputara from "../assets/saputara.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [activeTab, setActiveTab] = useState("all");

  // Mock Data for "All Places" (In real app, this comes from /api/places)
  const mockTrending = [
    { id: "statue-of-unity", name: "Statue of Unity", location: "Gujarat", price: 5999, rating: 4.8, image: "https://worldarchitecture.org/cdnimgfiles/extuploadc/amitdavereuters.jpg", offer: "10% OFF", type: "monument" },
    { id: "rann-of-kutch", name: "Rann of Kutch", location: "Kutch", price: 6999, rating: 4.9, image: "https://www.tripsavvy.com/thmb/Yh7C0nh6CKbB5BmhRz3il-V8sm8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-537000923-541774dbe2d44759815fdf0719b04685.jpg", offer: "Early Bird", type: "nature" },
    { id: "gir", name: "Gir National Park", location: "Junagadh", price: 7999, rating: 4.7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-jEwfy9BunhxotonIJpxMvps5yzr3p5-6Zg&s", type: "wildlife" },
    { id: "somnath", name: "Somnath Temple", location: "Veraval", price: 4999, rating: 4.9, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHA8YKr7J916iMpgceayRVrNob0EGpkC12kQ&s", offer: "Family Deal", type: "temple" },
    { id: "dwarka", name: "Dwarka", location: "Dwarka", price: 4999, rating: 4.8, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTffaNX46taQIBHCP0WaWLkLwfPLGc-MuPXYw&s", type: "temple" },
    { id: "saputara", name: "Saputara", location: "Dang", price: 5499, rating: 4.6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmnSl013sANafs9uzC1vpu9TgKsvsyd3GWBw&s", offer: "Couple Pack", type: "nature" },
  ];

  const addToWishlist = (e, id) => {
    e.stopPropagation();
    api.post(`/wishlist/${id}`)
      .then(() => success("Added to Wishlist"))
      .catch(() => error("Failed to add to wishlist"));
  };

  return (
    <div className="min-h-screen pt-6 px-4 md:px-8 pb-20 relative overflow-hidden">
      {/* DYNAMIC BACKGROUND GLOWS (Premium but non-intrusive) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      {/* HEADER SECTION - HYBRID DESIGN */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl md:text-3xl font-black text-white mb-1 uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
              Welcome Back,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-blue-200">
                {user?.name?.split(" ")[0]}! ✈️
              </span>
            </h1>
            <p className="text-sm text-blue-100/60 font-medium tracking-tight">
              Where would you like to explore today?
            </p>
          </motion.div>
        </div>

        {/* ORIGINAL FILTERS RESTORED */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 bg-white p-2 rounded-2xl shadow-2xl border border-gray-100"
        >
          {['all', 'nature', 'temple', 'wildlife'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-xs font-black transition-all capitalize tracking-widest
                        ${activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}
                    `}
            >
              {tab}
            </button>
          ))}
        </motion.div>
      </div>

      {/* PLACES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {mockTrending
          .filter(p => activeTab === 'all' || p.type === activeTab)
          .map(place => (
            <div
              key={place.id}
              onClick={() => navigate(`/app/destination/${place.id}`)}
              className="group bg-white rounded-[2.5rem] overflow-hidden cursor-pointer shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 hover:-translate-y-4 transition-all duration-500"
            >
              {/* IMAGE AREA */}
              <div className="h-72 overflow-hidden relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* TOP BADGES */}
                <div className="absolute top-6 left-6 flex gap-3">
                  {place.offer && (
                    <span className="bg-rose-600 text-white text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-1 shadow-lg uppercase tracking-widest">
                      <Tag size={12} /> {place.offer}
                    </span>
                  )}
                  <span className="bg-white/95 backdrop-blur-sm text-indigo-950 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-1 shadow-lg tracking-widest">
                    <Star size={12} className="text-amber-400 fill-amber-400" /> {place.rating}
                  </span>
                </div>

                {/* WISHLIST BTN */}
                <button
                  onClick={(e) => addToWishlist(e, place.id)}
                  className="absolute top-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-rose-600 transition shadow-lg z-20 border border-white/30"
                >
                  <Heart size={20} className="fill-current" />
                </button>

                {/* PRICE OVERLAY */}
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Starting from</p>
                  <p className="text-3xl font-black tracking-tighter">₹{place.price.toLocaleString()}</p>
                </div>
              </div>

              {/* INFO CONTENT */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                    {place.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-gray-500 font-bold mb-8">
                  <MapPin size={18} className="text-indigo-600" />
                  {place.location}
                </div>

                <button className="w-full py-5 bg-gray-50 text-indigo-950 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 border border-gray-100 group-hover:border-indigo-600">
                  Quick View
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>

  );
}
