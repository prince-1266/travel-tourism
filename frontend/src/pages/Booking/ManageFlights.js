import api from "../../api/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [form, setForm] = useState({
    airline: "",
    from: "",
    to: "",
    price: "",
    seats: "",
  });

  useEffect(() => {
    api.get("/flights").then((res) => setFlights(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addFlight = async (e) => {
    e.preventDefault();
    const res = await api.post("/flights", {
      ...form,
      price: Number(form.price),
      seats: Number(form.seats),
    });
    setFlights([res.data, ...flights]);
    setForm({ airline: "", from: "", to: "", price: "", seats: "" });
  };

  const deleteFlight = async (id) => {
    if (!window.confirm("Delete this flight?")) return;
    await api.delete(`/flights/${id}`);
    setFlights(flights.filter((f) => f._id !== id));
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/70 via-purple-700/70 to-blue-900/70" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl rounded-2xl
                     backdrop-blur-2xl bg-white/80
                     shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                     p-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Manage Flights
          </h1>

          {/* ADD FLIGHT */}
          <form
            onSubmit={addFlight}
            className="grid grid-cols-5 gap-3 mb-6"
          >
            {["airline", "from", "to", "price", "seats"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.toUpperCase()}
                className="h-10 border rounded-lg px-3 text-sm"
                required
              />
            ))}
            <button
              type="submit"
              className="col-span-5 h-10 bg-indigo-600 text-white
                         rounded-lg font-semibold"
            >
              Add Flight
            </button>
          </form>

          {/* FLIGHTS TABLE */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-100
                            text-sm font-semibold text-gray-600">
              <span>Airline</span>
              <span>From</span>
              <span>To</span>
              <span>Price</span>
              <span>Seats</span>
              <span className="text-right">Action</span>
            </div>

            {flights.map((f) => (
              <div
                key={f._id}
                className="grid grid-cols-6 gap-4 px-6 py-4
                           border-t text-sm items-center"
              >
                <span>{f.airline}</span>
                <span>{f.from}</span>
                <span>{f.to}</span>
                <span className="font-semibold text-indigo-700">
                  ₹{f.price}
                </span>
                <span>{f.seats}</span>
                <div className="text-right">
                  <button
                    onClick={() => deleteFlight(f._id)}
                    className="px-3 py-1.5 text-xs bg-red-500
                               text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
