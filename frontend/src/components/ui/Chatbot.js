import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Hello! I'm your AI Travel Assistant. Ask me anything about your trip! 🌍" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleOpenChat = (e) => {
            setIsOpen(true);
            if (e.detail?.message && typeof e.detail.message === 'string') {
                setMessages(prev => [...prev, { role: "user", text: e.detail.message }]);
                // Trigger AI response automatically
                setLoading(true);
                api.post("/ai/chat", { message: e.detail.message })
                    .then(res => {
                        setMessages(prev => [...prev, { role: "assistant", text: res.data.data.response }]);
                    })
                    .catch(() => {
                        setMessages(prev => [...prev, { role: "assistant", text: "I'm here to help, but having a quick brain freeze. Try asking again! 🧊" }]);
                    })
                    .finally(() => setLoading(false));
            }
        };
        window.addEventListener("open-chat", handleOpenChat);

        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        return () => window.removeEventListener("open-chat", handleOpenChat);
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post("/ai/chat", { message: userMsg.text });
            const aiMsg = { role: "assistant", text: res.data.data.response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I'm having trouble connecting to the travel brain right now. 🧠" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-gray-200 dark:border-slate-700 flex flex-col h-[500px]"
                    >
                        {/* HEADER */}
                        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Bot size={20} />
                                <span className="font-semibold">TripWell AI</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                                <X size={18} />
                            </button>
                        </div>

                        {/* MESSAGES */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 p-3 rounded-2xl rounded-tl-none text-gray-500 text-sm shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* INPUT */}
                        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2">
                            <input
                                className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                placeholder="Ask about travel..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                            />
                            <button
                                disabled={!input.trim() || loading}
                                type="submit"
                                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-shadow"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>
        </div>
    );
}
