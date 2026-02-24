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
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-4xl mx-auto flex flex-col justify-center min-h-[70vh]">

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center animate-in zoom-in duration-700 bg-white rounded-[4rem] p-24 shadow-2xl border border-gray-100">
            <div className="bg-indigo-600 rounded-full p-8 mb-10 shadow-2xl shadow-indigo-200 transform scale-125">
              <CheckCircle size={80} className="text-white" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-indigo-950 mb-6 uppercase tracking-tighter text-center">Journey Locked</h2>
            <p className="text-gray-400 font-bold text-center text-xl uppercase tracking-widest">
              Awaiting departure.<br />Synchronizing terminal...
            </p>
          </div>
        ) : (
          <>
            {/* PROGRESS BAR */}
            <div className="mb-12">
              <div className="hidden md:flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4 px-2">
                <span>01 Strategy</span>
                <span>02 Manifest</span>
                <span>03 Logistics</span>
                <span>04 Habitat</span>
                <span>05 Audit</span>
                <span>06 Confirm</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl border border-white/10">
                <div
                  className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col min-h-[60vh] relative overflow-hidden">
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
                <div className="flex justify-between items-center mt-12 pt-12 border-t border-gray-50 shrink-0">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition text-gray-400 hover:text-indigo-600 hover:bg-indigo-50
                            ${currentStep === 1 ? "opacity-0 pointer-events-none" : ""}
                        `}
                  >
                    <ChevronLeft size={18} /> Prev
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95"
                  >
                    {currentStep === 5 ? "Verify Checkout" : "Continue"} <ChevronRight size={18} />
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
