import api from "../../api/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function ManageBookings() {
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings").then((res) => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl
                   backdrop-blur-2xl bg-white/80
                   shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                   p-8"
      >
        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Bookings
        </h1>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-100 text-sm font-semibold text-gray-600">
            <span>User</span>
            <span>Email</span>
            <span>Flight</span>
            <span>Price</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          {/* TABLE BODY */}
          {loading ? (
            <p className="p-6 text-gray-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="p-6 text-gray-500">No bookings found.</p>
          ) : (
            bookings.map((b) => (
              <div
                key={b._id}
                className="grid grid-cols-6 gap-4 px-6 py-4 items-center
                             border-t text-sm hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-800">
                  {b.user?.name}
                </span>

                <span className="text-gray-600">
                  {b.user?.email}
                </span>

                <span className="text-gray-700">
                  {b.flight?.from} → {b.flight?.to}
                </span>

                <span className="font-semibold text-indigo-700">
                  ₹{b.flight?.price}
                </span>

                <span className="px-2 py-1 w-fit rounded-full text-xs font-semibold
                                   bg-green-100 text-green-700">
                  {b.status}
                </span>

                {/* DELETE BUTTON */}
                <div className="text-right col-span-1">
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this booking?")) return;
                      try {
                        await api.delete(`/bookings/${b._id}`);
                        setBookings(prev => prev.filter(bk => bk._id !== b._id));
                      } catch (err) {
                        alert("Failed to delete booking");
                      }
                    }}
                    className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
