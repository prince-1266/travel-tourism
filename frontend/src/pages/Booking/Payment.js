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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Load Razorpay Script
      const res = await loadRazorpayScript();
      if (!res) {
        error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 2. Create Order on Backend
      const orderResponse = await api.post("/payments/create-order", {
        amount: total,
      });

      if (!orderResponse || !orderResponse.data) {
        error("Server error. Please try again.");
        setLoading(false);
        return;
      }

      const orderData = orderResponse.data;

      // 3. Initialize Razorpay Checkout
      const options = {
        key: "rzp_test_SWh8pIsFJtmUlJ", // Your Test Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TravelFlow Checkout",
        description: "Trip Booking Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment on Backend
            const verifyRes = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId,
              amount: total,
            });

            if (verifyRes.data.success) {
              onSuccess();
            } else {
              error("Payment verification failed.");
            }
          } catch (err) {
            error("Verification failed on server.");
          }
        },
        prefill: {
          name: "Traveler", // can be dynamic based on user profile
          email: trip.email || "user@example.com",
        },
        theme: {
          color: "#4f46e5", // matches the indigo UI
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      error("Payment initialization failed. Server might be down.");
      console.error("Razorpay init error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14 text-white">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/20 shadow-2xl">

          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter drop-shadow-lg uppercase">
            Complete Booking
          </h2>
          <p className="text-white/80 mb-10 font-medium">You are one step away from confirming your trip.</p>
          
          <div className="bg-white/5 rounded-[2rem] p-8 mb-10 border border-white/10 flex flex-col gap-4 shadow-inner">
             <div className="flex justify-between items-center text-xs md:text-sm uppercase tracking-widest font-black text-indigo-200">
               <span>Flights + Hotel Packages</span>
               <span>₹{total - 500}</span>
             </div>
             <div className="flex justify-between items-center text-xs md:text-sm uppercase tracking-widest font-black text-indigo-200 border-b border-white/10 pb-6">
               <span>Taxes & Processing</span>
               <span>₹500</span>
             </div>
             <div className="flex justify-between items-center text-3xl font-black mt-4 tracking-tighter text-white drop-shadow-md">
               <span className="uppercase text-lg">Total</span>
               <span>₹{total.toLocaleString()}</span>
             </div>
          </div>

          <p className="text-[10px] text-indigo-200 uppercase tracking-[0.3em] mb-10 font-black flex items-center justify-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span> 
            Secured by Razorpay Gateway
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              onClick={onBack}
              disabled={loading}
              className="px-6 py-5 bg-white/10 hover:bg-white/20 border border-white/20 transition-all rounded-2xl font-black uppercase tracking-widest text-xs flex-1 active:scale-95"
            >
              Cancel & Go Back
            </button>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-[2] px-6 py-5 bg-indigo-600 hover:bg-indigo-500 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.8)] border border-indigo-400/30 active:scale-95 transition-all rounded-2xl font-black uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Initializing..." : "Pay Securely Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
