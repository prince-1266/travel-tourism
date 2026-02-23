import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Plane, LogOut } from "lucide-react";

import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [stats, setStats] = useState({ users: 0, bookings: 0, revenue: 0 });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  useEffect(() => {
    // Fetch real stats
    const fetchStats = async () => {
      try {
        const [usersRes, bookingsRes] = await Promise.all([
          api.get("/admin/users"), // Assume this route exists or we create it
          api.get("/bookings")
        ]);

        // Calculate revenue (mock logic if not in DB)
        const revenue = bookingsRes.data.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

        setStats({
          users: usersRes.data.length || 0,
          bookings: bookingsRes.data.length || 0,
          revenue
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl
                   backdrop-blur-2xl bg-white/80
                   shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                   p-8"
      >
        {/* HEADER Content inside the card */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage TripWell platform
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Users" value={stats.users} />
          <StatCard label="Bookings" value={stats.bookings} />
          <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} />
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ActionCard
            icon={<Users size={26} />}
            title="Manage Users"
            desc="View and control all users"
            onClick={() => navigate("/admin/users")}
          />

          <ActionCard
            icon={<BookOpen size={26} />}
            title="View Bookings"
            desc="All trip & booking details"
            onClick={() => navigate("/admin/bookings")}
          />

          <ActionCard
            icon={<Plane size={26} />}
            title="Add Flights"
            desc="Create or update flights"
            onClick={() => navigate("/admin/flights")}
          />
        </div>
      </motion.div>
    </div>
  );
};

/* ---------- Components ---------- */

const StatCard = ({ label, value }) => (
  <div
    className="bg-white/90 rounded-xl p-5
               shadow-md text-center"
  >
    <p className="text-sm text-gray-500">{label}</p>
    <h2 className="text-2xl font-bold text-gray-900 mt-1">
      {value}
    </h2>
  </div>
);

const ActionCard = ({ icon, title, desc, onClick }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="cursor-pointer bg-white/90
               rounded-2xl p-6 shadow-lg
               transition hover:shadow-xl"
  >
    <div className="w-14 h-14 flex items-center justify-center
                    bg-indigo-100 text-indigo-600
                    rounded-2xl mb-4">
      {icon}
    </div>

    <h3 className="text-lg font-semibold text-gray-900">
      {title}
    </h3>
    <p className="text-sm text-gray-600 mt-1">
      {desc}
    </p>
  </motion.div>
);

export default AdminDashboard;
