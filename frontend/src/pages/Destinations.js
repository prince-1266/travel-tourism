import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import statueOfUnity from "../assets/statue_of_unity.png";
import rannOfKutch from "../assets/rann_of_kutch.png";
import gir from "../assets/gir.png";
import somnath from "../assets/somnath.png";
import dwarka from "../assets/dwarka.png";
import saputara from "../assets/saputara.png";

export default function Destinations() {
  const navigate = useNavigate();

  const destinations = [
    { id: "statue-of-unity", name: "Statue of Unity", desc: "World’s tallest statue on the Narmada river.", bestTime: "Oct – Mar", price: "₹5,999", image: "https://worldarchitecture.org/cdnimgfiles/extuploadc/amitdavereuters.jpg" },
    { id: "rann-of-kutch", name: "Rann of Kutch", desc: "White salt desert & Rann Utsav.", bestTime: "Nov – Feb", price: "₹6,999", image: "https://www.tripsavvy.com/thmb/Yh7C0nh6CKbB5BmhRz3il-V8sm8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-537000923-541774dbe2d44759815fdf0719b04685.jpg" },
    { id: "gir", name: "Gir National Park", desc: "Home of Asiatic lions.", bestTime: "Dec – Mar", price: "₹7,999", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-jEwfy9BunhxotonIJpxMvps5yzr3p5-6Zg&s" },
    { id: "somnath", name: "Somnath Temple", desc: "Sacred Jyotirlinga by the sea.", bestTime: "Oct – Mar", price: "₹4,999", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHA8YKr7J916iMpgceayRVrNob0EGpkC12kQ&s" },
    { id: "dwarka", name: "Dwarka", desc: "Kingdom of Lord Krishna.", bestTime: "Oct – Mar", price: "₹4,999", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTffaNX46taQIBHCP0WaWLkLwfPLGc-MuPXYw&s" },
    { id: "saputara", name: "Saputara", desc: "Hill station of Gujarat.", bestTime: "Sep – Feb", price: "₹5,499", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmnSl013sANafs9uzC1vpu9TgKsvsyd3GWBw&s" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-32 px-6">
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black mb-16 text-center text-white uppercase tracking-tighter drop-shadow-2xl">
          Explore Gujarat
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {destinations.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 group transition-all duration-500 hover:-translate-y-4"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tight mb-3">{d.name}</h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2">{d.desc}</p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 text-left uppercase">Starting From</span>
                    <span className="text-3xl font-black text-indigo-600 uppercase tracking-tighter">{d.price}</span>
                  </div>

                  <button
                    onClick={() => navigate("/login")}
                    className="p-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
