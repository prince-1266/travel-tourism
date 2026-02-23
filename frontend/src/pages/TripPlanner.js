import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import api from "../api/axios";

import Step1TripDetails from "../components/trip-planner/Step1TripDetails";
import Step2Travelers from "../components/trip-planner/Step2Travelers";
import Step3Flights from "../components/trip-planner/Step3Flights";
import Step4Hotels from "../components/trip-planner/Step4Hotels";
import Step5Review from "../components/trip-planner/Step5Review";
import Step6Payment from "../components/trip-planner/Step6Payment";

export default function TripPlanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [tripData, setTripData] = useState({
    destinationName: id ? id.replace(/-/g, " ").toUpperCase() : "",
    fromCity: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    travelersDetails: [],
    selectedFlight: null,
    selectedHotel: null,
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    if (currentStep === 1) return tripData.fromCity && tripData.startDate && tripData.endDate;
    if (currentStep === 2) {
      // Check if we have details for ALL travelers
      return tripData.travelersDetails.length === tripData.travelers &&
        tripData.travelersDetails.every(t => t.name && t.age);
    }
    if (currentStep === 3) return tripData.selectedFlight;
    if (currentStep === 4) return tripData.selectedHotel;
    return true;
  };

  const handlePaymentComplete = async (paymentDetails) => {
    setIsProcessing(true);
    try {
      // 1. Calculate Totals
      const days = Math.max(1, Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)));
      const flightCost = (tripData.selectedFlight?.price || 0) * tripData.travelers;
      const hotelCost = (tripData.selectedHotel?.price || 0) * days;
      const tax = (flightCost + hotelCost) * 0.18;
      const totalPrice = flightCost + hotelCost + tax;

      // 2. Create Booking
      const bookingRes = await api.post("/bookings", {
        destination: tripData.destinationName,
        flight: tripData.selectedFlight,
        hotel: tripData.selectedHotel,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        travelers: tripData.travelers,
        travelersDetails: tripData.travelersDetails,
        totalPrice: Math.round(totalPrice),
      });

      const bookingId = bookingRes.data._id;

      // 3. Process Payment
      await api.post("/payments", {
        bookingId,
        amount: Math.round(totalPrice),
        method: paymentDetails.method,
        cardDetails: paymentDetails.cardDetails
      });

      // 4. Success
      setIsSuccess(true);
      notifySuccess("Trip Booked Successfully!");

      setTimeout(() => {
        navigate("/app/mybookings");
      }, 3000);

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || "Booking Failed! Please try again.";
      notifyError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')] bg-cover bg-fixed bg-center dark:bg-slate-900 transition-colors duration-300 relative">
      <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/50 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-gray-900 dark:text-white min-h-screen flex flex-col justify-center">

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
            <div className="bg-green-500 rounded-full p-4 mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle size={64} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Trip Confirmed!</h2>
            <p className="text-gray-600 dark:text-white/80 text-center text-lg">
              Your booking ID is generated.<br />Redirecting to your bookings...
            </p>
          </div>
        ) : (
          <>
            {/* PROGRESS BAR */}
            <div className="mb-8">
              <div className="hidden md:flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/50 mb-2">
                <span>Plan</span>
                <span>Travelers</span>
                <span>Flight</span>
                <span>Hotel</span>
                <span>Review</span>
                <span>Pay</span>
              </div>
              {/* Mobile labels */}
              <div className="md:hidden flex justify-center text-sm font-bold text-gray-800 dark:text-white mb-2">
                Step {currentStep} of 6
              </div>

              <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-yellow-400 transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-12 shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden flex flex-col max-h-[85vh]">
              {/* CONTENT AREA (Scrollable internal) */}
              <div className={`overflow-y-auto custom-scrollbar flex-1 pr-2 ${currentStep === 6 ? 'flex items-center justify-center' : ''}`}>
                {currentStep === 1 && <Step1TripDetails data={tripData} updateData={setTripData} />}
                {currentStep === 2 && <Step2Travelers data={tripData} updateData={setTripData} />}
                {currentStep === 3 && <Step3Flights data={tripData} updateData={setTripData} />}
                {currentStep === 4 && <Step4Hotels data={tripData} updateData={setTripData} />}
                {currentStep === 5 && <Step5Review data={tripData} />}
                {currentStep === 6 && <Step6Payment onPaymentComplete={handlePaymentComplete} processing={isProcessing} />}
              </div>

              {/* NAVIGATION CONTROLS */}
              {currentStep < 6 && (
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 dark:border-white/10 shrink-0">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-4 py-3 md:px-6 rounded-xl font-medium transition text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10
                            ${currentStep === 1 ? "opacity-0 pointer-events-none" : ""}
                        `}
                  >
                    <ChevronLeft size={18} /> Back
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="flex items-center gap-2 px-6 py-3 md:px-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    {currentStep === 5 ? "Proceed to Pay" : "Next Step"} <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
