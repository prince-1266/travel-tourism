import { useEffect, useState } from "react";
import api from "../api/api";
import useDebounce from "../hooks/useDebounce";
import { MapPin } from "lucide-react";

const LocationSearch = ({ label, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const fetchLocations = async () => {
      const res = await api.get(
        `/location/search?q=${debouncedQuery}`
      );
      setResults(res.data);
    };

    fetchLocations();
  }, [debouncedQuery]);

  return (
    <div className="relative">
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Enter ${label}`}
        className="w-full h-12 px-4 rounded-xl border outline-none"
      />

      {results.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden">
          {results.map((place) => (
            <button
              key={place.id}
              onClick={() => {
                onSelect(place);
                setQuery(place.name);
                setResults([]);
              }}
              className="w-full px-4 py-3 flex items-center gap-2
                         hover:bg-gray-100 text-left"
            >
              <MapPin size={16} />
              <span className="text-sm">{place.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
