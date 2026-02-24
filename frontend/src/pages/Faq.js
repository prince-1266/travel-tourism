import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { q: "How do I book a trip on TripWell?", a: "Simply browse our destinations or packages, select your preferred dates, and follow the checkout process. You'll receive a confirmation email instantly." },
        { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, PayPal, and regional payment options. Your data is encrypted and 100% secure." },
        { q: "Can I cancel my booking?", a: "Yes, most bookings can be cancelled for a full refund up to 48 hours before the trip. Check your specific booking details for exact terms." },
        { q: "Do you offer group discounts?", a: "Absolutely! For groups of 10 or more, please contact our support team to unlock special discounted rates." },
        { q: "Is my personal data safe?", a: "TripWell uses enterprise-grade encryption and follows strict global privacy standards to ensure your data stays private and protected." },
    ];

    return (
        <div className="py-24 px-6 max-w-4xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-6xl font-black mb-6 tracking-tight text-white uppercase">
                    FAQs
                </h1>
                <p className="text-xl text-blue-100/80 font-medium lowercase">
                    Common questions answered for our travelers
                </p>
            </motion.div>

            <div className="space-y-6">
                {faqs.map((faq, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full p-8 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-2xl font-black tracking-tight pr-8 text-indigo-950 font-outfit uppercase">
                                {faq.q}
                            </span>
                            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                                {openIndex === idx ? <Minus size={22} /> : <Plus size={22} />}
                            </div>
                        </button>

                        <AnimatePresence>
                            {openIndex === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-8 pb-10 text-gray-600 text-xl font-medium leading-relaxed border-t border-gray-50 pt-6">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
