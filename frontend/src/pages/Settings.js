import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Lock, Bell, Moon, Sun,
  LogOut, ChevronRight, Shield,
  CreditCard, Trash2, Save, Mail,
  Phone, Loader, Settings as SettingsIcon,
  Globe, Landmark, Smartphone, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export default function Settings() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const { success, error: notifyError } = useNotification();

  const [activeTab, setActiveTab] = useState("profile"); // profile | notifications | security
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

  // OTP Reset State
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpStep, setOtpStep] = useState("init"); // init | verify
  const [otpData, setOtpData] = useState({ otp: "", newPassword: "", confirmPassword: "" });
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // OTP Timer Logic
  useEffect(() => {
    let timer;
    if (otpStep === "verify" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && otpStep === "verify") {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, otpStep]);

  /* ================= HANDLERS ================= */

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      // Use email as default identifier since user is logged in
      const res = await api.post("/auth/send-otp", {
        type: "reset",
        email: user.email
      });
      success(res.data.message || "OTP sent to your email.");
      setOtpStep("verify");
      setTimeLeft(60); // Start 60s countdown
      setCanResend(false);
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpReset = async (e) => {
    e.preventDefault();
    if (otpData.newPassword !== otpData.confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/verify-otp-reset", {
        email: user.email,
        otp: otpData.otp,
        newPassword: otpData.newPassword
      });
      success("Password updated successfully via OTP.");
      setIsOtpMode(false);
      setOtpStep("init");
      setOtpData({ otp: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/me", profileData);
      login(res.data.user);
      success("Profile updated successfully");
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

  const togglePreference = (key) => {
    // We only have notifications left for now
    success("Notification updated");
  };

  return (
    <div className="min-h-screen pt-6 px-4 md:px-8 pb-20 relative overflow-hidden">
      {/* DYNAMIC BACKGROUND GLOWS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-left mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <SettingsIcon size={12} className="text-yellow-400 animate-spin-slow" />
            Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight drop-shadow-2xl leading-none flex items-center gap-3">
            Settings <span className="text-indigo-400">⚙️</span>
          </h1>
          <p className="mt-2 text-sm text-blue-100/50 font-medium tracking-tight max-w-lg">
            Manage your account preferences, security, and travel experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR TABS */}
          <div className="lg:col-span-1 space-y-2">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User size={18} />} label="Profile" />
            <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell size={18} />} label="Alerts" />
            <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={<Shield size={18} />} label="Security" />

            <div className="pt-8 px-2">
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/10 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_35px_70px_-15px_rgba(0,0,0,0.1)] border border-gray-100 min-h-[500px]"
              >
                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                  <div className="space-y-10">
                    <SectionHeader title="Profile Information" subtitle="Update your personal details for a customized experience." icon={<User size={24} />} />
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Full Name" icon={<User size={16} />} value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                        <InputGroup label="Email" icon={<Mail size={16} />} type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                      </div>
                      <InputGroup label="Phone Number" icon={<Phone size={16} />} value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                      <div className="pt-6">
                        <SubmitButton loading={loading} label="Save Changes" />
                      </div>
                    </form>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="space-y-10">
                    <SectionHeader title="Notification Alerts" subtitle="Stay updated on your bookings and system alerts." icon={<Bell size={24} />} />
                    <div className="space-y-6">
                      <ToggleGroup label="Push Notifications" description="Receive alerts on your device for immediate booking updates." active={true} onClick={() => togglePreference("pushNotifications")} />
                      <ToggleGroup label="Email Updates" description="Weekly newsletters and transaction invoices sent to your inbox." active={true} onClick={() => togglePreference("emailUpdates")} />
                    </div>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                  <div className="space-y-10">
                    <SectionHeader
                      title={isOtpMode ? "OTP Password Reset" : "Account Security"}
                      subtitle={isOtpMode ? "Reset your password securely via OTP." : "Ensure your data stays private and secure."}
                      icon={<Shield size={24} />}
                    />

                    {!isOtpMode ? (
                      <form onSubmit={handlePasswordChange} className="space-y-6">
                        <InputGroup
                          label="Current Password"
                          type="password"
                          icon={<Lock size={16} />}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputGroup label="New Password" type="password" icon={<Lock size={16} />} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                          <InputGroup label="Confirm" type="password" icon={<Lock size={16} />} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                        </div>
                        <div className="pt-6 flex flex-col items-center gap-4">
                          <SubmitButton loading={loading} label="Secure Account" />
                          <button
                            type="button"
                            onClick={() => setIsOtpMode(true)}
                            className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 hover:underline uppercase tracking-widest transition-all"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        {otpStep === "init" ? (
                          <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 text-center">
                            <p className="text-sm font-bold text-indigo-950 mb-6">
                              Forgotten your current password? We'll send a 6-digit OTP to <span className="text-indigo-600">{user?.email}</span> to verify your identity.
                            </p>
                            <div className="flex gap-4 justify-center">
                              <button
                                onClick={() => setIsOtpMode(false)}
                                className="px-8 py-4 bg-white text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                              >
                                {loading && <Loader className="animate-spin" size={14} />}
                                Send Reset OTP
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleVerifyOtpReset} className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-end gap-6">
                              <div className="flex-grow">
                                <InputGroup
                                  label="Enter 6-digit OTP"
                                  icon={<Sparkles size={16} />}
                                  value={otpData.otp}
                                  onChange={(e) => setOtpData({ ...otpData, otp: e.target.value.slice(0, 6) })}
                                />
                              </div>
                              <div className="pb-2 md:pb-4 flex items-center justify-between md:justify-end gap-6 px-4">
                                {timeLeft > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                                    <span className="text-xs font-black text-indigo-950 tabular-nums">
                                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Expired</span>
                                )}
                                <button
                                  type="button"
                                  disabled={!canResend || loading}
                                  onClick={handleSendOtp}
                                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all
                                    ${canResend && !loading
                                      ? "text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                                      : "text-gray-300 cursor-not-allowed"}`}
                                >
                                  Resend OTP
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InputGroup label="New Password" type="password" icon={<Lock size={16} />} value={otpData.newPassword} onChange={(e) => setOtpData({ ...otpData, newPassword: e.target.value })} />
                              <InputGroup label="Confirm" type="password" icon={<Lock size={16} />} value={otpData.confirmPassword} onChange={(e) => setOtpData({ ...otpData, confirmPassword: e.target.value })} />
                            </div>
                            <div className="flex gap-4 pt-6">
                              <button
                                type="button"
                                onClick={() => setOtpStep("init")}
                                className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                              >
                                Back
                              </button>
                              <SubmitButton loading={loading} label="Verify & Reset" />
                            </div>
                          </form>
                        )}
                      </div>
                    )}

                    <div className="pt-10 border-t border-gray-100">
                      <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100">
                        <h4 className="text-rose-600 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Trash2 size={14} /> Danger Zone
                        </h4>
                        <p className="text-rose-400 text-[10px] font-bold leading-relaxed mb-6">
                          Account deletion is permanent. All your travel journals and bookings will be erased.
                        </p>
                        <button onClick={handleDeleteAccount} className="px-6 py-3 bg-white text-rose-600 border border-rose-200 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                          Deactivate Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest
      ${active ? "bg-white text-indigo-950 shadow-xl scale-[1.02]" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
    <span className={`${active ? 'text-indigo-600' : 'opacity-50'}`}>{icon}</span>
    {label}
  </button>
);

