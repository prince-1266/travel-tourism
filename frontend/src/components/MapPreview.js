import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapPreview = ({ from, to }) => {
  const center = from
    ? [from.lat, from.lng]
    : [20.5937, 78.9629]; // India

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "350px", width: "100%" }}
      className="rounded-2xl shadow"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {from && (
        <Marker position={[from.lat, from.lng]}>
          <Popup>From: {from.name}</Popup>
        </Marker>
      )}

      {to && (
        <Marker position={[to.lat, to.lng]}>
          <Popup>To: {to.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapPreview;
