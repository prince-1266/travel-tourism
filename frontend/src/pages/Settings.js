import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Bell, Moon, LogOut, ChevronRight, Shield, CreditCard, Trash2, Save, Mail, Phone, Loader } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export default function Settings() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const { success, error: notifyError } = useNotification();

  const [activeTab, setActiveTab] = useState("profile"); // profile | security
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= HANDLERS ================= */

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/me", profileData);
      login(res.data.user); // Update context
      success(res.data.message || "Profile updated successfully");
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notifyError("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.put("/auth/me/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success(res.data.message);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;

    try {
      await api.delete("/auth/me");
      logout();
      navigate("/");
      success("Account deleted successfully");
    } catch (err) {
      notifyError("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SIDEBAR TABS */}
          <div className="md:col-span-1 space-y-2">
            <TabButton
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              icon={<User size={18} />}
              label="Edit Profile"
            />
            <TabButton
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
              icon={<Shield size={18} />}
              label="Security & Privacy"
            />
          </div>

          {/* CONTENT AREA */}
          <div className="md:col-span-3">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl min-h-[500px]">

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <User className="text-indigo-600 dark:text-indigo-400" /> Public Profile
                  </h2>

                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <InputGroup
                      label="Full Name"
                      icon={<User size={18} />}
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                    <InputGroup
                      label="Email Address"
                      icon={<Mail size={18} />}
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                    <InputGroup
                      label="Phone Number"
                      icon={<Phone size={18} />}
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Lock className="text-indigo-600 dark:text-indigo-400" /> Security
                  </h2>

                  <form onSubmit={handlePasswordChange} className="space-y-5 mb-10">
                    <InputGroup
                      label="Current Password"
                      type="password"
                      icon={<Lock size={18} />}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                    <InputGroup
                      label="New Password"
                      type="password"
                      icon={<Lock size={18} />}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <InputGroup
                      label="Confirm New Password"
                      type="password"
                      icon={<Lock size={18} />}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        Update Password
                      </button>
                    </div>
                  </form>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h3 className="text-red-600 dark:text-red-400 font-bold mb-2 flex items-center gap-2">
                      <Trash2 size={20} /> Danger Zone
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition border border-red-100 dark:border-red-900/30"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-left
      ${active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
        : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white"
      }
    `}
  >
    {icon}
    {label}
  </button>
);

const InputGroup = ({ label, icon, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition"
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  </div>
);
