import { useState } from "react";
import { User, Phone, Calendar, Users } from "lucide-react";

export default function TravelerStep({ persons, onNext, onBack }) {
    // Initialize state for N travelers
    const [travelers, setTravelers] = useState(
        Array.from({ length: persons }, () => ({
            name: "",
            age: "",
            gender: "Male",
            phone: "",
        }))
    );

    const handleChange = (index, field, value) => {
        const updated = [...travelers];
        updated[index][field] = value;
        setTravelers(updated);
    };

    const isFormValid = travelers.every(
        (t) => t.name && t.age && t.phone
    );

    const handleSubmit = () => {
        if (isFormValid) {
            onNext(travelers);
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 text-white">

                {/* HEADER */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-10 text-center">
                    <h2 className="text-3xl font-semibold mb-2">Traveler Details</h2>
                    <p className="text-white/70">
                        Please enter details for {persons} traveler{persons > 1 ? "s" : ""}
                    </p>
                </div>

                {/* FORMS */}
                <div className="space-y-6">
                    {travelers.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8"
                        >
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Users size={20} /> Traveler {i + 1}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* NAME */}
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            className="w-full pl-10 p-3 rounded-xl text-black outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={t.name}
                                            onChange={(e) => handleChange(i, "name", e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* AGE & GENDER */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">Age</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" size={18} />
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                className="w-full pl-10 p-3 rounded-xl text-black outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={t.age}
                                                onChange={(e) => handleChange(i, "age", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">Gender</label>
                                        <select
                                            className="w-full p-3 rounded-xl text-black outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={t.gender}
                                            onChange={(e) => handleChange(i, "gender", e.target.value)}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* PHONE */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/70 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" size={18} />
                                        <input
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            className="w-full pl-10 p-3 rounded-xl text-black outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={t.phone}
                                            onChange={(e) => handleChange(i, "phone", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 bg-white/20 rounded-xl font-semibold hover:bg-white/30 transition"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold disabled:opacity-50 transition"
                    >
                        Continue to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
