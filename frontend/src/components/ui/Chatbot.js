<<<<<<< HEAD
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, RotateCcw } from "lucide-react";
=======
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Trash2 } from "lucide-react";
>>>>>>> 32be6ba (save local changes)
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

<<<<<<< HEAD
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
=======
    const suggestions = [
        "🗺️ Statue of Unity guide",
        "🦁 Gir National Park safari details",
        "🏜️ Rann of Kutch travel guide",
        "⛰️ Best time to visit Saputara"
    ];

    // Markdown Parser Helper to render lists, bolding, headings, inline code, and code blocks
    const parseMarkdown = (text) => {
        if (!text) return "";
        const lines = text.split("\n");
        const elements = [];
        let currentList = [];
        let listType = null; // 'ul' or 'ol'
        let inCodeBlock = false;
        let codeContent = [];

        const flushList = (key) => {
            if (currentList.length > 0) {
                if (listType === 'ul') {
                    elements.push(
                        <ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1 text-slate-800 dark:text-slate-100">
                            {currentList}
                        </ul>
                    );
                } else {
                    elements.push(
                        <ol key={`ol-${key}`} className="list-decimal pl-5 my-2 space-y-1 text-slate-800 dark:text-slate-100">
                            {currentList}
                        </ol>
                    );
                }
                currentList = [];
                listType = null;
            }
        };

        const parseInline = (lineText) => {
            let parts = [{ type: 'text', content: lineText }];

            // 1. Parse bold (**text**)
            const boldRegex = /\*\*(.*?)\*\*/g;
            let newParts = [];
            for (const part of parts) {
                if (part.type === 'text') {
                    let lastIndex = 0;
                    let match;
                    while ((match = boldRegex.exec(part.content)) !== null) {
                        if (match.index > lastIndex) {
                            newParts.push({ type: 'text', content: part.content.substring(lastIndex, match.index) });
                        }
                        newParts.push({ type: 'bold', content: match[1] });
                        lastIndex = boldRegex.lastIndex;
                    }
                    if (lastIndex < part.content.length) {
                        newParts.push({ type: 'text', content: part.content.substring(lastIndex) });
                    }
                } else {
                    newParts.push(part);
                }
            }
            parts = newParts;

            // 2. Parse inline code (`code`)
            const codeRegex = /`(.*?)`/g;
            newParts = [];
            for (const part of parts) {
                if (part.type === 'text') {
                    let lastIndex = 0;
                    let match;
                    while ((match = codeRegex.exec(part.content)) !== null) {
                        if (match.index > lastIndex) {
                            newParts.push({ type: 'text', content: part.content.substring(lastIndex, match.index) });
                        }
                        newParts.push({ type: 'code', content: match[1] });
                        lastIndex = codeRegex.lastIndex;
                    }
                    if (lastIndex < part.content.length) {
                        newParts.push({ type: 'text', content: part.content.substring(lastIndex) });
                    }
                } else {
                    newParts.push(part);
                }
            }
            parts = newParts;

            return parts.map((part, i) => {
                if (part.type === 'bold') {
                    return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.content}</strong>;
                }
                if (part.type === 'code') {
                    return <code key={i} className="bg-slate-100 dark:bg-slate-700 text-red-500 px-1 py-0.5 rounded font-mono text-xs">{part.content}</code>;
                }
                return part.content;
            });
        };

        lines.forEach((line, index) => {
            if (line.trim().startsWith("```")) {
                if (inCodeBlock) {
                    inCodeBlock = false;
                    elements.push(
                        <pre key={`code-${index}`} className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono">
                            <code>{codeContent.join("\n")}</code>
                        </pre>
                    );
                    codeContent = [];
                } else {
                    flushList(index);
                    inCodeBlock = true;
                }
                return;
            }

            if (inCodeBlock) {
                codeContent.push(line);
                return;
            }

            const bulletMatch = line.match(/^(\s*)[*\-•]\s+(.*)/);
            if (bulletMatch) {
                if (listType !== 'ul') {
                    flushList(index);
                    listType = 'ul';
                }
                currentList.push(<li key={`li-${index}`} className="text-sm my-0.5">{parseInline(bulletMatch[2])}</li>);
                return;
            }

            const numberMatch = line.match(/^(\s*)\d+\.\s+(.*)/);
            if (numberMatch) {
                if (listType !== 'ol') {
                    flushList(index);
                    listType = 'ol';
                }
                currentList.push(<li key={`li-${index}`} className="text-sm my-0.5">{parseInline(numberMatch[2])}</li>);
                return;
            }

            flushList(index);
            if (line.trim() === "") {
                elements.push(<div key={`space-${index}`} className="h-2" />);
            } else {
                const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
                if (headerMatch) {
                    const level = headerMatch[1].length;
                    const textVal = parseInline(headerMatch[2]);
                    if (level === 1) {
                        elements.push(<h1 key={`h-${index}`} className="text-base font-bold mt-3 mb-1 text-slate-900 dark:text-white">{textVal}</h1>);
                    } else if (level === 2) {
                        elements.push(<h2 key={`h-${index}`} className="text-sm font-bold mt-2 mb-1 text-slate-900 dark:text-white">{textVal}</h2>);
                    } else {
                        elements.push(<h3 key={`h-${index}`} className="text-xs font-bold mt-2 mb-1 text-slate-900 dark:text-white">{textVal}</h3>);
                    }
                } else {
                    elements.push(<p key={`p-${index}`} className="text-sm leading-relaxed my-0.5">{parseInline(line)}</p>);
                }
            }
        });

        flushList(lines.length);
        return elements;
    };

    useEffect(() => {
        const handleOpenChat = (e) => {
            setIsOpen(true);
            if (e.detail?.message && typeof e.detail.message === 'string') {
                const newUserMsg = { role: "user", text: e.detail.message };
                setMessages(prev => {
                    const updated = [...prev, newUserMsg];
                    setLoading(true);
                    api.post("/ai/chat", { message: e.detail.message, history: updated })
                        .then(res => {
                            setMessages(m => [...m, { role: "assistant", text: res.data.data.response }]);
                        })
                        .catch(() => {
                            setMessages(m => [...m, { role: "assistant", text: "I'm here to help, but having a quick brain freeze. Try asking again! 🧊" }]);
                        })
                        .finally(() => setLoading(false));
                    return updated;
                });
            }
        };
        window.addEventListener("open-chat", handleOpenChat);
        return () => window.removeEventListener("open-chat", handleOpenChat);
    }, []);

    // Scroll to bottom smoothly on message update or loading trigger
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, loading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: "user", text: input };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
>>>>>>> 32be6ba (save local changes)
        setInput("");
        setLoading(true);
        setShowSuggestions(false);

        try {
<<<<<<< HEAD
            // Send conversation history so Gemini maintains context
            const history = [...messages, userMsg]
                .filter(m => m.role === "user" || m.role === "assistant")
                .slice(-20); // Keep last 20 messages for context window

            const res = await api.post("/ai/chat", {
                message: text,
                history: history,
            });

=======
            const res = await api.post("/ai/chat", { message: userMsg.text, history: updatedMessages });
>>>>>>> 32be6ba (save local changes)
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

    const handleSuggestionClick = async (suggestion) => {
        if (loading) return;
        
        // Strip the emoji from the suggestion string
        const cleanedSuggestion = suggestion.replace(/^[\u0000-\u1F6FF]\s*/, "");
        const userMsg = { role: "user", text: cleanedSuggestion };
        const updatedMessages = [...messages, userMsg];
        
        setMessages(updatedMessages);
        setLoading(true);

        try {
            const res = await api.post("/ai/chat", { message: cleanedSuggestion, history: updatedMessages });
            const aiMsg = { role: "assistant", text: res.data.data.response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I'm having trouble connecting to the travel brain right now. 🧠" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = () => {
        setMessages([
            { role: "assistant", text: "Hello! I'm your AI Travel Assistant. Ask me anything about your trip! 🌍" }
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
<<<<<<< HEAD
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
=======
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 250 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-slate-200/80 dark:border-slate-700 flex flex-col h-[550px] transition-colors duration-200"
                    >
                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex justify-between items-center text-white shadow-md">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <div className="bg-white/10 p-1.5 rounded-lg">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-slate-800"></span>
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm tracking-wide leading-tight">TripWell AI</span>
                                    <span className="text-[10px] text-indigo-100 font-medium animate-pulse">Assistant Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {messages.length > 1 && (
                                    <button 
                                        onClick={handleClearHistory} 
                                        title="Clear conversation"
                                        className="hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer text-white"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsOpen(false)} 
                                    title="Close chat"
                                    className="hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer text-white"
>>>>>>> 32be6ba (save local changes)
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

<<<<<<< HEAD
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
=======
                        {/* MESSAGES */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/30 scroll-smooth">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-md font-medium'
                                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.role === 'user' ? msg.text : parseMarkdown(msg.text)}
>>>>>>> 32be6ba (save local changes)
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {loading && (
<<<<<<< HEAD
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
=======
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none text-slate-500 text-sm shadow-sm flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce delay-75" />
                                        <span className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce delay-150" />
>>>>>>> 32be6ba (save local changes)
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

<<<<<<< HEAD
                        {/* ─── INPUT ─── */}
                        <form
                            onSubmit={handleSend}
                            className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2"
                        >
                            <input
                                ref={inputRef}
                                className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-gray-400"
                                placeholder="Ask about travel..."
=======
                        {/* SUGGESTIONS */}
                        {messages.length <= 1 && (
                            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/10">
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-1.5 font-medium tracking-wider uppercase">Suggestions</div>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="bg-indigo-50/60 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-slate-650 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1.5 rounded-full border border-indigo-100/50 dark:border-slate-700/50 whitespace-nowrap cursor-pointer transition-all duration-200 shadow-sm hover:shadow"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* INPUT */}
                        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/80 flex gap-2">
                            <input
                                className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:bg-white dark:focus:bg-slate-750 transition-all duration-250"
                                placeholder="Ask me anything about travel..."
>>>>>>> 32be6ba (save local changes)
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                disabled={!input.trim() || loading}
                                type="submit"
<<<<<<< HEAD
                                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
=======
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer transition-all duration-250 flex items-center justify-center"
>>>>>>> 32be6ba (save local changes)
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

<<<<<<< HEAD
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
=======
            <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center border border-indigo-500/20"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>
>>>>>>> 32be6ba (save local changes)
        </div>
    );
}
