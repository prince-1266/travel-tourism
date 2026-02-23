import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import statueOfUnity from "../assets/statue_of_unity.png";
import rannOfKutch from "../assets/rann_of_kutch.png";
import gir from "../assets/gir.png";
import somnath from "../assets/somnath.png";
import dwarka from "../assets/dwarka.png";
import saputara from "../assets/saputara.png";

export default function Destinations() {
  const navigate = useNavigate();

  const destinations = [
    { id: "statue-of-unity", name: "Statue of Unity", desc: "World’s tallest statue on the Narmada river.", bestTime: "Oct – Mar", price: "₹5,999", image: statueOfUnity },
    { id: "rann-of-kutch", name: "Rann of Kutch", desc: "White salt desert & Rann Utsav.", bestTime: "Nov – Feb", price: "₹6,999", image: rannOfKutch },
    { id: "gir", name: "Gir National Park", desc: "Home of Asiatic lions.", bestTime: "Dec – Mar", price: "₹7,999", image: gir },
    { id: "somnath", name: "Somnath Temple", desc: "Sacred Jyotirlinga by the sea.", bestTime: "Oct – Mar", price: "₹4,999", image: somnath },
    { id: "dwarka", name: "Dwarka", desc: "Kingdom of Lord Krishna.", bestTime: "Oct – Mar", price: "₹4,999", image: dwarka },
    { id: "saputara", name: "Saputara", desc: "Hill station of Gujarat.", bestTime: "Sep – Feb", price: "₹5,499", image: saputara },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-800/85 to-purple-900/90 z-0" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-500 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse duration-10000 z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] opacity-40 mix-blend-screen z-0"></div>

      <div className="relative z-10 px-6 pt-32 pb-14 max-w-7xl mx-auto text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center drop-shadow-md tracking-tight">
          Explore Gujarat Destinations
        </h1>

        <div className="space-y-16">
          {destinations.map((d) => (
            <div key={d.id} className="relative rounded-3xl overflow-hidden">
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Call API to add
                  import("../api/axios").then(module => {
                    const api = module.default;
                    api.post(`/wishlist/${d.id}`)
                      .then(() => alert("Added to Wishlist! ❤️"))
                      .catch(() => alert("Failed to add"));
                  });
                }}
                className="absolute top-6 right-6 p-3 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition shadow-lg z-20"
              >
                <Heart size={24} />
              </button>

              <div className="absolute bottom-0 p-8 max-w-2xl">
                <h2 className="text-4xl font-semibold">{d.name}</h2>
                <p className="text-white/80 mt-2">{d.desc}</p>

                <div className="flex gap-6 mt-3 text-sm text-white/70">
                  <span>Best time: {d.bestTime}</span>
                  <span>From {d.price}</span>
                </div>

                <button
                  onClick={() => navigate(`/destination/${d.id}`)}
                  className="mt-5 px-8 py-3 bg-white text-black rounded-full font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
