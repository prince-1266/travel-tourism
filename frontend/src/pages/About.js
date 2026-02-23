import React from 'react';
import { Users, Globe, Award, Shield } from 'lucide-react';

const About = () => {
    return (
        <div
            className="min-h-screen relative overflow-hidden text-white"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-800/85 to-purple-900/90 z-0"></div>

            {/* GLOW ORBS */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-500 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse duration-10000 z-0"></div>
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] opacity-40 mix-blend-screen z-0"></div>

            {/* Hero Section */}
            <div className="relative h-96">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent"></div>
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg">About TripWell</h1>
                    <p className="text-xl md:text-2xl max-w-2xl mx-auto font-medium text-blue-100 drop-shadow-md">We are passionate about creating unforgettable travel experiences for adventurers around the world.</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-2">10k+</div>
                            <div className="text-blue-200 font-semibold tracking-wide">Happy Travelers</div>
                        </div>
                        <div className="text-center p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-2">500+</div>
                            <div className="text-blue-200 font-semibold tracking-wide">Destinations</div>
                        </div>
                        <div className="text-center p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-2">98%</div>
                            <div className="text-blue-200 font-semibold tracking-wide">Satisfaction Rate</div>
                        </div>
                        <div className="text-center p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-2">24/7</div>
                            <div className="text-blue-200 font-semibold tracking-wide">Support</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
                            <p className="text-blue-100/90 leading-relaxed mb-6 text-lg font-medium">
                                Founded in 2024, TripWell began with a simple mission: to make travel planning as enjoyable as the trip itself. What started as a small team of travel enthusiasts has grown into a leading travel agency trusted by thousands of explorers worldwide.
                            </p>
                            <p className="text-blue-100/90 leading-relaxed text-lg font-medium">
                                We believe that travel changes us. It opens our minds, connects us with different cultures, and creates memories that last a lifetime. That's why we're committed to curating the best travel experiences, from relaxing beach gateways to adrenaline-pumping adventures.
                            </p>
                        </div>
                        <div className="md:w-1/2 relative group">
                            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                                alt="Team working together"
                                className="relative rounded-2xl shadow-2xl border border-white/20 transform group-hover:rotate-1 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white drop-shadow-md">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl hover:-translate-y-2 hover:bg-white/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
                            <Users className="w-14 h-14 text-teal-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Expert Guides</h3>
                            <p className="text-blue-200/80 font-medium leading-relaxed">Our local experts ensure you see the best of every destination.</p>
                        </div>
                        <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl hover:-translate-y-2 hover:bg-white/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
                            <Globe className="w-14 h-14 text-green-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Global Reach</h3>
                            <p className="text-blue-200/80 font-medium leading-relaxed">Access to exclusive experiences in over 50 countries.</p>
                        </div>
                        <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl hover:-translate-y-2 hover:bg-white/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
                            <Award className="w-14 h-14 text-yellow-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Best Price</h3>
                            <p className="text-blue-200/80 font-medium leading-relaxed">Luxury travel experiences at unbeatable market rates.</p>
                        </div>
                        <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl hover:-translate-y-2 hover:bg-white/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
                            <Shield className="w-14 h-14 text-pink-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Secure Booking</h3>
                            <p className="text-blue-200/80 font-medium leading-relaxed">Your payments and personal information are always safe with us.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