const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="flex items-start gap-4 mb-10">
    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">{icon}</div>
    <div>
      <h2 className="text-xl md:text-2xl font-black text-indigo-950 uppercase tracking-tight leading-tight">{title}</h2>
      <p className="text-xs text-gray-400 font-bold tracking-tight mt-1">{subtitle}</p>
    </div>
  </div>
);

const InputGroup = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors">{icon}</div>
      <input
        {...props}
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-indigo-950 text-sm font-black focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all placeholder:text-gray-300 shadow-inner"
        placeholder={`Enter ${label.toUpperCase()}`}
      />
    </div>
  </div>
);

const SelectionGroup = ({ label, icon, options, value, onChange }) => (
  <div className="space-y-3">
    <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
      {icon} {label}
    </label>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} className={`py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
          ${value === opt ? "bg-white text-indigo-950 shadow-lg" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const ToggleGroup = ({ label, description, active, onClick }) => (
  <div className="flex items-center justify-between p-7 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all cursor-pointer group" onClick={onClick}>
    <div className="pr-10">
      <h4 className="text-indigo-950 font-black text-xs uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">{label}</h4>
      <p className="text-[10px] text-gray-500 font-bold leading-tight">{description}</p>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${active ? "bg-indigo-600" : "bg-gray-200"}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${active ? "translate-x-6" : "translate-x-0"}`} />
    </div>
  </div>
);

const SubmitButton = ({ loading, label }) => (
  <button type="submit" disabled={loading} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all flex items-center gap-3 disabled:opacity-50">
    {loading ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
    {label}
  </button>
);
