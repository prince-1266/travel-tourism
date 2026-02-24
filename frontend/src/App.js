import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/ui/AppLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

/* ===== PAGES ===== */
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Help from "./pages/Help";
import Faq from "./pages/Faq";
import Dashboard from "./pages/Dashboard";
import SearchTrip from "./pages/SearchTrip";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Booking from "./pages/Booking/Booking";
import TripPlanner from "./pages/TripPlanner";
import Wishlist from "./pages/Wishlist";
import BookingDetail from "./pages/BookingDetail";

import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/ManageUsers";
import AdminBookings from "./pages/admin/ManageBookings";
import AdminFlights from "./pages/admin/ManageFlights";

import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        {/* ================= PUBLIC WEBSITE (WITH NAVBAR & FOOTER) ================= */}
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/help" element={<Help />} />
          <Route path="/faq" element={<Faq />} />
        </Route>

        {/* ================= PRIVATE APP ================= */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="search" element={<SearchTrip />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destination/:id" element={<DestinationDetail />} />
          <Route path="plan/:id" element={<TripPlanner />} />
          <Route path="booking" element={<Booking />} />
          <Route path="booking/:id" element={<BookingDetail />} />
          <Route path="mybookings" element={<MyBookings />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= ADMIN APP ================= */}
        {/* ================= ADMIN APP ================= */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="flights" element={<AdminFlights />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
