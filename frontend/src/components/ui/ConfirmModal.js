import { X, AlertTriangle } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isDanger = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                {/* HEADER */}
                <div className={`p-6 flex gap-4 ${isDanger ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <div className={`p-3 rounded-full shrink-0 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{message}</p>
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition
              ${isDanger
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                            }`}
                    >
                        {isDanger ? 'Yes, Delete' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
