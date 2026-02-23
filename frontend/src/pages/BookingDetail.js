
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { CreditCard, CheckCircle, Plane, Hotel, Users, Info, Printer } from "lucide-react";

export default function BookingDetail() {
    const { id } = useParams();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/bookings/my`)
            .then((res) => {
                // Since we don't have a direct get-one endpoint yet, find it in the list
                // Ideally we should make a GET /bookings/:id endpoint backend
                const found = res.data.find(b => b._id === id);
                setBooking(found);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-gray-500 dark:text-white text-center mt-20">Loading details...</div>;
    if (!booking) return <div className="text-gray-500 dark:text-white text-center mt-20">Booking not found.</div>;

    return (
        <div className="min-h-screen pt-6 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* HEADER ACTIONS - PRINT ONLY */}
                <div className="flex justify-end items-center mb-8">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-white px-4 py-2 rounded-xl transition hover:shadow-lg border border-gray-200 dark:border-slate-700 print:hidden"
                    >
                        <Printer size={18} /> Print Ticket
                    </button>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:bg-white transition-colors">

                    {/* BANNER */}
                    <div className="h-48 bg-indigo-600 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="text-center relative z-10 text-white">
                            <h1 className="text-4xl font-bold mb-2 uppercase tracking-wider">{booking.destination}</h1>
                            <p className="opacity-80 font-mono">ID: {booking._id.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* STATUS ROW */}
                        <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-8 mb-8">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Booking Status</p>
                                <div className={`flex items-center gap-2 font-bold text-lg capitalize ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'} `}>
                                    {booking.status === 'confirmed' ? <CheckCircle size={20} /> : <Info size={20} />}
                                    {booking.status}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total Paid</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{booking.totalPrice}</p>
                            </div>

                            {/* GUEST LIST */}
                            {booking.travelersDetails && booking.travelersDetails.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-sm uppercase tracking-wide">Guest Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {booking.travelersDetails.map((guest, i) => (
                                            <div key={i} className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600 flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-white">{guest.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{guest.gender}, {guest.age} years</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-mono text-gray-600 dark:text-gray-300">{guest.phone}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* FLIGHT SECTION */}
                            {booking.flight && (
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-wider text-sm">
                                        <Plane size={18} /> Flight Details
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-bold text-xl text-gray-800 dark:text-white">{booking.flight.airline}</span>
                                            <span className="bg-white dark:bg-slate-600 border border-gray-200 dark:border-gray-500 px-2 py-1 rounded text-sm font-mono text-gray-500 dark:text-gray-300">{booking.flight.code}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{booking.flight.from?.split(' ')[0] || "DEL"}</p>
                                                <p className="text-xs text-gray-400">Origin</p>
                                            </div>
                                            <div className="flex-1 px-4 flex flex-col items-center">
                                                <p className="text-xs text-gray-400 mb-1">{booking.flight.duration}</p>
                                                <div className="w-full h-px bg-gray-300 dark:bg-gray-600 relative">
                                                    <Plane size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 rotate-90" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{booking.flight.to?.split(' ')[0] || "DEST"}</p>
                                                <p className="text-xs text-gray-400">Destination</p>
                                            </div>
                                        </div>
                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-600 py-2 rounded-lg border border-gray-100 dark:border-gray-500">
                                            {booking.flight.time}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* HOTEL SECTION */}
                            {booking.hotel && (
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-wider text-sm">
                                        <Hotel size={18} /> Hotel Stay
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-600 h-full">
                                        <div className="flex gap-4 items-start">
                                            <img src={booking.hotel.image} className="w-20 h-20 rounded-xl object-cover shadow-sm" alt="Hotel" />
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-800 dark:text-white leading-tight mb-1">{booking.hotel.name}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{booking.hotel.type}</p>
                                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-white dark:bg-slate-600 px-2 py-1 rounded-full w-fit shadow-sm border border-gray-100 dark:border-gray-500">
                                                    ★ {booking.hotel.rating}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* TRAVELER DETAILS */}
                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-wider text-sm mb-4">
                                <Users size={18} /> Travelers & Data
                            </h3>
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/30 rounded-2xl p-6 border border-indigo-50 dark:border-indigo-800/50 mb-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase mb-1">Check-in</p>
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">{new Date(booking.startDate).toDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase mb-1">Check-out</p>
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">{new Date(booking.endDate).toDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase mb-1">Total Travelers</p>
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">{booking.travelers}</p>
                                    </div>
                                </div>
                            </div>

                            {/* DETAILED TRAVELERS TABLE */}
                            {booking.travelersDetails && booking.travelersDetails.length > 0 && (
                                <div className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 dark:bg-slate-700/50 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                                            <tr>
                                                <th className="p-4 border-b border-gray-100 dark:border-gray-700">Name</th>
                                                <th className="p-4 border-b border-gray-100 dark:border-gray-700">Age</th>
                                                <th className="p-4 border-b border-gray-100 dark:border-gray-700">Gender</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
                                            {booking.travelersDetails.map((t, i) => (
                                                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition">
                                                    <td className="p-4 font-medium capitalize">{t.name}</td>
                                                    <td className="p-4">{t.age}</td>
                                                    <td className="p-4 capitalize">{t.gender}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* PAYMENT INFO */}
                            {booking.paymentId && (
                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                    <h3 className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-wider text-sm mb-4">
                                        <CreditCard size={18} /> Payment Information
                                    </h3>
                                    <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-6 border border-green-100 dark:border-green-800/30 flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <p className="text-xs text-green-600/60 dark:text-green-400/60 uppercase mb-1">Payment Method</p>
                                            <p className="font-bold text-green-800 dark:text-green-400">{booking.paymentId.method || "Card"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-600/60 dark:text-green-400/60 uppercase mb-1">Transaction ID</p>
                                            <p className="font-mono text-green-800 dark:text-green-400 text-sm">{booking.paymentId._id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-600/60 dark:text-green-400/60 uppercase mb-1">Status</p>
                                            <div className="flex items-center gap-1 font-bold text-green-700 dark:text-green-400 capitalize">
                                                <CheckCircle size={14} /> {booking.paymentId.status || "Paid"}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-green-600/60 dark:text-green-400/60 uppercase mb-1">Amount</p>
                                            <p className="font-bold text-xl text-green-800 dark:text-green-400">₹{booking.paymentId.amount || booking.totalPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
