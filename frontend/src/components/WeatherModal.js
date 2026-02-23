import { X, Cloud, Sun, CloudRain, Wind, Droplets, Sunrise, Sunset } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WeatherModal({ isOpen, onClose, data }) {
    if (!isOpen || !data) return null;

    const { current, daily, hourly, location } = data;

    const getWeatherIcon = (code) => {
        if (code <= 3) return <Sun className="text-yellow-400" size={32} />;
        if (code <= 48) return <Cloud className="text-gray-400" size={32} />;
        if (code <= 82) return <CloudRain className="text-blue-400" size={32} />;
        return <Cloud className="text-gray-600" size={32} />;
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* BACKDROP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* MODAL */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    {/* HEADER */}
                    <div className="relative p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition">
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center mt-4">
                            <h2 className="text-2xl font-bold mb-1">{location}</h2>
                            <p className="text-white/80 text-sm mb-6">{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                            <div className="flex items-center gap-6">
                                <div className="text-6xl font-bold tracking-tighter">
                                    {Math.round(current.temp)}°
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    {getWeatherIcon(current.code)}
                                    <span className="text-lg font-medium">{getWmoDescription(current.code)}</span>
                                </div>
                            </div>

                            <div className="flex gap-8 mt-8 w-full justify-center">
                                <div className="flex flex-col items-center gap-1">
                                    <Wind size={20} className="text-blue-200" />
                                    <span className="text-sm font-semibold">{current.wind} km/h</span>
                                    <span className="text-xs text-blue-100">Wind</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Droplets size={20} className="text-blue-200" />
                                    <span className="text-sm font-semibold">{current.humidity}%</span>
                                    <span className="text-xs text-blue-100">Humidity</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HOURLY SCROLL */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Hourly Forecast</h3>
                        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                            {hourly.map((h, i) => (
                                <div key={i} className="flex flex-col items-center flex-shrink-0 gap-2 min-w-[60px]">
                                    <span className="text-xs text-gray-500 font-medium">{formatTime(h.time)}</span>
                                    <div className="my-1 scale-75">{getWeatherIcon(h.code)}</div>
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{Math.round(h.temp)}°</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DAILY LIST */}
                    <div className="p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">7-Day Forecast</h3>
                        <div className="space-y-4">
                            {daily.map((d, i) => (
                                <div key={i} className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-xl transition">
                                    <div className="w-24 font-medium text-gray-800 dark:text-gray-200">
                                        {i === 0 ? "Today" : formatDate(d.date)}
                                    </div>
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="scale-75">{getWeatherIcon(d.code)}</div>
                                        <span className="text-sm text-gray-500 hidden sm:block">{getWmoDescription(d.code)}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{Math.round(d.maxTemp)}°</span>
                                            <span className="text-gray-400">{Math.round(d.minTemp)}°</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}

// Helper to map WMO codes to text
function getWmoDescription(code) {
    const codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Dense Drizzle",
        61: "Slight Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        71: "Slight Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        95: "Thunderstorm",
        96: "Thunderstorm + Hail"
    };
    return codes[code] || "Variable";
}
