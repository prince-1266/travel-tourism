import { CreditCard } from "lucide-react";

export default function Step6Payment({ onPaymentComplete, processing }) {

    const handlePayment = () => {
        // Pass fake card details or collected state
        onPaymentComplete({
            method: "Card",
            cardDetails: { number: "4242", name: "John Doe" }
        });
    };



    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>

            <div className="bg-white dark:bg-white/10 p-6 rounded-2xl border border-gray-100 dark:border-white/10 mb-6">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-indigo-600 p-4 rounded-xl border-2 border-white/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20"><CreditCard size={100} /></div>
                        <p className="text-xs text-white/70 mb-8">Credit / Debit Card</p>
                        <p className="font-mono text-xl text-white mb-2">**** **** **** 4242</p>
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Expires 12/25</span>
                            <span>John Doe</span>
                        </div>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                    <div>
                        <label className="text-xs text-gray-500 dark:text-white/60 block mb-1">Card Number</label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none border-none transition"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 dark:text-white/60 block mb-1">Expiry Date</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none border-none transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 dark:text-white/60 block mb-1">CVV</label>
                            <input
                                type="password"
                                placeholder="123"
                                className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-700/70 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none border-none transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>Processing <span className="animate-spin">⌛</span></>
                        ) : (
                            <>Pay Securely <CreditCard size={18} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
