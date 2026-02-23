import Trip from "../models/Trip.js";

/* CREATE TRIP */
export const createTrip = async (req, res) => {
    try {
        const { destination, startDate, endDate, travelers, budget, itinerary } =
            req.body;

        const trip = new Trip({
            destination,
            startDate,
            endDate,
            travelers,
            budget,
            itinerary,
            createdBy: req.user.id,
            status: "planned",
        });

        await trip.save();
        res.status(201).json(trip);
    } catch (err) {
        res.status(500).json({ message: "Failed to create trip", error: err.message });
    }
};

/* GET ALL USER TRIPS */
export const getUserTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ createdBy: req.user.id }).sort({
            createdAt: -1,
        });
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch trips" });
    }
};

/* GET TRIP BY ID */
export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        // Authorization check
        if (trip.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.status(200).json(trip);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch trip" });
    }
};
