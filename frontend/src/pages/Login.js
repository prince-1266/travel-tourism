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
      className={`h-screen flex items-center justify-center relative bg-theme-global ${theme} transition-colors duration-500`}
    >
      {/* overlay */}
      <div className={`absolute inset-0 z-0 ${theme === 'dark' ? 'bg-black/80' : 'bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-blue-900/40'}`} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-6 rounded-3xl
        backdrop-blur-xl bg-white/90 shadow-xl"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-all duration-300"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-1 mt-2">
          Welcome to TripWell
        </h2>
        <p className="text-center text-gray-600 mb-4 text-sm">
          Log in to continue your journey
        </p>

        {/* ROLE SELECT */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {["user", "admin"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setLoginRole(role)}
              className={`p-3 rounded-2xl border text-left transition
                ${loginRole === role
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 bg-white"
                }`}
            >
              <p className="font-semibold capitalize">{role}</p>
              <p className="text-xs text-gray-500">
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
          <div className="flex gap-2 mb-3">
            {/* Show Country Code only if not email */}
            {!isEmail && (
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-11 border border-gray-300 rounded-xl px-2 text-sm bg-white"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
            )}

            <input
              type="text"
              placeholder="Email or mobile number"
              className="flex-1 h-11 border border-gray-300 rounded-xl px-4 text-sm"
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

          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-11 border border-gray-300 rounded-xl px-4 pr-10 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 text-white rounded-xl
                    font-semibold text-sm"
          >
            {loading ? "Logging in…" : "Log in 🚀"}
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
          <p className="text-xs text-center text-gray-600 mt-4">
            New user?{" "}
            <Link to="/register" className="text-indigo-600 underline">
              Create account
            </Link>
          </p>
        )}
      </motion.div>
    </div >
  );
};

export default Login;
