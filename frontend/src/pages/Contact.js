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
            className="min-h-screen relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-2xl">Get in Touch</h1>
                    <p className="text-2xl md:text-3xl text-blue-100/90 max-w-3xl mx-auto font-light leading-relaxed">Have questions about your next adventure? We're here to help you plan the perfect trip.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)]">
                        <h2 className="text-4xl font-black text-indigo-950 mb-12 uppercase tracking-tight">Contact Information</h2>
                        <div className="space-y-10">
                            <div className="flex items-start gap-6">
                                <div className="bg-indigo-600 p-5 rounded-2xl text-white shadow-xl shadow-indigo-200">
                                    <MapPin size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">Our Location</h3>
                                    <p className="text-gray-500 mt-2 font-medium text-lg leading-relaxed">452 MG Road, Navrangpura</p>
                                    <p className="text-gray-500 font-medium text-lg">Ahmedabad, Gujarat 380009</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-xl shadow-blue-200">
                                    <Phone size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">Phone Number</h3>
                                    <p className="text-gray-500 mt-2 font-medium text-lg">+91 63532 48918</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="bg-rose-600 p-5 rounded-2xl text-white shadow-xl shadow-rose-200">
                                    <Mail size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">Email Address</h3>
                                    <p className="text-gray-500 mt-2 font-medium text-lg">modhprince099@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-14">
                            <div className="w-full h-80 bg-gray-50 border border-gray-100 rounded-[2rem] overflow-hidden relative shadow-inner">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2177303867665!2d-73.9854282!3d40.748817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1709123456789!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, opacity: 0.9 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Map"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)]">
                        <h2 className="text-4xl font-black text-indigo-950 mb-12 uppercase tracking-tight">Send us a Message</h2>
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 text-indigo-950 font-bold placeholder-gray-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-inner"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 text-indigo-950 font-bold placeholder-gray-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-inner"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 text-indigo-950 font-bold placeholder-gray-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-inner"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 text-indigo-950 font-bold placeholder-gray-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-inner"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 text-indigo-950 font-bold placeholder-gray-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-inner resize-none"
                                    placeholder="Tell us about your travel plans..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-indigo-600 text-white font-black py-6 px-8 rounded-[1.5rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 mt-4 text-xl uppercase tracking-widest ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                                {!loading && <Send size={24} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
