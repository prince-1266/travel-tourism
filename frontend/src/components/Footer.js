import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail, Phone, MapPin, Plane } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-gray-400 pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 mb-16">
                    {/* Brand Info */}
                    <div>
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                                <Plane size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                            <span className="ml-3 text-xl font-bold text-white tracking-wide">TripWell</span>
                        </Link>
                        <p className="text-gray-400/80 leading-relaxed mb-8 text-sm font-medium">
                            Discover the world's most beautiful destinations with us. We plan, you enjoy. Create memories that last a lifetime.
                        </p>
                        <div className="flex space-x-4">
                            <a href="sms:+916353248918" className="w-11 h-11 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)] border border-gray-700/50">
                                <MessageSquare size={18} />
                            </a>
                            <a href="https://wa.me/916353248918" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(16,185,129,0.4)] border border-gray-700/50">
                                <Phone size={18} />
                            </a>
                            <a href="mailto:modhprince099@gmail.com" className="w-11 h-11 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)] border border-gray-700/50">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6 tracking-wide">Support</h3>
                        <ul className="space-y-4">
                            <li><Link to="/help" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>Help Center</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>FAQs</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>Terms of Service</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6 tracking-wide">Contact Us</h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-800/30 transition-colors border border-transparent hover:border-gray-800">
                                <MapPin className="mt-1 text-blue-500 shrink-0" size={20} />
                                <span className="text-sm font-medium leading-relaxed">452 MG Road, Navrangpura, Ahmedabad, GJ 380009</span>
                            </li>
                            <li className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/30 transition-colors border border-transparent hover:border-gray-800">
                                <Phone className="text-blue-500 shrink-0" size={20} />
                                <span className="text-sm font-medium">+91 63532 48918</span>
                            </li>
                            <li className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/30 transition-colors border border-transparent hover:border-gray-800">
                                <Mail className="text-blue-500 shrink-0" size={20} />
                                <span className="text-sm font-medium">modhprince099@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800/60 pt-8 text-center text-gray-500">
                    <p className="text-sm font-medium">&copy; {new Date().getFullYear()} TripWell. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
