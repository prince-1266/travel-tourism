import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle, Trash2, Info, Plane, Sparkles } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const { success, error } = useNotification();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [modalContent, setModalContent] = useState({ title: "", message: "", isDanger: false });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    api.get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => { });
  };

  const confirmDelete = (b) => {
    setBookingToDelete(b._id);

    if (b.status === 'confirmed') {
      setModalContent({
        title: "Cancel Trip?",
        message: "This is a confirmed booking. Cancellation fees (20%) may apply. Are you sure you want to proceed?",
        isDanger: true
      });
    } else {
      setModalContent({
        title: "Delete Booking?",
        message: "Are you sure you want to remove this pending booking from your list?",
        isDanger: true
      });
    }
    setIsModalOpen(true);
  };

  const handleExecuteDelete = async () => {
    try {
      await api.delete(`/bookings/${bookingToDelete}`);
      success("Booking cancelled/removed successfully.");
      fetchBookings();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.status === 404
        ? "Delete feature not found. Please restart backend server."
        : (err.response?.data?.message || "Failed to remove booking.");
      error(errMsg);
    }
  };

  return (
    <div className="min-h-screen pt-6 px-4 md:px-8 pb-20 relative overflow-hidden">
      {/* DYNAMIC BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleExecuteDelete}
          title={modalContent.title}
          message={modalContent.message}
          isDanger={modalContent.isDanger}
        />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-left mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Plane size={12} className="text-yellow-400" />
            Travel Log
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight drop-shadow-2xl leading-none flex items-center gap-3">
            My Bookings <span className="text-blue-400 animate-pulse">✈️</span>
          </h1>
          <p className="mt-2 text-sm text-blue-100/50 font-medium tracking-tight max-w-lg">
            {bookings.length === 0
              ? "You haven't booked any trips yet. Book a trip to see it here."
              : "Review your confirmed expeditions and upcoming adventures."}
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {/* EMPTY STATE */}
          {bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key="empty"
              className="text-center glass-glow rounded-[4rem] p-20 border border-white/10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
              <div className="text-[100px] mb-8 animate-float relative z-10">🎫</div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4 relative z-10">
                No active expeditions
              </h2>
              <p className="text-blue-100/50 font-bold mb-12 text-lg relative z-10">
                The world is waiting for your footprint.<br />Launch your next journey today.
              </p>
              <button
                onClick={() => navigate("/app/dashboard")}
                className="px-12 py-6 bg-white text-indigo-950 font-black text-xs uppercase tracking-[0.2em] rounded-3xl hover:bg-yellow-400 transition-all duration-300 shadow-2xl relative z-10 hover:scale-105 active:scale-95"
              >
                Discover Places
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {bookings.map((b) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={b._id}
                  className="bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-10 relative overflow-hidden group hover:-translate-y-4 transition-all duration-500 border border-gray-100 flex flex-col"
                >
                  {/* STATUS BAR */}
                  <div className={`absolute top-0 left-0 right-0 h-2 ${b.status === 'confirmed' ? 'bg-indigo-600' : 'bg-amber-400'}`}></div>

                  {/* TOP ROW */}
                  <div className="flex justify-between items-start mb-8 transition-all">
                    <div className="flex-1 min-w-0 pr-4">
                      <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter truncate group-hover:text-indigo-600 transition-colors">
                        {b.destination}
                      </h2>
                      <p className="text-[10px] text-gray-400 font-black flex items-center gap-2 mt-2 truncate uppercase tracking-widest">
                        <MapPin size={12} className="text-indigo-600" /> {b.flight?.from || "Origin"}
                        <span className="text-gray-300">→</span>
                        {b.flight?.to || b.destination}
                      </p>
                    </div>

                    <span className={`flex items-center gap-1 text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shrink-0 transform -rotate-12
                    ${b.status === 'confirmed' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-amber-400 text-white shadow-lg shadow-amber-100'}`}>
                      {b.status}
                    </span>
                  </div>

                  {/* INFO GRID */}
                  <div className="grid grid-cols-2 gap-8 text-sm text-gray-700 mb-10 flex-1">
                    <div>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">Launch Date</p>
                      <p className="font-black text-indigo-950 text-lg tracking-tight">{b.startDate ? new Date(b.startDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">Expedition</p>
                      <p className="font-black text-indigo-950 text-lg tracking-tight">{b.travelers || 1} PAX</p>
                    </div>
                    <div className="col-span-2 pt-6 border-t border-gray-50">
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Investment</p>
                      <p className="font-black text-indigo-600 text-3xl tracking-tighter">₹{b.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-4 pt-8 border-t border-gray-50 mt-auto">
                    <button
                      onClick={() => navigate(`/app/booking/${b._id}`)}
                      className="flex-1 py-4 bg-gray-50 text-indigo-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      Journal
                    </button>

                    <button
                      onClick={() => confirmDelete(b)}
                      className="px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                    >
                      {b.status === 'pending' ? <Trash2 size={18} /> : "Cancel"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
