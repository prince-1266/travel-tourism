import React from 'react';
import { Calendar, MapPin, Users, Star, ArrowRight } from 'lucide-react';

const packages = [
    {
        id: 1,
        title: "Majestic Swiss Alps",
        location: "Switzerland",
        duration: "7 Days",
        people: "2 People",
        price: "$2,499",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 2,
        title: "Bali Tropical Paradise",
        location: "Indonesia",
        duration: "5 Days",
        people: "Couple",
        price: "$1,299",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1338&q=80"
    },
    {
        id: 3,
        title: "Santorini Sunset Dreams",
        location: "Greece",
        duration: "6 Days",
        people: "Family",
        price: "$1,899",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1613395877344-13d4c79e42d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
        id: 4,
        title: "Tokyo City Explorer",
        location: "Japan",
        duration: "6 Days",
        people: "Group",
        price: "$2,100",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1494&q=80"
    },
    {
        id: 5,
        title: "Maldives Luxury Escape",
        location: "Maldives",
        duration: "5 Days",
        people: "Couple",
        price: "$3,500",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80"
    },
    {
        id: 6,
        title: "Safari Adventure",
        location: "Kenya",
        duration: "8 Days",
        people: "Group",
        price: "$2,800",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80"
    }
];

const Packages = () => {
    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-2xl">Tour Packages</h1>
                    <p className="text-2xl md:text-3xl text-blue-100/90 max-w-3xl mx-auto font-light leading-relaxed">
                        Choose from our most requested travel packages. Everything is included for a hassle-free experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 group transition-all duration-500 hover:-translate-y-4">
                            <div className="relative h-72 overflow-hidden">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 text-indigo-950 font-black shadow-xl">
                                    <Star size={18} className="fill-amber-400 text-amber-400" />
                                    {pkg.rating}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs mb-3">
                                    <MapPin size={16} />
                                    {pkg.location}
                                </div>
                                <h3 className="text-3xl font-black text-indigo-950 uppercase tracking-tight mb-6">{pkg.title}</h3>

                                <div className="flex items-center gap-6 text-gray-500 font-bold text-sm mb-8">
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                        <Calendar size={18} className="text-indigo-600" />
                                        {pkg.duration}
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                        <Users size={18} className="text-indigo-600" />
                                        {pkg.people}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                                    <div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Per Person</span>
                                        <span className="text-3xl font-black text-indigo-600 uppercase tracking-tighter">{pkg.price}</span>
                                    </div>
                                    <button className="bg-indigo-600 text-white p-5 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 group-hover:scale-105 active:scale-95">
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Packages;
