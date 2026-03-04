import { Plane, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function FlightStep({
  fromCity,
  destinationId,
  persons,
  onNext,
}) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await api.get("/flights");
        // Filter flights by fromCity and toCity
        const toCity = destinationId.replace(/-/g, " ").toLowerCase();
        const available = res.data.filter(f =>
          f.from.toLowerCase() === fromCity.toLowerCase() &&
          f.to.toLowerCase() === toCity
        );
        setFlights(available);
      } catch (err) {
        console.error("Error fetching flights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [fromCity, destinationId]);

  const toCityDisplay = destinationId.replace(/-/g, " ").toUpperCase();

  return (
    <div className="min-h-screen relative">

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 text-white">

        {/* HEADER CARD */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-10">
          <h2 className="text-3xl font-semibold mb-2">
            Select Your Flight
          </h2>
          <p className="text-white/70">
            {fromCity} → {toCityDisplay} • {persons} Traveller(s)
          </p>
        </div>

        {/* FLIGHTS */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center py-10 text-white/60">Searching Flights...</p>
          ) : flights.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center">
              <p className="text-xl font-semibold mb-2">No Flights Found</p>
              <p className="text-white/60 text-sm">We couldn't find any flights for {fromCity} → {toCityDisplay}.</p>
            </div>
          ) : (
            flights.map((f) => (
              <div
                key={f._id}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                {/* AIRLINE */}
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                    <Plane />
                  </div>
                  <div>
                    <p className="font-semibold">{f.airline}</p>
                    <p className="text-sm text-white/70">{f.code}</p>
                  </div>
                </div>

                {/* TIME */}
                <div className="text-center mb-4 md:mb-0">
                  <p className="text-lg font-semibold">
                    {f.time}
                  </p>
                  <p className="text-sm text-white/70 flex items-center justify-center gap-1">
                    <Clock size={14} /> {f.duration}
                  </p>
                </div>

                {/* PRICE */}
                <div className="text-right">
                  <p className="text-xl font-semibold">
                    ₹{f.price * persons}
                  </p>
                  <p className="text-xs text-white/60">
                    ₹{f.price} per person
                  </p>
                  <button
                    onClick={() => onNext(f)}
                    className="mt-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium"
                  >
                    Select Flight
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
