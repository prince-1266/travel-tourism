import { createContext, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /* LOAD USER ON REFRESH */
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* LOGIN */
  const { success, info } = useNotification();

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    success(`Welcome back, ${userData.name || "Traveller"}!`);
  };

  /* LOGOUT */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    info("You have been logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* CUSTOM HOOK */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
