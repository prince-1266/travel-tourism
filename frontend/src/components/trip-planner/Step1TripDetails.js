import { Plane, Calendar, Users } from "lucide-react";

export default function Step1TripDetails({ data, updateData }) {
    const handleChange = (field, value) => {
        updateData({ ...data, [field]: value });
    };

    const days =
        data.startDate && data.endDate
            ? Math.max(
                1,
                Math.ceil(
                    (new Date(data.endDate) - new Date(data.startDate)) /
                    (1000 * 60 * 60 * 24)
                )
            )
            : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Trip Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FROM CITY */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-white/70 flex items-center gap-2 mb-2">
                        <Plane size={16} /> From City
                    </label>
                    <select
                        className="w-full p-4 rounded-xl text-black dark:text-white bg-white dark:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500 outline-none border-none"
                        value={data.fromCity}
                        onChange={(e) => handleChange("fromCity", e.target.value)}
                    >
                        <option value="">Select Origin City</option>
                        <option value="Delhi (DEL)">Delhi (DEL)</option>
                        <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                        <option value="Ahmedabad (AMD)">Ahmedabad (AMD)</option>
                        <option value="Bangalore (BLR)">Bangalore (BLR)</option>
                        <option value="Chennai (MAA)">Chennai (MAA)</option>
                        <option value="Kolkata (CCU)">Kolkata (CCU)</option>
                    </select>
                </div>

                {/* TO DESTINATION (Read Only) */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-white/70 block mb-2">Destination</label>
                    <input
                        disabled
                        value={data.destinationName}
                        className="w-full p-4 rounded-xl bg-gray-100 dark:bg-white/20 text-gray-500 dark:text-white border border-gray-200 dark:border-white/10"
                    />
                </div>

                {/* DATES */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-white/70 flex items-center gap-2 mb-2">
                        <Calendar size={16} /> Start Date
                    </label>
                    <input
                        type="date"
                        className="w-full p-4 rounded-xl text-black dark:text-white dark:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={data.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500 dark:text-white/70 flex items-center gap-2 mb-2">
                        <Calendar size={16} /> End Date
                    </label>
                    <input
                        type="date"
                        className="w-full p-4 rounded-xl text-black dark:text-white dark:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={data.endDate}
                        min={data.startDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                </div>

                {/* TRAVELERS */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-white/70 flex items-center gap-2 mb-2">
                        <Users size={16} /> How many people?
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        className="w-full p-4 rounded-xl text-black dark:text-white dark:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={data.travelers}
                        onChange={(e) => handleChange("travelers", parseInt(e.target.value) || 1)}
                    />
                </div>

                {/* DURATION SUMMARY */}
                <div className="bg-gray-100 dark:bg-white/10 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-sm text-gray-500 dark:text-white/60">Duration</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{days > 0 ? `${days} Days` : "-"}</span>
                </div>

            </div>
        </div>
    );
}
