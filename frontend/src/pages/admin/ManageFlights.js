import api from "../../api/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function ManageFlights() {
  const { theme } = useTheme();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    airline: "",
    code: "",
    from: "",
    to: "",
    price: "",
    seats: "",
    time: "",
    duration: "",
    type: "Non-stop"
  });

  useEffect(() => {
    api.get("/flights")
      .then((res) => {
        setFlights(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addFlight = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/flights", {
        ...form,
        price: Number(form.price),
        seats: Number(form.seats),
      });
      setFlights([res.data, ...flights]);
      setForm({
        airline: "", code: "", from: "", to: "", price: "",
        seats: "", time: "", duration: "", type: "Non-stop"
      });
      alert("Flight added successfully!");
    } catch (err) {
      alert("Failed to add flight");
    }
  };

  const deleteFlight = async (id) => {
    if (!window.confirm("Delete this flight?")) return;
    try {
      await api.delete(`/flights/${id}`);
      setFlights(flights.filter((f) => f._id !== id));
    } catch (err) {
      alert("Failed to delete flight");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl
                   backdrop-blur-2xl bg-white/80
                   shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                   p-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Flights
        </h1>

        {/* ADD FLIGHT FORM */}
        <div className="bg-white/50 p-6 rounded-xl mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Flight</h2>
          <form onSubmit={addFlight} className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input name="airline" value={form.airline} onChange={handleChange} placeholder="Airline (e.g. IndiGo)" className="h-10 border rounded-lg px-3 text-sm" required />
            <input name="code" value={form.code} onChange={handleChange} placeholder="Code (e.g. 6E-204)" className="h-10 border rounded-lg px-3 text-sm" required />
            <input name="from" value={form.from} onChange={handleChange} placeholder="From (e.g. Delhi)" className="h-10 border rounded-lg px-3 text-sm" required />
            <input name="to" value={form.to} onChange={handleChange} placeholder="To (e.g. Mumbai)" className="h-10 border rounded-lg px-3 text-sm" required />

            <input name="time" value={form.time} onChange={handleChange} placeholder="Time (e.g. 08:00 AM - 10:00 AM)" className="h-10 border rounded-lg px-3 text-sm" required />
            <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (e.g. 2h 30m)" className="h-10 border rounded-lg px-3 text-sm" required />
            <select name="type" value={form.type} onChange={handleChange} className="h-10 border rounded-lg px-3 text-sm">
              <option value="Non-stop">Non-stop</option>
              <option value="1 Stop">1 Stop</option>
              <option value="2 Stops">2 Stops</option>
            </select>

            <input type="number" name="seats" value={form.seats} onChange={handleChange} placeholder="Seats Available" className="h-10 border rounded-lg px-3 text-sm" required />
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price (₹)" className="h-10 border rounded-lg px-3 text-sm" required />

            <button
              type="submit"
              className="col-span-1 md:col-span-1 h-10 bg-indigo-600 text-white
                           rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Add Flight
            </button>
          </form>
        </div>

        {/* FLIGHTS TABLE */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-8 gap-2 px-4 py-4 bg-gray-100
                            text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <span className="col-span-1">Airline</span>
            <span className="col-span-1">Route</span>
            <span className="col-span-2">Time</span>
            <span className="col-span-1">Duration</span>
            <span className="col-span-1">Type</span>
            <span className="col-span-1">Price</span>
            <span className="col-span-1 text-right">Action</span>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading flights...</p>
          ) : flights.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No flights found.</p>
          ) : (
            flights.map((f) => (
              <div
                key={f._id}
                className="grid grid-cols-8 gap-2 px-4 py-4
                               border-t text-sm items-center hover:bg-gray-50 transition"
              >
                <div className="col-span-1">
                  <p className="font-semibold text-gray-800">{f.airline}</p>
                  <p className="text-xs text-gray-500">{f.code}</p>
                </div>
                <div className="col-span-1 text-gray-700">
                  {f.from} → {f.to}
                </div>
                <div className="col-span-2 text-gray-600 text-xs">
                  {f.time}
                </div>
                <div className="col-span-1 text-gray-600 text-xs">
                  {f.duration}
                </div>
                <div className="col-span-1 text-gray-600 text-xs">
                  {f.type}
                </div>
                <div className="col-span-1 font-semibold text-indigo-700">
                  ₹{f.price}
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => deleteFlight(f._id)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-600
                                   rounded hover:bg-red-200"
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
