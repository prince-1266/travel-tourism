import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-white px-6 pt-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-800/85 to-purple-900/90 z-0"></div>

      {/* GLOW ORBS - MORE PRONOUNCED */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-500 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse duration-10000 z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] opacity-40 mix-blend-screen z-0"></div>

      {/* MAIN CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl mx-auto w-full"
      >
        {/* PREMIUM MINIMALIST LOGO */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="mx-auto mb-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center justify-center cursor-pointer group hover:bg-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out z-0"></div>

          <img
            src={logo}
            alt="TripWell Logo"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain z-10 transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
        </motion.div>

        {/* TITLE */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1] drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          Travel & Tourism <br className="hidden md:block" /> Management
        </h1>

        {/* SUBTITLE */}
        <p className="text-lg md:text-2xl text-blue-100 mb-12 font-medium max-w-2xl mx-auto drop-shadow-md">
          Discover, Plan, and Book Your Dream Destinations
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(250, 204, 21, 0.4)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-indigo-950
                       rounded-full font-bold shadow-lg text-lg flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white
                       rounded-full font-bold shadow-lg text-lg flex items-center justify-center gap-2 relative overflow-hidden group border border-green-400/50"
          >
            <span className="relative z-10">Register</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </motion.button>
        </div>
      </motion.div>

      {/* FEATURES SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 mt-24 mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4"
      >
        <FeatureCard
          icon="�️"
          title="Explore Destinations"
          desc="Discover amazing places around the world"
          delay={0.6}
        />
        <FeatureCard
          icon="✈️"
          title="Easy Booking"
          desc="Book your trips with just a few clicks"
          delay={0.7}
        />
        <FeatureCard
          icon="�️"
          title="Secure Payments"
          desc="Your transactions are safe and secure"
          delay={0.8}
        />
      </motion.div>

    </div>
  );
}

/* FEATURE CARD COMPONENT */
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.8 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center
                 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)]
                 relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-white/10 transform group-hover:rotate-6 transition-transform duration-300">
        {icon}
      </div>

      <h3 className="text-xl font-bold mb-3 text-white tracking-wide">{title}</h3>
      <p className="text-blue-100/80 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
