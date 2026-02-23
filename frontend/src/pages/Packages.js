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
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 min-h-screen py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-md">Popular Tour Packages</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                        Choose from our most requested travel packages. Everything is included for a hassle-free experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 group">
                            <div className="relative h-64 overflow-hidden border-b border-white/20">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold text-yellow-600 shadow-md">
                                    <Star size={14} className="fill-yellow-600" />
                                    {pkg.rating}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold mb-2">
                                    <MapPin size={16} />
                                    {pkg.location}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{pkg.title}</h3>

                                <div className="flex items-center justify-between text-blue-100/80 text-sm mb-6 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={16} />
                                        {pkg.duration}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users size={16} />
                                        {pkg.people}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                    <div>
                                        <span className="text-2xl font-bold text-white">{pkg.price}</span>
                                        <span className="text-blue-200/60 text-sm"> / person</span>
                                    </div>
                                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full hover:shadow-lg hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95">
                                        <ArrowRight size={20} />
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
