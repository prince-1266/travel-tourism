import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useState } from "react";
import { MapPin, Heart, Star, Tag } from "lucide-react";
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
    { id: "statue-of-unity", name: "Statue of Unity", location: "Gujarat", price: 5999, rating: 4.8, image: statueOfUnity, offer: "10% OFF", type: "monument" },
    { id: "rann-of-kutch", name: "Rann of Kutch", location: "Kutch", price: 6999, rating: 4.9, image: rannOfKutch, offer: "Early Bird", type: "nature" },
    { id: "gir", name: "Gir National Park", location: "Junagadh", price: 7999, rating: 4.7, image: gir, type: "wildlife" },
    { id: "somnath", name: "Somnath Temple", location: "Veraval", price: 4999, rating: 4.9, image: somnath, offer: "Family Deal", type: "temple" },
    { id: "dwarka", name: "Dwarka", location: "Dwarka", price: 4999, rating: 4.8, image: dwarka, type: "temple" },
    { id: "saputara", name: "Saputara", location: "Dang", price: 5499, rating: 4.6, image: saputara, offer: "Couple Pack", type: "hill" },
  ];

  const addToWishlist = (e, id) => {
    e.stopPropagation();
    api.post(`/wishlist/${id}`)
      .then(() => success("Added to Wishlist"))
      .catch(() => error("Failed to add to wishlist"));
  };

  return (
    <div className="min-h-screen pt-6 px-4 md:px-8 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Explore the World, {user?.name?.split(" ")[0]}! 🌍
          </h1>
          <p className="text-white/80">
            Discover the best deals and destinations for your next trip.
          </p>
        </div>

        {/* FILTERS (Optional simple tabs) */}
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          {['all', 'nature', 'temple', 'wildlife'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize
                        ${activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}
                    `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* PLACES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTrending
          .filter(p => activeTab === 'all' || p.type === activeTab)
          .map(place => (
            <div
              key={place.id}
              onClick={() => navigate(`/app/destination/${place.id}`)}
              className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* IMAGE AREA */}
              <div className="h-64 overflow-hidden relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                {/* TOP BADGES */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {place.offer && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Tag size={12} /> {place.offer}
                    </span>
                  )}
                  <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" /> {place.rating}
                  </span>
                </div>

                {/* WISHLIST BTN */}
                <button
                  onClick={(e) => addToWishlist(e, place.id)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition shadow-lg"
                >
                  <Heart size={20} />
                </button>

                {/* PRICE OVERLAY */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs opacity-90">Starting from</p>
                  <p className="text-2xl font-bold">₹{place.price.toLocaleString()}</p>
                </div>
              </div>

              {/* INFO CONTENT */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {place.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                  <MapPin size={16} className="text-indigo-500" />
                  {place.location}
                </div>

                <button className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-xl font-semibold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>

  );
}
