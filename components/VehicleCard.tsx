import Link from "next/link";
import { Fuel, Gauge, MapPin, Users } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { money } from "@/lib/utils";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-image-wrap">
        {vehicle.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className="vehicle-image" />
        ) : (
          <div className="vehicle-placeholder">
            <span>{vehicle.brand}</span>
            <strong>{vehicle.model}</strong>
          </div>
        )}
        <span className={`vehicle-status vehicle-status-${vehicle.status}`}>{vehicle.status}</span>
      </div>
      <div className="vehicle-card-body">
        <div className="vehicle-title-row">
          <div>
            <p className="eyebrow">{vehicle.year} · {vehicle.plate}</p>
            <h3>{vehicle.brand} {vehicle.model}</h3>
          </div>
          <div className="price"><strong>{money(vehicle.priceDay)}</strong><small>/día</small></div>
        </div>
        <div className="vehicle-specs">
          <span><Fuel size={15} /> {vehicle.fuel}</span>
          <span><Gauge size={15} /> {vehicle.transmission}</span>
          <span><Users size={15} /> {vehicle.seats} plazas</span>
        </div>
        <div className="vehicle-location"><MapPin size={15} /> {vehicle.city}</div>
        <Link className="btn btn-dark btn-block" href={`/vehiculos/${vehicle.id}`}>Ver y reservar</Link>
      </div>
    </article>
  );
}
