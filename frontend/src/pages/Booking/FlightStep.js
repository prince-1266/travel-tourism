import { Plane, Clock } from "lucide-react";

export default function FlightStep({
  fromCity,
  destinationId,
  persons,
  onNext,
}) {
  // Mock flight data
  const flights = [
    {
      id: 1,
      airline: "IndiGo",
      code: "6E‑203",
      depart: "06:30",
      arrive: "08:45",
      duration: "2h 15m",
      price: 3500,
    },
    {
      id: 2,
      airline: "Air India",
      code: "AI‑101",
      depart: "10:00",
      arrive: "12:30",
      duration: "2h 30m",
      price: 4200,
    },
    {
      id: 3,
      airline: "Vistara",
      code: "UK‑987",
      depart: "18:15",
      arrive: "20:25",
      duration: "2h 10m",
      price: 5100,
    },
  ];

  const toCity = destinationId.replace(/-/g, " ").toUpperCase();

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
            {fromCity} → {toCity} • {persons} Traveller(s)
          </p>
        </div>

        {/* FLIGHTS */}
        <div className="space-y-6">
          {flights.map((f) => (
            <div
              key={f.id}
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
                  {f.depart} → {f.arrive}
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
          ))}
        </div>

      </div>
    </div>
  );
}
