import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Clock, Filter, Search } from "lucide-react";
import api from "../api/axios";

export default function Flights() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await api.get("/flights");
                setFlights(res.data);
            } catch (err) {
                console.error("Error fetching flights:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, []);

    const filteredFlights = flights.filter(f =>
        f.airline.toLowerCase().includes(search.toLowerCase()) ||
        f.from.toLowerCase().includes(search.toLowerCase()) ||
        f.to.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black text-white text-center mb-6 uppercase tracking-tighter drop-shadow-2xl">
                    Available Flights
                </h1>
                <p className="text-center text-indigo-50 font-bold mb-16 uppercase tracking-[0.3em] opacity-80">
                    Global Connectivity at Your Fingertips
                </p>

                {/* SEARCH & FILTER */}
                <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 mb-12 border border-white/10 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                        <input
                            type="text"
                            placeholder="Search by airline, city, or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>
                    <button className="bg-white/10 text-white px-8 py-4 rounded-2xl border border-white/10 flex items-center gap-2 hover:bg-white/20 transition">
                        <Filter size={20} />
                        <span>Filters</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-white/60">Loading flights...</div>
                ) : filteredFlights.length === 0 ? (
                    <div className="text-center py-20 text-white/60">No flights available matching your search.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredFlights.map((f) => (
                            <motion.div
                                key={f._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl hover:-translate-y-2 transition-transform border border-gray-100"
                            >
                                {/* AIRLINE */}
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <Plane size={32} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-indigo-950 uppercase tracking-tight">{f.airline}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{f.code}</p>
                                    </div>
                                </div>

                                {/* ROUTE */}
                                <div className="flex items-center gap-12 text-center">
                                    <div>
                                        <p className="text-3xl font-black text-indigo-950 uppercase">{f.from}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Departure</p>
                                    </div>
                                    <div className="relative flex flex-col items-center min-w-[120px]">
                                        <div className="h-px w-full bg-gray-200 relative mb-2">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                                <Plane size={14} className="text-indigo-600" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{f.duration}</span>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-indigo-950 uppercase">{f.to}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Arrival</p>
                                    </div>
                                </div>

                                {/* DETAILS */}
                                <div className="flex flex-col items-center md:items-end">
                                    <div className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-2">
                                        <Clock size={16} />
                                        <span>{f.time}</span>
                                    </div>
                                    <div className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mb-4">
                                        {f.type} • {f.seats} Seats left
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">₹{f.price}</span>
                                        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
