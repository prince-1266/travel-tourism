import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Settings, Mountain, Moon, Sun, ChevronDown, ArrowLeft, LayoutDashboard, Users, BookOpen, Plane } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect } from "react";

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { info } = useNotification();
    const { theme, toggleTheme } = useTheme();

    // Profile Dropdown Open State
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        info("Logged out successfully");
        navigate("/");
    };

    return (
        <div
            className={`min-h-screen flex flex-col relative ${theme} bg-theme-global transition-colors duration-500`}
        >
            {/* BACKGROUND OVERLAY */}
            <div className={`absolute inset-0 z-0 ${theme === 'dark' ? 'bg-black/90' : 'bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-blue-900/40'}`} />

            {/* TOP NAVBAR */}
            <header className="relative z-50 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-4">
                    {/* BACK BUTTON */}
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition backdrop-blur-md border border-white/10"
                        aria-label="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    {/* BRANDING */}
                    <div onClick={() => navigate("/admin")} className="flex items-center gap-2 cursor-pointer group">
                        <div className="bg-red-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                            <Mountain className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">TripPlanner Admin</h1>
                    </div>
                </div>

                {/* RIGHT SIDE CONTROLS */}
                <div className="flex items-center gap-6">

                    {/* PROFILE DROPDOWN */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-full transition shadow-lg shadow-red-900/20"
                        >
                            <User size={18} className="text-white/90" />
                            <span className="text-white font-semibold text-sm hidden lg:block max-w-[150px] truncate">{user?.name || "Admin"}</span>
                            <ChevronDown className={`text-white/70 transition-transform ${profileOpen ? 'rotate-180' : ''}`} size={16} />
                        </button>

                        {/* DROPDOWN MENU */}
                        {profileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                {/* USER INFO HEADER */}
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <p className="font-bold text-gray-900">Admin Account</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>

                                {/* MENU ITEMS */}
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={toggleTheme}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 transition text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                            <span className="font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                                        </div>
                                        {/* Toggle Switch Visual */}
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-4.5' : 'left-0.5'}`} style={{ left: theme === 'dark' ? '18px' : '2px' }} />
                                        </div>
                                    </button>

                                    <div className="h-px bg-gray-100 my-1" />

                                    <MenuItem icon={LogOut} label="Logout" onClick={handleLogout} danger />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 relative z-10 overflow-y-auto w-full p-6">
                <Outlet />
            </div>
        </div>
    );
}

const MenuItem = ({ icon: Icon, label, onClick, danger }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium
            ${danger
                ? 'text-red-600 hover:bg-red-50'
                : 'text-gray-700 hover:bg-gray-100'
            }
        `}
    >
        <Icon size={18} />
        {label}
    </button>
);
