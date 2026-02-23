
import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const NotificationContext = createContext(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

// Notification Types: success, error, warning, info
const NOTIFICATION_TYPES = {
    success: {
        icon: <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />,
        borderColor: "border-green-500",
        bgColor: "bg-green-50/90 dark:bg-slate-800 dark:border-green-500/50",
    },
    error: {
        icon: <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
        borderColor: "border-red-500",
        bgColor: "bg-red-50/90 dark:bg-slate-800 dark:border-red-500/50",
    },
    warning: {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />,
        borderColor: "border-yellow-500",
        bgColor: "bg-yellow-50/90 dark:bg-slate-800 dark:border-yellow-500/50",
    },
    info: {
        icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
        borderColor: "border-blue-500",
        bgColor: "bg-blue-50/90 dark:bg-slate-800 dark:border-blue-500/50",
    },
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addNotification = useCallback((type, message, duration = 4000) => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, type, message }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);


    // However, since removeNotification is used inside other useCallbacks, and useCallbacks themselves are created before return...
    // Actually, removeNotification is defined AFTER addNotification in the code? No, let's look.
    // addNotification calls removeNotification. removeNotification uses setNotifications.
    // removeNotification is defined below addNotification.
    // WE CANNOT call removeNotification inside addNotification if it's defined after.
    // The previous code had addNotification (line 43) calling removeNotification (line 54). This works because of hoisting variables? No, consts don't hoist like that in function scope execution if not yet defined.
    // But they are inside the component function, so by the time they are called they are defined.
    // Wait, addNotification is a useCallback. It captures removeNotification.
    // If removeNotification is unstable, addNotification will rebuild.
    // Let's just fix the lint by adding it to dependency or removing it.
    // Ideally, define removeNotification FIRST.
    // I'll just suppress the warning or fix dependency.
    // Let's simple fix: The user complained about missing dependency.
    // I will look at the file content again to be sure of order.
    // View file shows addNotification calls `removeNotification(id)`.
    // removeNotification is defined NEXT.
    // dependency array of addNotification is `[]`. It misses `removeNotification`.
    // If I add it, I must ensure `removeNotification` is wrapped in useCallback and defined BEFORE.
    // Or I can use a ref or just ignore it if it works.
    // I will reorder them. Define removeNotification first.
    // Then add it to dependency.

    // Helpers
    const success = (msg, duration) => addNotification("success", msg, duration);
    const error = (msg, duration) => addNotification("error", msg, duration);
    const warning = (msg, duration) => addNotification("warning", msg, duration);
    const info = (msg, duration) => addNotification("info", msg, duration);

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, removeNotification, success, error, warning, info }}
        >
            {children}
            {/* Global Notification Container */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 font-sans pointer-events-none items-center">
                <AnimatePresence>
                    {notifications.map((notif) => {
                        const style = NOTIFICATION_TYPES[notif.type] || NOTIFICATION_TYPES.info;

                        return (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className={`
                  pointer-events-auto
                  flex items-start gap-3 
                  p-4 rounded-lg shadow-lg 
                  backdrop-blur-md border-l-4 
                  min-w-[300px] max-w-sm
                  bg-white/90 dark:bg-gray-800/90 
                  text-gray-800 dark:text-gray-100
                  dark:border-l-4 dark:shadow-2xl
                  ${style.borderColor}
                  ${style.bgColor}
                `}
                                role="alert"
                            >
                                <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
                                <div className="flex-1 text-sm font-medium leading-relaxed">
                                    {notif.message}
                                </div>
                                <button
                                    onClick={() => removeNotification(notif.id)}
                                    className="flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/10 rounded-full p-1 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};
