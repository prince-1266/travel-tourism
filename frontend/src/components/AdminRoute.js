import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNotification } from "../context/NotificationContext";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const { warning } = useNotification();

  const isAuthorized = token && user && user.role === "admin";

  useEffect(() => {
    if (!isAuthorized) {
      warning("Admin access required. Redirecting...");
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
