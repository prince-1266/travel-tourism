import { NavLink } from "react-router-dom";
import { Home, Search, User, FileText } from "lucide-react";

const BottomNav = () => {
  const links = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/mybookings", icon: FileText, label: "Bookings" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t p-2 flex justify-around">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-primary" : "text-gray-400"
            }`
          }
        >
          <link.icon className="h-6 w-6" />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
