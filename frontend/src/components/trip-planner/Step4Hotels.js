import { useEffect, useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import api from "../../api/axios";

export default function Step4Hotels({ data, updateData }) {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch hotels from backend
        // Ideally we pass ?destination=... but for now we fetch all/seeded ones
        api.get("/hotels")
            .then(res => {
                setHotels(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch hotels", err);
                setLoading(false);
            });
    }, []);

    const handleSelect = (hotel) => {
        updateData({ ...data, selectedHotel: hotel });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Hotel</h2>
            <p className="text-gray-500 dark:text-white/60 mb-6">Stays in {data.destinationName}</p>

            {loading ? (
                <div className="text-gray-500 dark:text-white/60 text-center py-10">Loading hotels...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {hotels.map((hotel) => {
                        const isSelected = data.selectedHotel?._id === hotel._id || data.selectedHotel?.id === hotel._id;
                        return (
                            <div
                                key={hotel._id || hotel.id}
                                onClick={() => handleSelect(hotel)}
                                className={`flex gap-4 p-3 rounded-2xl border transition cursor-pointer overflow-hidden
                        ${isSelected
                                        ? "bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500"
                                        : "bg-white border-gray-100 dark:bg-white/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                                    }
                    `}
                            >
                                <img src={hotel.image} className="w-24 h-24 rounded-xl object-cover" alt="" />

                                <div className="flex-1 flex flex-col justify-center">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{hotel.name}</h4>
                                    <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400 text-sm mb-1">
                                        <Star size={14} fill="currentColor" /> {hotel.rating}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-white/60 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded w-fit">{hotel.type}</span>
                                </div>

                                <div className="flex flex-col justify-center items-end pr-2">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">₹{hotel.price}</p>
                                    <p className="text-xs text-gray-500 dark:text-white/50">per night</p>
                                    {isSelected && <div className="mt-2 text-indigo-300 flex items-center gap-1 text-sm"><CheckCircle size={14} /> Selected</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
