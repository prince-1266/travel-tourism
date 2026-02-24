import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Map, Calendar, User, Settings, Home, Mountain, Heart, MessageSquare, Moon, Sun, ChevronDown, Lock, Trash2, Menu, X, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import Chatbot from "./Chatbot";

export default function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { info } = useNotification();
    const { theme, toggleTheme } = useTheme();

    // Profile Dropdown Open State
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    // Navigation Items
    const NavItems = [
        { icon: Map, label: "Destinations", path: "/app/dashboard" },
        { icon: Heart, label: "Wishlist", path: "/app/wishlist" },
        // { icon: MessageSquare, label: "Chat", action: "chat" }, // Chat is floating
        { icon: Calendar, label: "My Bookings", path: "/app/mybookings" },
    ];

    return (
        <div
            className={`min-h-screen bg-cover bg-center flex flex-col relative ${theme}`}
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
                backgroundAttachment: "fixed",
            }}
        >
            {/* BACKGROUND OVERLAY - Dark Mode aware via CSS or opacity adjustment if needed, 
                but user wanted same background. Using dark class on root affects contained elements. */}
            <div className={`absolute inset-0 z-0 ${theme === 'dark' ? 'bg-black/85' : 'bg-gradient-to-br from-indigo-950/90 via-blue-900/70 to-purple-950/90'}`} />

            {/* TOP NAVBAR */}
            <header className="relative z-50 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10">
                {/* BRANDING */}
                <div className="flex items-center gap-4">
                    {/* BACK BUTTON */}
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition backdrop-blur-md border border-white/10"
                        aria-label="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div onClick={() => navigate("/app/dashboard")} className="flex items-center gap-2 cursor-pointer group">
                        <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                            <Mountain className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">TripPlanner</h1>
                    </div>
                </div>

                {/* DESKTOP NAV (Right Side) */}
                <div className="hidden md:flex items-center gap-6">
                    {/* WIDGETS */}
                    {NavItems.filter(item => !(item.label === "Wishlist" && location.pathname.includes("destinations"))).map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl transition"
                        >
                            <item.icon size={20} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}

                    {/* CHAT BUTTON (If not floating, but user asked for floating + icon maybe?) 
                        User: "chatbot ... in that there should be all data" -> Wait, user listed chatbot with profile?
                        "then in right wishlist button, chatbot, mybbokings and profile" 
                        I'll add a chatbot button here that maybe opens the chat widget if it's minimized, 
                        but effectively the floating widget covers this. I'll add a trigger button for completeness.
                    */}

                    {/* PROFILE DROPDOWN */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full border border-white/10 transition"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                {user?.name?.[0] || "U"}
                            </div>
                            <span className="text-white font-medium text-sm hidden lg:block max-w-[100px] truncate">{user?.name}</span>
                            <ChevronDown className={`text-white/70 transition-transform ${profileOpen ? 'rotate-180' : ''}`} size={16} />
                        </button>

                        {/* DROPDOWN MENU */}
                        {profileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {/* USER INFO HEADER */}
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                    <p className="font-bold text-gray-900 dark:text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-2 inline-block">
                                        {user?.role}
                                    </span>
                                </div>

                                {/* MENU ITEMS */}
                                <div className="p-2 space-y-1">
                                    <MenuItem icon={Settings} label="Settings" onClick={() => navigate("/app/settings")} />

                                    <button
                                        onClick={toggleTheme}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm"
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


                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />

                                    <MenuItem icon={Trash2} label="Delete Account" onClick={() => navigate("/app/settings")} danger />
                                    <MenuItem icon={LogOut} label="Logout" onClick={handleLogout} danger />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-white p-2"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* MOBILE MENU OVERLAY (Simplified for now) */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 p-4 space-y-4">
                    {NavItems.filter(item => !(item.label === "Wishlist" && location.pathname.includes("destinations"))).map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                            className="flex items-center gap-3 w-full text-white/90 p-3 rounded-xl hover:bg-white/10"
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full text-red-400 p-3 rounded-xl hover:bg-white/10">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 relative z-10 overflow-y-auto w-full">
                {/* Removing p-4 padding to allow full-width hero sections if needed, can add container in pages */}
                <main className="">
                    <Outlet />
                </main>
            </div>

            {/* GLOBAL CHATBOT */}
            <Chatbot />
        </div>
    );
}

const MenuItem = ({ icon: Icon, label, onClick, danger }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium
            ${danger
                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
        `}
    >
        <Icon size={18} />
        {label}
    </button>
);
