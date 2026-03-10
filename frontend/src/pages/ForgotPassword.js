import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "../api/axios";
import { useNotification } from "../context/NotificationContext";
import { PhoneNumberUtil } from "google-libphonenumber";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { success: notifySuccess, error: notifyError } = useNotification();

  // Steps: 'phone' -> 'reset'
  const [step, setStep] = useState('phone');

  const [countryCode, setCountryCode] = useState("+91");
  const [identifier, setIdentifier] = useState("");

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const otpInputRefs = useRef([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= TIMER EFFECT ================= */
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /* ================= OTP INPUT HANDLERS ================= */
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "") {
      if (index < 5) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      if (index > 0 && otp[index] === "") {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    if (!identifier) {
      notifyError("Please enter email or mobile number");
      return;
    }

    const isEmail = /[a-zA-Z@]/.test(identifier);
    const payload = {
      type: "reset"
    };

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(identifier)) {
        notifyError("Invalid email format");
        return;
      }
      payload.email = identifier;
    } else {
      try {
        const phoneUtil = PhoneNumberUtil.getInstance();
        const number = phoneUtil.parseAndKeepRawInput(countryCode + identifier);

        if (!phoneUtil.isValidNumber(number)) {
          notifyError("Invalid phone number for the selected country.");
          return;
        }
      } catch (error) {
        notifyError("Invalid phone number format.");
        return;
      }
      payload.phone = countryCode + identifier;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", payload);

      if (res.data.success) {
        notifySuccess(res.data.message);
        setStep('reset');
        setTimer(60);
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      notifyError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!newPassword || !confirmPassword) {
      notifyError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }

    const isEmail = /[a-zA-Z@]/.test(identifier);
    const payload = {
      otp: otpValue,
      newPassword
    };

    if (isEmail) {
      payload.email = identifier;
    } else {
      payload.phone = countryCode + identifier;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp-reset", payload);

      if (res.data.success) {
        notifySuccess("Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center relative min-h-screen text-white px-6 py-28 md:py-36"
    >
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/login")}
        className="fixed top-8 left-8 z-50 bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition-all backdrop-blur-md border border-white/10 shadow-2xl group"
        aria-label="Back to Login"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* PREMIUM GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-blue-900/60 to-purple-950/80 z-0"></div>

      {/* DYNAMIC GLOW ORBS */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] mix-blend-screen z-0"
      ></motion.div>
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[120px] mix-blend-screen z-0"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-[2.5rem]
                   bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100"
      >
        <h2 className="text-3xl font-black text-center mb-2 text-indigo-950 font-outfit uppercase tracking-tight">
          {step === 'phone' ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="text-center text-gray-500 mb-8 font-medium">
          {step === 'phone' ? "Enter your email or mobile number" : "Securely reset your password"}
        </p>

        <form onSubmit={step === 'phone' ? handleSendOtp : handleResetPassword} className="space-y-5">

          {step === 'phone' && (
            <div className="flex gap-2">
              {!/[a-zA-Z@]/.test(identifier) && (
                <select
                  className="h-12 border border-gray-200 rounded-xl px-2 bg-gray-50 text-gray-900 focus:outline-none focus:border-yellow-400"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
              )}

              <input
                type="text"
                placeholder="Email or Mobile Number"
                className="flex-1 h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          )}

          {step === 'reset' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-5"
            >
              {/* OTP MULTI-INPUT */}
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                  <p>We sent a code to <span className="font-semibold text-gray-900">{identifier}</span></p>
                </div>

                <div className="flex justify-center gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      ref={(input) => otpInputRefs.current[index] = input}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      className="w-10 h-12 md:w-12 md:h-14 border-2 border-indigo-100 focus:border-indigo-600 rounded-xl text-center text-xl font-bold bg-gray-50 text-indigo-950 focus:outline-none transition-colors shadow-sm"
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs px-2">
                  <span className={`text-gray-400 ${timer > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    Resend in {timer}s
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendOtp(null)}
                    disabled={timer > 0}
                    className={`font-semibold ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800 transition-colors'}`}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full h-12 border border-gray-200 rounded-xl px-4 pr-10 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="w-full h-12 border border-gray-200 rounded-xl px-4 pr-10 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-indigo-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full h-14 bg-indigo-600 text-white
                       rounded-2xl font-bold text-lg shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] mt-4 transition-all duration-300 hover:bg-indigo-700 hover:shadow-[0_15px_25px_-5px_rgba(79,70,229,0.5)]"
          >
            {loading ? "Processing..." : (step === 'phone' ? "Send OTP" : "Reset Password")}
          </motion.button>
        </form>

        <p className="text-center text-gray-500 mt-8 font-medium">
          Remember your password?{" "}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Login
          </Link>
        </p>

        {step === 'reset' && (
          <button
            onClick={() => setStep('phone')}
            className="w-full mt-4 text-sm text-center text-gray-400 hover:text-gray-600 underline"
          >
            Wrong details? Edit
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
