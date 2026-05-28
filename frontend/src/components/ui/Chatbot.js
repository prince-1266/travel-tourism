import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import api from "../../api/axios";

/* ─── Lightweight markdown-ish renderer ─── */
function formatAIText(text) {
    if (!text) return text;
    // Split by newlines, process each line
    return text.split("\n").map((line, i) => {
        // Bold: **text**
        let parts = line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) => {
            if (seg.startsWith("**") && seg.endsWith("**")) {
                return <strong key={j}>{seg.slice(2, -2)}</strong>;
            }
            return seg;
        });

        // Bullet points
        if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
            return (
                <div key={i} className="flex gap-1.5 ml-1">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{parts.slice(0).map((p, k) => typeof p === "string" ? p.replace(/^[-•]\s*/, "") : p)}</span>
                </div>
            );
        }

        // Numbered lists
        if (/^\d+[.)\s]/.test(line.trim())) {
            return (
                <div key={i} className="flex gap-1.5 ml-1">
                    <span className="text-indigo-400 font-medium min-w-[1.2em]">{line.trim().match(/^\d+/)[0]}.</span>
                    <span>{parts.map((p, k) => typeof p === "string" ? p.replace(/^\d+[.)\s]*/, "") : p)}</span>
                </div>
            );
        }

        // Empty lines → small spacer
        if (!line.trim()) return <div key={i} className="h-1.5" />;

        return <div key={i}>{parts}</div>;
    });
}

const SUGGESTIONS = [
    "🗺️ Statue of Unity guide",
    "🐆 Plan a trip to Gir Park",
    "💳 How do I make a payment?",
    "📅 How do I book a trip?",
];

export default function Chatbot() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { info } = useNotification();

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Hello! I'm your AI Travel Assistant. Ask me anything about your trip! 🌍" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Automatically close chatbot if user logs out
    useEffect(() => {
        if (!user && isOpen) {
            setIsOpen(false);
        }
    }, [user, isOpen]);

    const sendMessage = useCallback(async (text) => {
        const userMsg = { role: "user", text };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        setShowSuggestions(false);

        try {
            // Send conversation history so Gemini maintains context
            const history = [...messages, userMsg]
                .filter(m => m.role === "user" || m.role === "assistant")
                .slice(-20); // Keep last 20 messages for context window

            const res = await api.post("/ai/chat", {
                message: text,
                history: history,
            });

            const aiMsg = { role: "assistant", text: res.data.data.response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    text: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔄",
                    isError: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    }, [messages]);

    // Listen for programmatic chat open events (from Help page etc.)
    useEffect(() => {
        const handleOpenChat = (e) => {
            if (!user) {
                info("Please login to use the AI Travel Assistant.");
                navigate("/login");
                return;
            }
            setIsOpen(true);
            if (e.detail?.message && typeof e.detail.message === "string") {
                sendMessage(e.detail.message);
            }
        };
        window.addEventListener("open-chat", handleOpenChat);
        return () => window.removeEventListener("open-chat", handleOpenChat);
    }, [sendMessage, user, navigate, info]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        sendMessage(input.trim());
    };

    const handleSuggestionClick = (suggestion) => {
        // Strip emoji prefix for cleaner query
        const cleanText = suggestion.replace(/^[^\w]*/, "").trim();
        sendMessage(cleanText);
    };

    const handleRetry = () => {
        // Find the last user message and retry
        const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
        if (lastUserMsg) {
            // Remove the error message
            setMessages(prev => prev.filter(m => !m.isError));
            sendMessage(lastUserMsg.text);
        }
    };

    const handleReset = () => {
        setMessages([
            { role: "assistant", text: "Chat cleared! How can I help you plan your next adventure? 🌍" }
        ]);
        setShowSuggestions(true);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-80 md:w-96 overflow-hidden border border-gray-200 dark:border-slate-700 flex flex-col"
                        style={{ height: "520px" }}
                    >
                        {/* ─── HEADER ─── */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">TripWell AI</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleReset}
                                    className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                                    title="Clear chat"
                                >
                                    <RotateCcw size={14} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* ─── MESSAGES ─── */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900/50"
                        >
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === "user"
                                                ? "bg-indigo-600 text-white rounded-tr-sm"
                                                : msg.isError
                                                ? "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-tl-sm"
                                                : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm"
                                        }`}
                                    >
                                        {msg.role === "assistant" ? formatAIText(msg.text) : msg.text}
                                        {msg.isError && (
                                            <button
                                                onClick={handleRetry}
                                                className="mt-2 text-xs bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/50 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
                                            >
                                                <RotateCcw size={10} /> Retry
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Suggestion Chips */}
                            {showSuggestions && messages.length <= 1 && !loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-2"
                                >
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1">
                                        <Sparkles size={12} /> Try asking:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SUGGESTIONS.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSuggestionClick(s)}
                                                className="text-xs bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors text-gray-600 dark:text-gray-300"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* ─── INPUT ─── */}
                        <form
                            onSubmit={handleSend}
                            className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2"
                        >
                            <input
                                ref={inputRef}
                                className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-gray-400"
                                placeholder="Ask about travel..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                disabled={!input.trim() || loading}
                                type="submit"
                                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── FAB BUTTON ─── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                            if (!user) {
                                info("Please login to use the AI Travel Assistant.");
                                navigate("/login");
                            } else {
                                setIsOpen(true);
                            }
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/40 transition-shadow relative"
                    >
                        <MessageCircle size={24} />
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
