import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, Compass, ShieldCheck, ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-white px-6 pt-20"
    >
      {/* LOCAL OVERLAY (Subtle for index-specific depth) */}
      <div className="absolute inset-0 bg-indigo-950/20 z-0"></div>

      {/* DYNAMIC GLOW ORBS */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] mix-blend-screen z-0"
      ></motion.div>
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[120px] mix-blend-screen z-0"
      ></motion.div>

      {/* MAIN CONTENT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-5xl mx-auto w-full"
      >
        {/* HERO TITLE */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-blue-200 drop-shadow-2xl"
        >
          Explore the <br className="hidden md:block" />
          <span className="text-yellow-400">Extraordinary</span>
        </motion.h1>

        {/* HERO SUBTITLE */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-3xl text-blue-100/90 mb-14 font-light max-w-3xl mx-auto leading-relaxed"
        >
          Embark on unforgettable journeys with our premium <br className="hidden md:block" />
          travel management experiences.
        </motion.p>

        {/* CASCADING BUTTONS */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="px-10 py-5 bg-white text-indigo-950 rounded-2xl font-bold shadow-2xl text-xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-yellow-400"
          >
            Get Started
            <ArrowRight className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/register")}
            className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold shadow-2xl text-xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/20"
          >
            Create Account
          </motion.button>
        </motion.div>

        {/* FEATURES GRID */}
        <motion.div
          variants={containerVariants}
          className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-blue-400" />}
            title="Global Reach"
            desc="Access to thousands of unique destinations across seven continents."
          />
          <FeatureCard
            icon={<Compass className="w-8 h-8 text-yellow-400" />}
            title="Tailored Planning"
            desc="Personalized itineraries crafted by experts to match your dreams."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
            title="Total Security"
            desc="Safe payments and 24/7 support throughout your entire journey."
          />
        </motion.div>
      </motion.div>

      {/* FOOTER DECORATION */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-950 to-transparent z-0 opacity-50"></div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="glass-glow p-10 text-center rounded-[2.5rem] border border-white/10 hover:border-white/30 transition-colors duration-500"
    >
      <div className="w-20 h-20 mx-auto bg-white/5 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{title}</h3>
      <p className="text-blue-100/60 text-base leading-relaxed font-normal">{desc}</p>
    </motion.div>
  );
}
