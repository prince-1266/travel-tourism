import Hotel from "../models/Hotel.js";

// Sample data to seed if empty
const SAMPLE_HOTELS = [
    {
        name: "Grand Palace Hotel",
        location: "Default", // Will match any query if we loosen filters, or we can update later
        rating: 4.5,
        price: 3500,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60",
        type: "Luxury"
    },
    {
        name: "City Comfort Inn",
        location: "Default",
        rating: 4.0,
        price: 2200,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60",
        type: "Budget"
    },
    {
        name: "The Royal Resort",
        location: "Default",
        rating: 4.8,
        price: 5500,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60",
        type: "Resort"
    }
];

export const getHotels = async (req, res) => {
    try {
        // 1. Check if we have hotels
        let hotels = await Hotel.find();

        // 2. If empty, SEED them automatically
        if (hotels.length === 0) {
            console.log("Seeding initial hotels...");
            await Hotel.insertMany(SAMPLE_HOTELS);
            hotels = await Hotel.find();
        }

        // 3. Filter by location if query param exists (optional improvement)
        // const { destination } = req.query;
        // if (destination) {
        //    hotels = hotels.filter(h => h.location.toLowerCase() === destination.toLowerCase() || h.location === 'Default');
        // }

        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch hotels" });
    }
};

export const createHotel = async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        await newHotel.save();
        res.status(201).json(newHotel);
    } catch (err) {
        res.status(500).json({ message: "Failed to create hotel" });
    }
};
