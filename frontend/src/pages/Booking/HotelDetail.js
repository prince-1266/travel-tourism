import { Star, MapPin } from "lucide-react";

export default function HotelDetail({ hotel, onNext, onBack }) {
  if (!hotel) return null;

  return (
    <div className="min-h-screen relative">

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 text-white">

        {/* HEADER */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-10">
          <h2 className="text-3xl font-semibold">{hotel.name}</h2>

          <div className="flex items-center gap-2 text-yellow-400 mt-2">
            {Array.from({ length: hotel.rating }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>

          <p className="text-white/70 mt-2 flex items-center gap-1">
            <MapPin size={14} /> {hotel.location}
          </p>
        </div>

        {/* IMAGES */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`https://source.unsplash.com/600x40${i}/?hotel`}
              alt=""
              className="h-44 w-full object-cover rounded-2xl"
            />
          ))}
        </div>

        {/* FACILITIES */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Facilities</h3>
          <div className="flex flex-wrap gap-3">
            {hotel.facilities.map((f) => (
              <span
                key={f}
                className="px-3 py-1 bg-white/20 rounded-full text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* REVIEWS */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-10">
          <h3 className="text-xl font-semibold mb-4">Guest Reviews</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            <li>⭐ Great location and clean rooms</li>
            <li>⭐ Friendly staff and good food</li>
            <li>⭐ Worth the price</li>
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white/20 rounded-xl"
          >
            Back
          </button>

          <button
            onClick={onNext}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
