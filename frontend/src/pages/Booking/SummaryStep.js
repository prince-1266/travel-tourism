export default function SummaryStep({ trip }) {
  if (!trip || !trip.flight || !trip.hotel) {
    return (
      <div className="p-10 text-center">
        Loading summary...
      </div>
    );
  }

  const flightCost = trip.flight.price * trip.persons;
  const hotelCost = trip.hotel.price * trip.days;
  const total = flightCost + hotelCost;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
      <p>Flight: ₹{flightCost}</p>
      <p>Hotel: ₹{hotelCost}</p>
      <p className="font-bold mt-2">Total: ₹{total}</p>
    </div>
  );
}
