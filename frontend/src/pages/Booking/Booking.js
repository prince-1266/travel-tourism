import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import api from "../../api/axios";

/* STEPS */
import FlightStep from "./FlightStep";
import HotelStep from "./HotelStep";
import HotelDetail from "./HotelDetail";
import TravelerStep from "./TravelerStep";
import Payment from "./Payment";

export default function Booking() {
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const { success, error } = useNotification();

  /* ===== HOOKS (ALWAYS AT TOP) ===== */
  const [step, setStep] = useState(1);
  const [flight, setFlight] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== SAFETY CHECK (AFTER HOOKS) ===== */
  if (!state) {
    return (
      <div className="p-10 text-center">
        No booking data found. Please start again.
      </div>
    );
  }

  /* ===== DATA FROM TRIP PLANNER ===== */
  const {
    destinationId,
    fromCity,
    startDate,
    endDate,
    days,
    persons,
  } = state;

  /* CREATE PENDING BOOKING */
  const handleCreateBooking = async (travelersDetails) => {
    setLoading(true);
    try {
      // Calculate Total
      const total = (flight?.price || 0) * persons + (hotel?.price || 0) * days + 500; // + Taxes

      const res = await api.post("/bookings", {
        destination: state.destinationId,
        flight,
        hotel,
        tripId: state.tripId,
        startDate,
        endDate,
        travelers: persons,
        travelersDetails, // Pass the array of details
        totalPrice: total
      });

      setBookingId(res.data._id);
      setStep(5); // Move to Payment (Step 5)
    } catch (err) {
      error("Failed to initialize booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* STEP 1 — FLIGHT */}
      {step === 1 && (
        <FlightStep
          fromCity={fromCity}
          destinationId={destinationId}
          persons={persons}
          onNext={(selectedFlight) => {
            setFlight(selectedFlight);
            setStep(2);
          }}
        />
      )}

      {/* STEP 2 — HOTEL */}
      {step === 2 && (
        <HotelStep
          days={days}
          persons={persons}
          onBack={() => setStep(1)}
          onNext={(selectedHotel) => {
            setHotel(selectedHotel);
            setStep(3);
          }}
        />
      )}

      {/* STEP 3 — HOTEL DETAIL */}
      {step === 3 && (
        <HotelDetail
          hotel={hotel}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)} // Go to Traveler Step
          loading={loading}
        />
      )}

      {/* STEP 4 — TRAVELER DETAILS */}
      {step === 4 && (
        <TravelerStep
          persons={persons}
          onBack={() => setStep(3)}
          onNext={(details) => handleCreateBooking(details)}
        />
      )}

      {/* STEP 5 — PAYMENT */}
      {step === 5 && (
        <Payment
          bookingId={bookingId} // PASS BOOKING ID
          trip={{
            destinationId,
            fromCity,
            startDate,
            endDate,
            days,
            persons,
            flight,
            hotel,
          }}
          onBack={() => setStep(4)}
          onSuccess={() => {
            success("Booking Confirmed 🎉 Check your dashboard.");
            setTimeout(() => navigate("/app/dashboard"), 1500);
          }}
        />
      )}
    </>
  );
}
