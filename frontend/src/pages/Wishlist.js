import { useEffect, useState } from "react";
import { Heart, Trash2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useNotification } from "../context/NotificationContext";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { success, error } = useNotification();

  // Mapping destinations from Destinations.js (In a real app, we'd fetch these from DB via ID)
  // For now, I'll fetch the array of IDs and map them to the mock data or a "get place by id" endpoint
  // Since place data is hardcoded in frontend for now, I will use that map.

  // TEMPORARY: Hardcoded map for demo (Ideally should be DB fetched)
  const placesMap = {
    "statue-of-unity": { name: "Statue of Unity", image: "https://images.unsplash.com/photo-1698226068341-cf199accf4ae?q=80&w=2670&auto=format&fit=crop", location: "Gujarat" },
    "rann-of-kutch": { name: "Rann of Kutch", image: "https://images.unsplash.com/photo-1603512396181-43e745f4924c?q=80&w=2574&auto=format&fit=crop", location: "Kutch" },
    "gir": { name: "Gir National Park", image: "https://images.unsplash.com/photo-1601369792039-30c14b31641f?q=80&w=2574&auto=format&fit=crop", location: "Junagadh" },
    "somnath": { name: "Somnath Temple", image: "https://images.unsplash.com/photo-1596541655077-b956a9e31505?q=80&w=2669&auto=format&fit=crop", location: "Veraval" },
    "dwarka": { name: "Dwarka", image: "https://images.unsplash.com/photo-1623348633857-7977a4194098?q=80&w=2574&auto=format&fit=crop", location: "Dwarka" },
    "saputara": { name: "Saputara", image: "https://images.unsplash.com/photo-1626079944062-7fca7e96bbf0?q=80&w=2574&auto=format&fit=crop", location: "Dang" },
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

  if (loading) return <div className="p-8 text-gray-500 dark:text-white">Loading wishlist...</div>;

  return (
    <div className="min-h-screen pt-6 px-4 md:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Wishlist ❤️</h1>

        {wishlist.length === 0 ? (
          <div className="text-gray-500 dark:text-white/60 text-center py-20 bg-gray-100 dark:bg-white/10 rounded-3xl backdrop-blur-md border border-gray-200 dark:border-white/5">
            <Heart size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Your wishlist is empty.</p>
            <button
              onClick={() => navigate("/app/destinations")}
              className="mt-4 px-6 py-2 bg-indigo-600 rounded-full text-white text-sm"
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wishlist.map(id => {
              const place = placesMap[id] || { name: "Unknown Place", image: "", location: "" };
              return (

                <div key={id} className="bg-white dark:bg-slate-800 backdrop-blur-xl rounded-3xl overflow-hidden group shadow-lg dark:shadow-none border border-gray-100 dark:border-white/5">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                      onClick={() => removeFromWishlist(id)}
                      className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-red-500 hover:bg-white hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{place.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-white/60 text-sm mt-1 mb-4">
                      <MapPin size={14} />
                      {place.location}
                    </div>
                    <button
                      onClick={() => navigate(`/app/destination/${id}`)}
                      className="w-full py-2 bg-indigo-600 rounded-xl text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
