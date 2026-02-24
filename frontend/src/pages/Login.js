import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
// ... (imports)

const Login = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { error: notifyError } = useNotification();
  const navigate = useNavigate();

  const [loginRole, setLoginRole] = useState("user");
  const [countryCode, setCountryCode] = useState("+91");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmail = /[a-zA-Z@]/.test(identifier);

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

  /* ================= PASSWORD LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!identifier || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const finalIdentifier = isEmail
      ? identifier
      : countryCode + identifier;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          identifier: finalIdentifier,
          password,
          role: loginRole,
        }
      );

      /* 🔥 IMPORTANT: USE AUTH CONTEXT */
      login(res.data.user);

      /* optional: token still ok */
      localStorage.setItem("token", res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/app/dashboard", { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center relative text-white px-6 py-28 md:py-36"
    >
      {/* PREMIUM GRADIENT OVERLAY (Subtle for content readability) */}
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
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-[2.5rem]
        bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100"
      >

        <h2 className="text-4xl font-black text-center mb-2 mt-2 tracking-tight text-indigo-950 font-outfit uppercase">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-10 text-sm font-medium">
          Welcome back! Please enter your details.
        </p>

        {/* ROLE SELECT */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {["user", "admin"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setLoginRole(role)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300
                ${loginRole === role
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.1)]"
                  : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
            >
              <p className="font-bold capitalize text-sm">{role}</p>
              <p className="text-[10px] opacity-60">
                {role === "user"
                  ? "Book & manage trips"
                  : "Manage system"}
              </p>
            </button>
          ))}
        </div>

        {/* ERROR */}
        <p className="text-sm text-center mb-3 text-red-600 min-h-[20px]">
          {error}
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin}>

          {/* IDENTIFIER INPUT */}
          <div className="flex gap-2 mb-4">
            {/* Show Country Code only if not email */}
            {!isEmail && (
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-12 border border-gray-200 rounded-xl px-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:border-yellow-400"
              >
                <option value="+91"> +91</option>
                <option value="+1"> +1</option>
                <option value="+44"> +44</option>
              </select>
            )}

            <input
              type="text"
              placeholder="Email or mobile number"
              className="flex-1 h-12 border border-gray-200 rounded-xl px-4 text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400"
              value={identifier}
              onChange={(e) => {
                const val = e.target.value;
                if (/[a-zA-Z@]/.test(val)) {
                  setIdentifier(val);
                } else if (val.length <= 10) {
                  setIdentifier(val);
                }
              }}
              required
            />
          </div>

          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-12 border border-gray-200 rounded-xl px-4 pr-10 text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-xs text-yellow-400 hover:text-yellow-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-indigo-600 text-white rounded-2xl
                    font-bold text-lg shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] transition-all duration-300 hover:bg-indigo-700 hover:shadow-[0_15px_25px_-5px_rgba(79,70,229,0.5)]"
          >
            {loading ? "Logging in..." : "Login Now"}
          </motion.button>
        </form>

        {/* GOOGLE LOGIN */}
        {loginRole === "user" && (
          <div className="mt-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
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

        {loginRole === "user" && (
          <p className="text-xs text-center text-gray-500 mt-8">
            New user?{" "}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Create account
            </Link>
          </p>
        )}
      </motion.div>
    </div >
  );
};

export default Login;
