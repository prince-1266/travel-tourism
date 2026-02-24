
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
        <div className="min-h-screen py-32 px-4 shadow-inner">
            <div className="max-w-4xl mx-auto">
                {/* HEADER ACTIONS */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">Trip Receipt</h1>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-3 bg-white text-indigo-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition shadow-xl hover:-translate-y-1 active:scale-95 border border-gray-100 print:hidden"
                    >
                        <Printer size={20} /> PRINT E-TICKET
                    </button>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_35px_70px_-15px_rgba(0,0,0,0.3)] border border-gray-100 print:shadow-none print:border-none transition-all">

                    {/* BANNER */}
                    <div className="h-64 bg-indigo-600 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                        <div className="text-center relative z-10">
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter drop-shadow-lg">{booking.destination}</h2>
                            <span className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-[0.3em] border border-white/30">
                                PASS: {booking._id.slice(-8).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* STATUS ROW */}
                        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 rounded-[2rem] p-10 mb-12 border border-gray-100">
                            <div className="text-center md:text-left mb-6 md:mb-0">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-3">Booking Status</p>
                                <div className={`inline-flex items-center gap-3 font-black text-xl uppercase tracking-tighter ${booking.status === 'confirmed' ? 'text-indigo-600' : 'text-amber-500'} `}>
                                    {booking.status === 'confirmed' ? <CheckCircle size={24} /> : <Info size={24} />}
                                    {booking.status}
                                </div>
                            </div>
                            <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
                            <div className="text-center md:text-right">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">Total Investment</p>
                                <p className="text-5xl font-black text-indigo-950 tracking-tighter">₹{booking.totalPrice?.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* GUEST LIST */}
                        {booking.travelersDetails && booking.travelersDetails.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-black text-indigo-950 mb-6 uppercase tracking-widest">Guest Manifest</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {booking.travelersDetails.map((guest, i) => (
                                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                                            <div>
                                                <p className="font-black text-indigo-950 uppercase text-sm tracking-tight">{guest.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{guest.gender}, {guest.age} years</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-indigo-600 tracking-widest">{guest.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* FLIGHT SECTION */}
                        {booking.flight && (
                            <div className="space-y-6">
                                <h3 className="flex items-center gap-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                    <Plane size={18} className="text-indigo-600" /> Flight Itinerary
                                </h3>
                                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-inner">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="font-black text-2xl text-indigo-950 uppercase tracking-tight">{booking.flight.airline}</span>
                                        <span className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-black text-indigo-400 tracking-widest">{booking.flight.code}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-indigo-950 tracking-tighter">{booking.flight.from?.split(' ')[0] || "DEL"}</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Origin</p>
                                        </div>
                                        <div className="flex-1 px-6 flex flex-col items-center">
                                            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">{booking.flight.duration}</p>
                                            <div className="w-full h-px bg-gray-200 relative">
                                                <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 rotate-90" />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-indigo-950 tracking-tighter">{booking.flight.to?.split(' ')[0] || "DEST"}</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Goal</p>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs font-black text-indigo-600 bg-white py-4 rounded-2xl border border-gray-100 tracking-widest uppercase">
                                        DEPARTURE: {booking.flight.time}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* HOTEL SECTION */}
                        {booking.hotel && (
                            <div className="space-y-6">
                                <h3 className="flex items-center gap-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                    <Hotel size={18} className="text-indigo-600" /> Accommodation
                                </h3>
                                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-inner h-full flex flex-col">
                                    <div className="flex gap-6 items-center">
                                        <img src={booking.hotel.image} className="w-24 h-24 rounded-[1.5rem] object-cover shadow-xl border-2 border-white" alt="Hotel" />
                                        <div>
                                            <h4 className="font-black text-2xl text-indigo-950 uppercase tracking-tight mb-2 leading-none">{booking.hotel.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">{booking.hotel.type}</p>
                                            <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black bg-white px-4 py-2 rounded-xl w-fit shadow-sm border border-gray-50 uppercase tracking-widest">
                                                <span className="text-amber-400">★</span> {booking.hotel.rating} Score
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TRAVELER DETAILS */}
                    <div className="mt-14 pt-14 border-t border-gray-50">
                        <h3 className="flex items-center gap-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                            <Users size={18} className="text-indigo-600" /> Logistical Data
                        </h3>
                        <div className="bg-indigo-50/50 rounded-[2rem] p-10 border border-indigo-100 mb-10">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                                <div>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-3">Launch</p>
                                    <p className="font-black text-indigo-950 text-xl tracking-tight">{new Date(booking.startDate).toDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-3">Return</p>
                                    <p className="font-black text-indigo-950 text-xl tracking-tight">{new Date(booking.endDate).toDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-3">Manifest Size</p>
                                    <p className="font-black text-indigo-950 text-xl tracking-tight uppercase">{booking.travelers} Persons</p>
                                </div>
                            </div>
                        </div>

                        {/* DETAILED TRAVELERS TABLE */}
                        {booking.travelersDetails && booking.travelersDetails.length > 0 && (
                            <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                        <tr>
                                            <th className="p-6 border-b border-gray-100">Name</th>
                                            <th className="p-6 border-b border-gray-100">Age</th>
                                            <th className="p-6 border-b border-gray-100">Gender</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm text-indigo-950">
                                        {booking.travelersDetails.map((t, i) => (
                                            <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                                <td className="p-6 font-black uppercase tracking-tight">{t.name}</td>
                                                <td className="p-6 font-bold">{t.age}</td>
                                                <td className="p-6 font-black uppercase text-[10px] tracking-widest">{t.gender}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* PAYMENT INFO */}
                        {booking.paymentId && (
                            <div className="mt-14 pt-14 border-t border-gray-50">
                                <h3 className="flex items-center gap-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                                    <CreditCard size={18} className="text-indigo-600" /> Transaction Audit
                                </h3>
                                <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100 flex flex-wrap justify-between items-center gap-10">
                                    <div>
                                        <p className="text-[9px] text-emerald-600/60 uppercase font-black tracking-widest mb-2">Method</p>
                                        <p className="font-black text-emerald-950 uppercase tracking-tight text-lg">{booking.paymentId.method || "SECURE-CARD"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-emerald-600/60 uppercase font-black tracking-widest mb-2">Ref ID</p>
                                        <p className="font-mono text-emerald-800 text-xs px-3 py-1 bg-white rounded-lg border border-emerald-100">TXN-{booking.paymentId._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-emerald-600/60 uppercase font-black tracking-widest mb-2">Status</p>
                                        <div className="flex items-center gap-2 font-black text-emerald-600 uppercase tracking-widest text-xs bg-white px-4 py-2 rounded-xl shadow-sm">
                                            <CheckCircle size={14} /> {booking.paymentId.status || "CONFIRMED"}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-emerald-600/60 uppercase font-black tracking-widest mb-2">Settlement</p>
                                        <p className="font-black text-3xl text-emerald-600 tracking-tighter">₹{booking.paymentId.amount || booking.totalPrice}</p>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
}
