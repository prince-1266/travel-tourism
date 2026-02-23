import { User } from "lucide-react";

export default function Step2Travelers({ data, updateData }) {
    // Ensure travelers array matches the count
    const travelers = data.travelersDetails || [];

    // Initialize if empty or length mismatch
    if (travelers.length !== data.travelers) {
        const newTravelers = [...travelers];
        if (travelers.length < data.travelers) {
            for (let i = travelers.length; i < data.travelers; i++) {
                newTravelers.push({ name: "", age: "", gender: "Male" });
            }
        } else {
            newTravelers.length = data.travelers;
        }
        // Avoid infinite loop by checking if JSON stringified is different before updating
        // But updateData triggers a re-render. 
        // Better to do this init in the parent or use a useEffect here. 
        // For simplicity in rendering, we map based on count and update on change.
    }

    const handleTravelerChange = (index, field, value) => {
        const newTravelers = [...(data.travelersDetails || [])];

        // Ensure array is populated up to index
        while (newTravelers.length <= index) {
            newTravelers.push({ name: "", age: "", gender: "Male" });
        }

        newTravelers[index] = { ...newTravelers[index], [field]: value };
        updateData({ ...data, travelersDetails: newTravelers });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Traveler Information</h2>
            <p className="text-gray-500 dark:text-white/60 mb-6">Enter details for all {data.travelers} travelers.</p>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: data.travelers }).map((_, index) => {
                    const traveler = (data.travelersDetails && data.travelersDetails[index]) || { name: "", age: "", gender: "Male" };

                    return (
                        <div key={index} className="bg-gray-50 dark:bg-white/10 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
                                    <User size={20} />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Traveler {index + 1}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* NAME */}
                                <div className="md:col-span-1">
                                    <label className="text-xs text-gray-500 dark:text-white/60 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl text-black dark:text-white dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. John Doe"
                                        value={traveler.name}
                                        onChange={(e) => handleTravelerChange(index, "name", e.target.value)}
                                    />
                                </div>

                                {/* AGE */}
                                <div>
                                    <label className="text-xs text-gray-500 dark:text-white/60 block mb-1">Age</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-xl text-black dark:text-white dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Age"
                                        value={traveler.age}
                                        onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                                    />
                                </div>

                                {/* GENDER */}
                                <div>
                                    <label className="text-xs text-gray-500 dark:text-white/60 block mb-1">Gender</label>
                                    <select
                                        className="w-full p-3 rounded-xl text-black dark:text-white dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-indigo-500 border-none"
                                        value={traveler.gender}
                                        onChange={(e) => handleTravelerChange(index, "gender", e.target.value)}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
