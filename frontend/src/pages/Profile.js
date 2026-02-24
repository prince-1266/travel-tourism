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
    <div className="min-h-screen py-32 px-4 shadow-inner">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-12 uppercase tracking-tighter drop-shadow-2xl text-center">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT CARD (Identity) */}
          <div className="md:col-span-1 bg-white rounded-[3rem] p-10 h-fit text-center shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-gray-100">
            <div className="w-32 h-32 mx-auto rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 border-2 border-indigo-100 shadow-inner">
              <User size={64} />
            </div>
            <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tight">{displayUser.name}</h2>
            <p className="text-xs text-gray-400 font-black mb-10 uppercase tracking-[0.2em] mt-2">{displayUser.role || "Traveler"}</p>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/app/settings")}
                className="w-full py-4 flex items-center justify-center gap-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition border border-indigo-100"
              >
                <Settings size={20} /> Settings
              </button>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-full py-4 flex items-center justify-center gap-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition border border-rose-100"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>

          {/* RIGHT CARD (Details) */}
          <div className="md:col-span-2 bg-white rounded-[3rem] p-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-gray-100">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-50">
              <h3 className="text-3xl font-black text-indigo-950 uppercase tracking-tight">Personal Details</h3>
              <button
                onClick={() => navigate("/app/settings")}
                className="text-xs text-indigo-400 font-black uppercase tracking-widest hover:text-indigo-600 transition"
              >
                EDIT PROFILE
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
  <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 transition hover:bg-indigo-50/50 hover:border-indigo-100 group">
    <div className="text-indigo-600 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="font-black text-indigo-950 text-xl tracking-tight">{value || "Not provided"}</p>
    </div>
  </div>
);
