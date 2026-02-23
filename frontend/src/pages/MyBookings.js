import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { MapPin, CheckCircle, Trash2, Info } from "lucide-react";
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
    <div className="max-w-6xl mx-auto pb-20">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleExecuteDelete}
        title={modalContent.title}
        message={modalContent.message}
        isDanger={modalContent.isDanger}
      />

      <h1 className="text-3xl font-bold text-center text-white mb-8">
        My Bookings
      </h1>

      {/* EMPTY STATE */}
      {bookings.length === 0 && (
        <div className="text-center text-white/80 mt-20">
          <p className="text-lg">
            You haven’t booked any trips yet ✈️
          </p>
          <p className="text-sm mt-2">
            Book a trip to see it here.
          </p>
        </div>
      )}

      {/* BOOKINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow p-6 relative overflow-hidden group hover:shadow-xl transition-all flex flex-col"
          >
            {/* STATUS BAR */}
            <div className={`absolute top-0 left-0 w-1 h-full ${b.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>

            {/* TOP ROW */}
            <div className="flex justify-between items-start mb-4 pl-3">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100 truncate">
                  {b.destination}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                  <MapPin size={14} /> {b.flight?.from || "Origin"}
                  <span className="mx-1">→</span>
                  {b.flight?.to || b.destination}
                </p>
              </div>

              <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0
                    ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {b.status === 'confirmed' ? <CheckCircle size={14} /> : <Info size={14} />}
                {b.status}
              </span>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 pl-3 mb-6 flex-1">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Start Date</p>
                <p className="font-semibold">{b.startDate ? new Date(b.startDate).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Travelers</p>
                <p className="font-semibold">{b.travelers || 1} Persons</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs uppercase mb-1">Total Cost</p>
                <p className="font-semibold text-lg">₹{b.totalPrice}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="pl-3 flex gap-3 pt-4 border-t border-gray-100 mt-auto">
              <button
                onClick={() => navigate(`/app/booking/${b._id}`)}
                className="flex-1 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
              >
                View Details
              </button>

              <button
                onClick={() => confirmDelete(b)}
                className="px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold hover:bg-red-100 transition flex items-center gap-2"
              >
                {b.status === 'pending' ? <Trash2 size={16} /> : "Cancel"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
