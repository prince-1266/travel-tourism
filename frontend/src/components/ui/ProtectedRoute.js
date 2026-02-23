import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("loggedInUser");
  const { error } = useNotification();



  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
