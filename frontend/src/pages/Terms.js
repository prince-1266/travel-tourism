import { motion } from "framer-motion";

export default function Terms() {
    return (
        <div className="py-24 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
            >
                <h1 className="text-5xl font-black mb-8 text-center text-indigo-950 uppercase tracking-tighter">
                    Terms of Service
                </h1>
                <p className="text-gray-500 mb-8 text-center italic font-medium">
                    Effective Date: February 24, 2026
                </p>

                <section className="space-y-6 text-gray-700 leading-relaxed text-lg">
                    <p>
                        Welcome to TripWell. By accessing or using our website, you agree to be bound by these Terms of Service.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-950 mt-10">1. Use of Services</h2>
                    <p>
                        You may use our platform for lawful travel-related purposes only. You are responsible for maintaining the confidentiality of your account credentials.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-950 mt-10">2. Bookings and Payments</h2>
                    <p>
                        All bookings are subject to availability and the specific terms provided by our travel partners (hotels, airlines, etc.). Payments must be made in full through our secure gateway to confirm your reservations.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-950 mt-10">3. Cancellations and Refunds</h2>
                    <p>
                        Cancellation policies vary depending on the travel package or service booked. Please review the specific cancellation terms provided during the booking process.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-950 mt-10">4. Limitation of Liability</h2>
                    <p>
                        TripWell acts as an intermediary between you and travel service providers. While we strive to ensure a premium experience, we are not liable for any issues arising directly from the service providers' operations.
                    </p>
                </section>
            </motion.div>
        </div>
    );
}
