import { ShieldCheck } from "lucide-react";

export default function Step6Payment({ onPaymentComplete, processing }) {
    const handlePayment = () => {
        onPaymentComplete();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 w-full max-w-md mx-auto">
            <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter text-center mb-8">Secure Checkout</h2>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] mb-6 text-center">
                <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                     <ShieldCheck size={40} className="text-emerald-500" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Finalize Your Journey</h3>
                <p className="text-sm text-gray-500 mb-8 px-4 leading-relaxed">
                    You will be securely redirected to the Razorpay payment gateway to complete your transaction via Card, UPI, or NetBanking.
                </p>

                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_10px_30px_-10px_rgba(79,70,229,0.8)] border border-indigo-400/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <>Initializing Gateway <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin block"></span></>
                    ) : (
                        <>Pay Securely Now</>
                    )}
                </button>

                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse block"></span>
                    Encrypted Connection
                </p>
            </div>
        </div>
    );
}
