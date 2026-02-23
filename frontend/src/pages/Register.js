import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { PhoneNumberUtil } from "google-libphonenumber";

export default function Register() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const otpInputRefs = useRef([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* NOTIFICATION HOOK */
  const { success: notifySuccess, error: notifyError } = useNotification();

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

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");

    // Validate Phone
    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const number = phoneUtil.parseAndKeepRawInput(countryCode + mobile);

      if (!phoneUtil.isValidNumber(number)) {
        const msg = "Invalid phone number for the selected country.";
        setError(msg);
        notifyError(msg);
        return;
      }
    } catch (error) {
      const msg = "Invalid phone number format.";
      setError(msg);
      notifyError(msg);
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      notifyError("Invalid email format");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      notifyError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        phone: countryCode + mobile,
        email, // Send email for OTP delivery
        type: "register"
      });

      if (res.data.success) {
        setOtpSent(true);
        setTimer(60); // Start 60s timer
        notifySuccess(`OTP sent to ${email}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER WITH OTP ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      notifyError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone: countryCode + mobile,
          password,
          otp: otpValue
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        notifyError(data.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      notifySuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        setSuccess(false);
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError("Server error. Please try again.");
      notifyError("Server error. Please try again.");
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      login(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      notifyError("Google Login Failed");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden bg-theme-global ${theme} transition-colors duration-500`}
    >
      {/* OVERLAY */}
      <div className={`absolute inset-0 z-0 ${theme === 'dark' ? 'bg-black/80' : 'bg-gradient-to-br from-blue-700/70 via-indigo-700/70 to-purple-800/70'}`} />

      {/* GLOW */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-400 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30"></div>

      {/* CARD */}
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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-all duration-300"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 mt-2">
          Create Account 🌍
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Start your travel journey today
        </p>

        {/* INLINE ERROR MESSAGE */}
        {error && (
          <p className="text-sm text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={otpSent ? handleRegister : handleSendOtp} className="space-y-5" noValidate>

          {/* USER DETAILS (Disable if OTP Sent) */}
          <div className={`${otpSent ? 'hidden' : 'block'} space-y-5`}>
            <input
              placeholder="Full Name"
              className="w-full h-12 border rounded-xl px-4"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              placeholder="Email Address"
              type="email"
              className="w-full h-12 border rounded-xl px-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* MOBILE WITH COUNTRY CODE */}
            <div className="flex gap-2">
              <select
                className="h-12 rounded-xl border px-2 bg-white"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+61">+61</option>
                <option value="+971">+971</option>
              </select>

              <input
                type="text"
                placeholder="Mobile Number"
                className="flex-1 h-12 rounded-xl border px-4"
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) setMobile(val);
                }}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full h-12 border rounded-xl px-4 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
                className="w-full h-12 border rounded-xl px-4 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* OTP INPUT */}
          {otpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 text-center"
            >
              <div className="text-gray-600 mb-2">
                <p>We sent a code to <span className="font-semibold text-gray-900">{email}</span></p>
                <p className="text-sm">and <span className="font-semibold text-gray-900">{countryCode} {mobile}</span></p>
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
                    className="w-12 h-14 border-2 border-indigo-200 focus:border-indigo-600 rounded-xl text-center text-2xl font-bold bg-white focus:outline-none transition-colors"
                  />
                ))}
              </div>

              <div className="flex justify-between items-center text-sm px-2">
                <span className={`text-gray-500 ${timer > 0 ? 'opacity-100' : 'opacity-0'}`}>
                  Resend in {timer}s
                </span>
                <button
                  type="button"
                  onClick={() => handleSendOtp(null)} // passing null event
                  disabled={timer > 0}
                  className={`font-semibold ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800'}`}
                >
                  Resend OTP
                </button>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-yellow-400 text-indigo-900
                       rounded-xl font-semibold shadow-lg mt-4"
          >
            {loading ? "Processing..." : (otpSent ? "Verify & Register 🚀" : "Send OTP 📩")}
          </motion.button>

        </form>

        {otpSent && (
          <button
            onClick={() => setOtpSent(false)}
            className="w-full mt-4 text-sm text-center text-gray-500 hover:text-gray-700 underline"
          >
            Wrong details? Edit
          </button>
        )}

        {/* GOOGLE LOGIN */}
        {!otpSent && (
          <div className="mt-6 mb-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="flex justify-center mt-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log('Login Failed');
                  notifyError("Google Login Failed");
                }}
                useOneTap
                shape="circle"
              />
            </div>
          </div>
        )}

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 underline"
          >
            Login
          </Link>
        </p>
      </motion.div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              className="bg-white p-10 rounded-3xl text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600">
                Welcome to TripWell ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
