import { BedDouble, MapPin, Star } from "lucide-react";

export default function HotelStep({ days, persons, onNext, onBack }) {
  // Mock hotel data (real-app style)
  const hotels = [
    {
      id: 1,
      name: "Budget Inn Residency",
      rating: 3,
      location: "City Center",
      price: 2200,
      facilities: ["Free Wi‑Fi", "AC", "Room Service"],
    },
    {
      id: 2,
      name: "Comfort Suites",
      rating: 4,
      location: "Near Tourist Area",
      price: 3800,
      facilities: ["Breakfast Included", "AC", "Parking", "Wi‑Fi"],
    },
    {
      id: 3,
      name: "Luxury Palace Hotel",
      rating: 5,
      location: "Premium Location",
      price: 6200,
      facilities: ["Pool", "Spa", "Breakfast", "Gym", "Wi‑Fi"],
    },
  ];

  return (
    <div className="min-h-screen relative">

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 text-white">

        {/* HEADER */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-10">
          <h2 className="text-3xl font-semibold mb-2">
            Choose Your Stay
          </h2>
          <p className="text-white/70">
            {days} Night(s) • {persons} Traveller(s)
          </p>
        </div>

        {/* HOTEL LIST */}
        <div className="space-y-6">
          {hotels.map((h) => (
            <div
              key={h.id}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              {/* LEFT: HOTEL INFO */}
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                  <BedDouble />
                </div>

                <div>
                  <p className="font-semibold text-lg">{h.name}</p>

                  {/* RATING */}
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    {Array.from({ length: h.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>

                  {/* LOCATION */}
                  <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {h.location}
                  </p>

                  {/* FACILITIES */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {h.facilities.map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-white/20 px-2 py-1 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: PRICE */}
              <div className="text-right">
                <p className="text-xl font-semibold">
                  ₹{h.price * days}
                </p>
                <p className="text-xs text-white/60">
                  ₹{h.price} / night
                </p>

                <button
                  onClick={() => onNext(h)}
                  className="mt-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium"
                >
                  Select Hotel
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div className="mt-10">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white/20 rounded-xl"
          >
            Back to Flights
          </button>
        </div>
      </div>
    </div>
  );
}
