import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F1FF] px-6">
      <div className="bg-white p-8 shadow-xl rounded-3xl w-full max-w-sm">
        
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>

        <form className="space-y-4">
          <input className="w-full p-3 bg-gray-100 border rounded-xl" placeholder="Full Name" />
          <input className="w-full p-3 bg-gray-100 border rounded-xl" placeholder="Email" />
          <input className="w-full p-3 bg-gray-100 border rounded-xl" placeholder="Password" />

          <button
            type="button"
            onClick={() => (window.location = "/dashboard")}
            className="w-full py-3 bg-[#6C63FF] text-white rounded-xl"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
