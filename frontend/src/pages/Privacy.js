import { motion } from "framer-motion";

export default function Privacy() {
    return (
        <div className="py-24 px-6 max-w-4xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
            >
                <h1 className="text-5xl font-black mb-8 text-center text-indigo-950 uppercase">
                    Privacy Policy
                </h1>
                <p className="text-gray-500 mb-8 text-center italic font-medium">
                    Last updated: February 24, 2026
                </p>

                <section className="space-y-6 text-gray-700 leading-relaxed text-lg">
                    <p>
                        At TripWell, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our services.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-950 mt-10">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, make a booking, or contact our support team. This may include your name, email address, phone number, and payment information.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-950 mt-10">2. How We Use Your Information</h2>
                    <p>
                        We use your information to facilitate your travel bookings, communicate with you about your trips, improve our services, and ensure the security of our platform.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-950 mt-10">3. Data Security</h2>
                    <p>
                        We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or alteration. Your sensitive information is encrypted during transmission.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-950 mt-10">4. Sharing Your Information</h2>
                    <p>
                        We only share your information with trusted partners (like hotels and airlines) as necessary to complete your travel arrangements. We do not sell your personal data to third parties.
                    </p>
                </section>
            </motion.div>
        </div>
    );
}
