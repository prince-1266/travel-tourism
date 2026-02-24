import { useState } from "react";
import api from "../api/axios";
import { Search, MapPin } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

export default function SearchTrip() {
  const { success, error } = useNotification();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await api.get(`/location/search?q=${query}`);
      setResults(res.data);
      if (res.data.length > 0) {
        success(`Found ${res.data.length} destinations!`);
      } else {
        error("No results found. Try a different keyword.");
      }
    } catch {
      error("Failed to search. Please check your connection.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-32 px-6 shadow-inner">

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <h1 className="text-5xl md:text-7xl font-black text-white text-center mb-6 uppercase tracking-tighter drop-shadow-2xl">
          Global Search
        </h1>
        <p className="text-center text-indigo-50 font-bold mb-16 uppercase tracking-[0.3em] opacity-80">
          Sync with any destination in the network
        </p>

        {/* SEARCH BOX */}
        <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] mb-16 border border-gray-100">
          <div className="flex gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER DESTINATION CODE or NAME..."
              className="flex-1 p-5 rounded-2xl border border-gray-100 bg-gray-50 text-indigo-950 font-black placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-8 rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 transform active:scale-95"
            >
              <Search size={24} />
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-white/80">
            Searching...
          </p>
        )}

        {/* RESULTS */}
        <div className="max-w-2xl mx-auto space-y-6">
          {results.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center gap-6 border border-gray-100 hover:-translate-y-2 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <MapPin size={28} />
              </div>
              <div className="flex-1">
                <p className="text-xl font-black text-indigo-950 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                  {r.name}
                </p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                  {r.country || "Global Region"}
                </p>
              </div>
              <div className="text-indigo-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Select →
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {!loading && results.length === 0 && query && (
            <p className="text-center text-white/70 mt-10">
              No results found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
