import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    // 🔐 later: send new password to backend
    navigate("/login");
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
        className="relative z-10 w-full max-w-md p-6 rounded-3xl
                   backdrop-blur-xl bg-white/90 shadow-xl max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold text-center mb-1">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-4 text-sm">
          Create a new secure password
        </p>

        {error && (
          <p className="text-sm text-red-600 text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleReset}>
          {/* NEW PASSWORD */}
          <div className="relative mb-3">
            <input
              type={showPass ? "text" : "password"}
              placeholder="New password"
              className="w-full h-11 border border-gray-300 rounded-xl px-4 pr-10 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-5">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full h-11 border border-gray-300 rounded-xl px-4 pr-10 text-sm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* RESET BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full h-11 bg-indigo-600 text-white rounded-xl font-semibold text-sm"
          >
            Reset Password
          </motion.button>
        </form>

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

export default ResetPassword;
