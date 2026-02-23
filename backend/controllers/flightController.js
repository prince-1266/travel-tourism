import Flight from "../models/Flight.js";

const SAMPLE_FLIGHTS = [
    {
        airline: "IndiGo",
        code: "6E-204",
        from: "Delhi",
        to: "Destination",
        time: "08:00 AM - 10:30 AM",
        duration: "2h 30m",
        price: 4500,
        type: "Non-stop",
        seats: 60
    },
    {
        airline: "Air India",
        code: "AI-505",
        from: "Delhi",
        to: "Destination",
        time: "11:15 AM - 01:45 PM",
        duration: "2h 30m",
        price: 5200,
        type: "Non-stop",
        seats: 50
    },
    {
        airline: "Vistara",
        code: "UK-993",
        from: "Delhi",
        to: "Destination",
        time: "05:45 PM - 08:30 PM",
        duration: "2h 45m",
        price: 6800,
        type: "Non-stop",
        seats: 45
    }
];

export const getFlights = async (req, res) => {
    try {
        let flights = await Flight.find();

        if (flights.length === 0) {
            console.log("Seeding initial flights...");
            await Flight.insertMany(SAMPLE_FLIGHTS);
            flights = await Flight.find();
        }

        res.json(flights);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch flights" });
    }
};

export const createFlight = async (req, res) => {
    try {
        const flight = await Flight.create(req.body);
        res.status(201).json(flight);
    } catch (err) {
        res.status(500).json({ message: "Failed to create flight" });
    }
};

export const deleteFlight = async (req, res) => {
    try {
        await Flight.findByIdAndDelete(req.params.id);
        res.json({ message: "Flight deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete flight" });
    }
};
