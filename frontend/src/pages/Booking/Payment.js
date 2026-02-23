import { useState } from "react";
import api from "../../api/axios";
import { useNotification } from "../../context/NotificationContext";

export default function Payment({ trip, bookingId, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false);
  const { error } = useNotification();

  const total =
    trip.flight.price * trip.persons +
    trip.hotel.price * trip.days +
    500; // taxes

  const handlePayment = async () => {
    setLoading(true);
    try {
      await api.post("/payments", {
        bookingId,
        amount: total,
        method: "Card",
        cardDetails: "xxxx-xxxx-xxxx-1234" // Mock
      });
      onSuccess();
    } catch (err) {
      error("Payment failed. Please check your card details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14 text-white">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">

          <h2 className="text-3xl font-semibold mb-6">
            Payment Details
          </h2>

          {/* FORM */}
          <div className="space-y-4">
            <input placeholder="Full Name" className="w-full p-3 rounded-xl text-black" defaultValue="User Name" />
            <input placeholder="Email" className="w-full p-3 rounded-xl text-black" defaultValue={trip.email || ""} />
            <input placeholder="Card Number" className="w-full p-3 rounded-xl text-black" defaultValue="4242 4242 4242 4242" />
            <div className="flex gap-4">
              <input placeholder="Expiry" className="w-full p-3 rounded-xl text-black" defaultValue="12/28" />
              <input placeholder="CVV" className="w-full p-3 rounded-xl text-black" defaultValue="123" />
            </div>
          </div>

          {/* PRICE */}
          <div className="mt-6 text-white/80">
            <p>Flights + Hotel</p>
            <p>Taxes & Fees</p>
            <p className="text-xl font-semibold mt-2">
              Total: ₹{total}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onBack}
              disabled={loading}
              className="px-6 py-3 bg-white/20 rounded-xl"
            >
              Back
            </button>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay & Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
