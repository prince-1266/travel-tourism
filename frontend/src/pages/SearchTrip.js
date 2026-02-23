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
    <div
      className="min-h-screen relative"
    >
      <div className="absolute inset-0 bg-indigo-900/30 dark:bg-slate-900/60 backdrop-blur-[1px]" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 py-10">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Search Destination
        </h1>
        <p className="text-center text-white/70 mb-8">
          Find cities, places & travel locations
        </p>

        {/* SEARCH BOX */}
        <div className="max-w-xl mx-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
                        rounded-2xl p-4 shadow mb-8">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city or place..."
              className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-5 rounded-xl
                         hover:bg-indigo-700 transition"
            >
              <Search />
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
        <div className="max-w-xl mx-auto space-y-4">
          {results.map((r, i) => (
            <div
              key={i}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl
                         p-4 shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400
                              rounded-xl flex items-center justify-center">
                <MapPin />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {r.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {r.country || "Location"}
                </p>
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
