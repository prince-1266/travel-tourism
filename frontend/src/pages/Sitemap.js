import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Map, Info, Phone, LogIn, UserPlus, Globe, Package, Navigation } from "lucide-react";

export default function Sitemap() {
    const routes = [
        { name: "Home", path: "/", icon: <Globe size={20} /> },
        { name: "Destinations", path: "/destinations", icon: <Navigation size={20} /> },
        { name: "About Us", path: "/about", icon: <Info size={20} /> },
        { name: "Contact", path: "/contact", icon: <Phone size={20} /> },
        { name: "Travel Packages", path: "/packages", icon: <Package size={20} /> },
        { name: "Login", path: "/login", icon: <LogIn size={20} /> },
        { name: "Register", path: "/register", icon: <UserPlus size={20} /> },
        { name: "Privacy Policy", path: "/privacy", icon: <Map size={20} /> },
        { name: "Terms of Service", path: "/terms", icon: <Map size={20} /> },
    ];

    return (
        <div className="py-24 px-6 max-w-5xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-glow p-12 rounded-[3rem] border border-white/10"
            >
                <h1 className="text-5xl font-black mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                    Sitemap
                </h1>
                <p className="text-center text-blue-100/50 mb-16 text-lg font-medium">
                    Navigate quickly to any part of our premium travel platform.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {routes.map((route, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={route.path}
                                className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group"
                            >
                                <div className="bg-blue-600/20 p-3 rounded-xl text-blue-400 group-hover:text-blue-300 transition-colors">
                                    {route.icon}
                                </div>
                                <span className="text-xl font-bold tracking-tight group-hover:text-blue-200 transition-colors">
                                    {route.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
