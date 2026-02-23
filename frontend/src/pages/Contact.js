import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const Contact = () => {
    const { success, error: notifyError } = useNotification();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/contact', formData);
            success('Message sent successfully! We will get back to you soon.');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (err) {
            console.error(err);
            notifyError(err.response?.data?.message || 'Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 text-white"
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
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-md">Get in Touch</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">Have questions about your next adventure? We're here to help you plan the perfect trip.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-10">
                        <h2 className="text-3xl font-bold text-white mb-10 tracking-wide">Contact Information</h2>
                        <div className="space-y-10">
                            <div className="flex items-start gap-5">
                                <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-4 rounded-2xl text-white shadow-lg">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Our Location</h3>
                                    <p className="text-blue-100/90 mt-2 font-medium">452 MG Road, Navrangpura</p>
                                    <p className="text-blue-100/90 font-medium">Ahmedabad, Gujarat 380009</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-4 rounded-2xl text-white shadow-lg">
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Phone Number</h3>
                                    <p className="text-blue-100/90 mt-2 font-medium">+91 63532 48918</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-4 rounded-2xl text-white shadow-lg">
                                    <Mail size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Email Address</h3>
                                    <p className="text-blue-100/90 mt-2 font-medium">modhprince099@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-14">
                            {/* Embed map if needed, placeholder for now */}
                            <div className="w-full h-72 bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative shadow-inner">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2177303867665!2d-73.9854282!3d40.748817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1709123456789!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, opacity: 0.8 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Map"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-10">
                        <h2 className="text-3xl font-bold text-white mb-10 tracking-wide">Send us a Message</h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-semibold text-blue-100 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-semibold text-blue-100 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-blue-100 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-blue-100 mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-blue-100 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all backdrop-blur-sm resize-none"
                                    placeholder="Tell us about your travel plans..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                                {!loading && <Send size={20} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
