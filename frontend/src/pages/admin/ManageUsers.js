import api from "../../api/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function ManageUsers() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users").then((res) => {
      // ✅ hide admin completely
      const onlyUsers = res.data.filter((u) => u.role !== "admin");
      setUsers(onlyUsers);
      setLoading(false);
    });
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter((u) => u._id !== id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl
                   backdrop-blur-2xl bg-white/80
                   shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                   p-8"
      >
        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Users
        </h1>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-100 text-sm font-semibold text-gray-600">
            <span>Name</span>
            <span>Email</span>
            <span className="text-right">Action</span>
          </div>

          {/* TABLE BODY */}
          {loading ? (
            <p className="p-6 text-gray-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="p-6 text-gray-500">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-3 gap-4 px-6 py-4 items-center
                             border-t text-sm hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-800">
                  {user.name}
                </span>

                <span className="text-gray-600">
                  {user.email}
                </span>

                <div className="text-right">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-1.5 text-xs font-semibold
                                 bg-red-500 text-white rounded-lg
                                 hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
