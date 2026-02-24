import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Headset, BookOpen, MessageCircle, ArrowRight } from "lucide-react";

export default function Help() {
    const navigate = useNavigate();

    const openChat = (message = "") => {
        window.dispatchEvent(new CustomEvent("open-chat", { detail: { message } }));
    };

    const categories = [
        { title: "Booking Issues", icon: <BookOpen className="text-blue-400" />, desc: "Problems with your reservations or payments." },
        { title: "Account Support", icon: <Headset className="text-purple-400" />, desc: "Managing your profile and security." },
        { title: "Travel Guide", icon: <Search className="text-emerald-400" />, desc: "How to find the best destinations." },
        { title: "Contact Us", icon: <MessageCircle className="text-yellow-400" />, desc: "Request direct assistance from humans." },
    ];

    return (
        <div className="py-24 px-6 max-w-6xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-6xl font-black mb-6 tracking-tight text-white uppercase">
                    Help Center
                </h1>
                <p className="text-xl text-blue-100/80 max-w-3xl mx-auto font-medium">
                    Find answers, get support, and make your TripWell experience seamless.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -8 }}
                        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                            {cat.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-indigo-950">{cat.title}</h3>
                        <p className="text-gray-500 mb-6 font-medium leading-relaxed">{cat.desc}</p>
                        <button
                            onClick={() => openChat(`I have a question about ${cat.title}`)}
                            className="flex items-center gap-2 text-indigo-600 font-black group-hover:gap-4 transition-all"
                        >
                            Learn More <ArrowRight size={18} />
                        </button>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="bg-white p-12 rounded-[3rem] text-center border border-gray-100 shadow-2xl"
            >
                <h2 className="text-3xl font-black mb-4 text-indigo-950">Still need help?</h2>
                <p className="text-gray-500 mb-10 text-xl font-medium">Our experts are available 24/7 to assist you with your travels.</p>
                <button
                    onClick={() => openChat()}
                    className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                >
                    Start Live Chat
                </button>
            </motion.div>
        </div>
    );
}
