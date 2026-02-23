import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import { Eye, EyeOff } from "lucide-react";

import { PhoneNumberUtil } from "google-libphonenumber";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { success: notifySuccess, error: notifyError } = useNotification();

  // Steps: 'phone' -> 'reset'
  const [step, setStep] = useState('phone');

  const [countryCode, setCountryCode] = useState("+91");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!identifier) {
      notifyError("Please enter email or mobile number");
      return;
    }

    const isEmail = /[a-zA-Z@]/.test(identifier);
    const payload = {
      type: "reset"
    };

    if (isEmail) {
      // Validate Email Format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(identifier)) {
        notifyError("Invalid email format");
        return;
      }
      payload.email = identifier;
    } else {
      // Validate Phone Format with Library
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
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", payload);

      if (res.data.success) {
        notifySuccess(res.data.message); // "OTP sent to email..."
        setStep('reset');
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      notifyError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }

    const isEmail = /[a-zA-Z@]/.test(identifier);
    const payload = {
      otp,
      newPassword
    };

    if (isEmail) {
      payload.email = identifier;
    } else {
      payload.phone = countryCode + identifier;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp-reset", payload);

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
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/70 via-indigo-700/70 to-purple-800/70"></div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl
                   backdrop-blur-xl
                   bg-gradient-to-br from-white/95 via-white/85 to-white/75
                   border border-white/40
                   shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {step === 'phone' ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {step === 'phone' ? "Enter your email or mobile number" : "Enter OTP and new password"}
        </p>

        <form onSubmit={step === 'phone' ? handleSendOtp : handleResetPassword} className="space-y-4">

          {step === 'phone' && (
            <div className="flex gap-2">
              {/* Hide country code if typing email */}
              {!/[a-zA-Z@]/.test(identifier) && (
                <select
                  className="h-12 rounded-xl border px-2 bg-white"
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
                className="flex-1 h-12 border border-gray-300 rounded-xl px-4"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          )}

          {step === 'reset' && (
            <>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="w-full h-12 border border-indigo-500 ring-2 ring-indigo-200 rounded-xl px-4 text-center text-lg font-bold tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full h-12 border border-gray-300 rounded-xl px-4"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="w-full h-12 bg-indigo-600 text-white rounded-xl font-semibold"
          >
            {loading ? "Processing..." : (step === 'phone' ? "Send OTP" : "Reset Password")}
          </motion.button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Back to{" "}
          <Link to="/login" className="text-indigo-600 underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
