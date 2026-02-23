import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Mail, Settings, Phone, Calendar, LogOut } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user: contextUser, logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const displayUser = user || contextUser;

  if (!displayUser) return <div className="text-white p-10">Loading profile...</div>;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT CARD (Identity) */}
          <div className="md:col-span-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 h-fit text-center shadow-xl">
            <div className="w-28 h-28 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-inner">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{displayUser.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 uppercase tracking-wider">{displayUser.role}</p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/app/settings")}
                className="w-full py-2.5 flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition"
              >
                <Settings size={18} /> Settings
              </button>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-full py-2.5 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* RIGHT CARD (Details) */}
          <div className="md:col-span-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Personal Details</h3>
              <button
                onClick={() => navigate("/app/settings")}
                className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Edit in Settings
              </button>
            </div>

            <div className="space-y-6">
              <InfoField
                icon={<User />}
                label="Full Name"
                value={displayUser.name}
              />
              <InfoField
                icon={<Mail />}
                label="Email Address"
                value={displayUser.email}
              />
              <InfoField
                icon={<Phone />}
                label="Phone Number"
                value={displayUser.phone}
              />
              <InfoField
                icon={<Calendar />}
                label="Member Since"
                value={new Date(displayUser.createdAt).toLocaleDateString()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 transition hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm">
    <div className="text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="font-semibold text-gray-800 dark:text-white text-lg">{value || "Not provided"}</p>
    </div>
  </div>
);
