import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  MessageCircle,
  Plane,
  User,
  Settings,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between text-white">

        {/* LEFT: LOGO */}
        <div
          className="text-xl font-semibold cursor-pointer"
          onClick={() => navigate("/app/dashboard")}
        >
          TravelX
        </div>

        {/* CENTER: SEARCH */}
        <input
          placeholder="Search destinations, trips, hotels..."
          className="hidden md:block w-1/3 px-4 py-2 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500"
        />

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-5">
          <ThemeToggle />
          <Icon onClick={() => navigate("/app/dashboard")} icon={<LayoutDashboard />} />
          <Icon onClick={() => navigate("/app/wishlist")} icon={<Heart />} />
          <Icon onClick={() => navigate("/app/chat")} icon={<MessageCircle />} />
          <Icon onClick={() => navigate("/app/mybookings")} icon={<Plane />} />
          <Icon onClick={() => navigate("/app/profile")} icon={<User />} />
          <Icon onClick={() => navigate("/app/settings")} icon={<Settings />} />
          <Icon onClick={() => alert("Logout")} icon={<LogOut />} />
        </div>
      </div>
    </header>
  );
}

const Icon = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-lg text-white hover:bg-white/20 transition"
  >
    {icon}
  </button>
);

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-white hover:bg-white/20 transition"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
