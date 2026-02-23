import { Plane, Calendar, User, MapPin } from "lucide-react";

export default function Step5Review({ data }) {
    const flightCost = (data.selectedFlight?.price || 0) * (data.travelers || 1);
    // Simple duration calculation for hotel cost
    const days = data.startDate && data.endDate
        ? Math.max(1, Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24)))
        : 1;
    const hotelCost = (data.selectedHotel?.price || 0) * days;
    const totalCost = flightCost + hotelCost;
    const tax = totalCost * 0.18;
    const grantTotal = totalCost + tax;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review & Confirm</h2>

            {/* TRIP SUMMARY CARD */}
            <div className="bg-white dark:bg-white/10 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Trip Summary</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-white/50">Destination</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2"><MapPin size={14} /> {data.destinationName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-white/50">Travelers</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2"><User size={14} /> {data.travelers} Persons</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-white/50">Start Date</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2"><Calendar size={14} /> {data.startDate}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-white/50">End Date</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2"><Calendar size={14} /> {data.endDate}</p>
                    </div>
                </div>
            </div>

            {/* FLIGHT SUMMARY */}
            {data.selectedFlight && (
                <div className="bg-white dark:bg-white/10 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-2 flex justify-between">
                        <span>Flight Details</span>
                        <Plane size={20} className="text-indigo-400" />
                    </h3>
                    <div className="flex justify-between items-center text-gray-900 dark:text-white">
                        <div>
                            <p className="font-bold">{data.selectedFlight.airline}</p>
                            <p className="text-sm text-gray-500 dark:text-white/70">{data.selectedFlight.code}</p>
                        </div>
                        <div className="text-right">
                            <p>{data.selectedFlight.time}</p>
                            <p className="text-sm text-gray-500 dark:text-white/70">{data.selectedFlight.duration}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* COST BREAKDOWN */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white">
                <h3 className="font-bold mb-4">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Flights x {data.travelers}</span>
                        <span>₹{flightCost}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Hotel x {days} Nights</span>
                        <span>₹{hotelCost}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes & Fees (18%)</span>
                        <span>₹{tax.toFixed(0)}</span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                    <div className="flex justify-between font-bold text-lg text-indigo-700 dark:text-indigo-400">
                        <span>Total Payable</span>
                        <span>₹{grantTotal.toFixed(0)}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
