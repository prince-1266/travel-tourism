import { Plane, CheckCircle } from "lucide-react";

export default function Step3Flights({ data, updateData }) {
    // Hardcoded flights to ensure UI works perfectly and looks like before
    const flights = [
        {
            id: "f1",
            airline: "IndiGo",
            code: "6E-204",
            time: "08:00 AM - 10:30 AM",
            duration: "2h 30m",
            price: 4500,
            type: "Non-stop"
        },
        {
            id: "f2",
            airline: "Air India",
            code: "AI-505",
            time: "11:15 AM - 01:45 PM",
            duration: "2h 30m",
            price: 5200,
            type: "Non-stop"
        },
        {
            id: "f3",
            airline: "Vistara",
            code: "UK-993",
            time: "05:45 PM - 08:30 PM",
            duration: "2h 45m",
            price: 6800,
            type: "Non-stop"
        }
    ];

    const handleSelect = (flight) => {
        updateData({ ...data, selectedFlight: flight });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Flights</h2>
            <p className="text-gray-500 dark:text-white/60 mb-6">Flights from {data.fromCity || "Origin"} to {data.destinationName}</p>

            <div className="space-y-4">
                {flights.map((flight) => {
                    const isSelected = data.selectedFlight?.id === flight.id;
                    return (
                        <div
                            key={flight.id}
                            onClick={() => handleSelect(flight)}
                            className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between
                    ${isSelected
                                    ? "bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent"
                                    : "bg-white border-gray-100 text-gray-900 dark:bg-white/10 dark:border-white/10 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20"
                                }
                `}
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-100 dark:bg-white p-2 rounded-lg">
                                    <Plane size={24} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{flight.airline} <span className="text-xs text-gray-500 dark:text-white/50 font-normal">({flight.code})</span></h4>
                                    <p className="text-sm text-gray-500 dark:text-white/70">{flight.time}</p>
                                    <span className="text-xs bg-gray-100 text-gray-600 dark:bg-white/20 px-2 py-0.5 rounded dark:text-white/70">{flight.duration}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900 dark:text-white">₹{flight.price}</p>
                                <p className="text-xs text-gray-500 dark:text-white/50">per person</p>
                                {isSelected && <div className="mt-2 text-indigo-300 flex items-center justify-end gap-1 text-sm"><CheckCircle size={14} /> Selected</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
