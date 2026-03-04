import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Plane, LogOut } from "lucide-react";

import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [stats, setStats] = useState({ users: 0, bookings: 0, revenue: 0, flights: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const res = await api.get("/admin/stats");
        setStats({
          users: res.data.users,
          bookings: res.data.bookings,
          revenue: res.data.revenue,
          flights: res.data.flights
        });
        setRecentBookings(res.data.recentBookings || []);
        setRecentUsers(res.data.recentUsers || []);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.response?.data?.message || "Failed to fetch data from server");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md mx-auto">
        <p className="font-bold">Error Loading Stats</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Users" value={stats.users} />
          <StatCard label="Bookings" value={stats.bookings} />
          <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} />
          <StatCard label="Flights" value={stats.flights} />
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

        {/* RECENT ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600" />
              Recent Bookings
            </h3>
            <div className="space-y-3">
              {recentBookings.length > 0 ? recentBookings.map(b => (
                <div key={b._id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{b.destination}</p>
                    <p className="text-xs text-gray-500">{b.user?.name || "User"}</p>
                  </div>
                  <p className="font-bold text-indigo-600 text-sm">₹{b.totalPrice?.toLocaleString()}</p>
                </div>
              )) : <p className="text-gray-400 text-sm text-center py-4">No recent bookings</p>}
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-purple-600" />
              New Users
            </h3>
            <div className="space-y-3">
              {recentUsers.length > 0 ? recentUsers.map(u => (
                <div key={u._id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              )) : <p className="text-gray-400 text-sm text-center py-4">No recent users</p>}
            </div>
          </div>
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
