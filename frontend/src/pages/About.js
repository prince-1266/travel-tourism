import React from 'react';
import { Users, Globe, Award, Shield } from 'lucide-react';

const About = () => {
    return (
        <div
            className="min-h-screen relative overflow-hidden"
        >
            {/* Hero Section */}
            <div className="relative h-96 flex flex-col justify-center text-center text-white">
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl uppercase tracking-tighter">About TripWell</h1>
                    <p className="text-2xl md:text-3xl max-w-3xl mx-auto font-light text-blue-100/90 leading-relaxed">We are passionate about creating unforgettable travel experiences for adventurers around the world.</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center p-8 bg-white border border-gray-100 rounded-[2rem] shadow-xl">
                            <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2 font-outfit uppercase">10k+</div>
                            <div className="text-gray-500 font-bold tracking-tight uppercase text-sm">Happy Travelers</div>
                        </div>
                        <div className="text-center p-8 bg-white border border-gray-100 rounded-[2rem] shadow-xl">
                            <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2 font-outfit uppercase">500+</div>
                            <div className="text-gray-500 font-bold tracking-tight uppercase text-sm">Destinations</div>
                        </div>
                        <div className="text-center p-8 bg-white border border-gray-100 rounded-[2rem] shadow-xl">
                            <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2 font-outfit uppercase">98%</div>
                            <div className="text-gray-500 font-bold tracking-tight uppercase text-sm">Satisfaction Rate</div>
                        </div>
                        <div className="text-center p-8 bg-white border border-gray-100 rounded-[2rem] shadow-xl">
                            <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2 font-outfit uppercase">24/7</div>
                            <div className="text-gray-500 font-bold tracking-tight uppercase text-sm">Support</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-24 relative z-10 bg-white/95 backdrop-blur-md rounded-[4rem] mx-4 md:mx-8 shadow-2xl border border-gray-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <h2 className="text-5xl font-black text-indigo-950 mb-8 uppercase tracking-tight">Our Story</h2>
                            <p className="text-gray-600 leading-relaxed mb-6 text-xl font-medium">
                                Founded in 2024, TripWell began with a simple mission: to make travel planning as enjoyable as the trip itself. What started as a small team of travel enthusiasts has grown into a leading travel agency trusted by thousands of explorers worldwide.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-xl font-medium">
                                We believe that travel changes us. It opens our minds, connects us with different cultures, and creates memories that last a lifetime. That's why we're committed to curating the best travel experiences, from relaxing beach gateways to adrenaline-pumping adventures.
                            </p>
                        </div>
                        <div className="md:w-1/2 relative group">
                            <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                                alt="Team working together"
                                className="relative rounded-[2.5rem] shadow-2xl border border-gray-100 transform group-hover:rotate-1 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-5xl font-black text-center mb-20 text-white uppercase drop-shadow-2xl tracking-tight">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:-translate-y-3 shadow-xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 transition-transform group-hover:scale-110">
                                <Users className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-indigo-950 uppercase">Expert Guides</h3>
                            <p className="text-gray-500 font-medium leading-relaxed text-lg">Our local experts ensure you see the best of every destination.</p>
                        </div>
                        <div className="p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:-translate-y-3 shadow-xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 transition-transform group-hover:scale-110">
                                <Globe className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-indigo-950 uppercase">Global Reach</h3>
                            <p className="text-gray-500 font-medium leading-relaxed text-lg">Access to exclusive experiences in over 50 countries.</p>
                        </div>
                        <div className="p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:-translate-y-3 shadow-xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 border border-amber-100 transition-transform group-hover:scale-110">
                                <Award className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-indigo-950 uppercase">Best Price</h3>
                            <p className="text-gray-500 font-medium leading-relaxed text-lg">Luxury travel experiences at unbeatable market rates.</p>
                        </div>
                        <div className="p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:-translate-y-3 shadow-xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-8 border border-rose-100 transition-transform group-hover:scale-110">
                                <Shield className="w-8 h-8 text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-indigo-950 uppercase">Secure Booking</h3>
                            <p className="text-gray-500 font-medium leading-relaxed text-lg">Your data and payments are always safe with us.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
