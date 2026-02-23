import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(45);

  // countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // focus first input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);
    inputsRef.current[5]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    // 🔐 later: send otpCode to backend
    navigate("/reset-password");
  };

  return (
    <div
      className="h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/70 via-indigo-700/70 to-purple-800/70"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md p-6 rounded-3xl backdrop-blur-xl
                   bg-white/90 shadow-xl max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold text-center mb-1">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600 mb-4 text-sm">
          Enter the 6‑digit code sent to you
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className="flex justify-between mb-5"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-11 h-11 text-center text-lg font-bold
                           border border-gray-300 rounded-xl
                           focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full h-11 bg-indigo-600 text-white rounded-xl font-semibold"
          >
            Verify OTP
          </motion.button>
        </form>

        <div className="text-center mt-4 text-sm">
          {timer > 0 ? (
            <span className="text-gray-500">
              Resend OTP in 00:{String(timer).padStart(2, "0")}
            </span>
          ) : (
            <button
              onClick={() => setTimer(45)}
              className="text-indigo-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm text-indigo-600 underline"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
