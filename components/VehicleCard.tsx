import Link from "next/link";
import { ArrowUpRight, Fuel, Gauge, MapPin, Users } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { money } from "@/lib/utils";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="vehicle-card premium-vehicle-card">
      <div className="vehicle-image-wrap">
        {vehicle.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className="vehicle-image" />
        ) : (
          <div className="vehicle-placeholder premium-vehicle-placeholder">
            <span className="vehicle-placeholder-brand">{vehicle.brand}</span>
            <strong>{vehicle.model}</strong>
            <small>{vehicle.year} · {vehicle.fuel}</small>
          </div>
        )}
        <span className={`vehicle-status vehicle-status-${vehicle.status}`}><i /> {vehicle.status}</span>
      </div>
      <div className="vehicle-card-body">
        <div className="vehicle-title-row">
          <div>
            <p className="vehicle-kicker">{vehicle.year} · {vehicle.plate}</p>
            <h3>{vehicle.brand} {vehicle.model}</h3>
          </div>
          <div className="price"><strong>{money(vehicle.priceDay)}</strong><small>por día</small></div>
        </div>
        <div className="vehicle-specs premium-specs">
          <span><Fuel size={14} /> {vehicle.fuel}</span>
          <span><Gauge size={14} /> {vehicle.transmission}</span>
          <span><Users size={14} /> {vehicle.seats} plazas</span>
        </div>
        <div className="vehicle-card-bottom">
          <div className="vehicle-location"><MapPin size={14} /> {vehicle.city}</div>
          <Link className="vehicle-arrow-link" href={`/vehiculos/${vehicle.id}`} aria-label={`Ver ${vehicle.brand} ${vehicle.model}`}><ArrowUpRight size={18} /></Link>
        </div>
        <Link className="btn btn-dark btn-block vehicle-main-action" href={`/vehiculos/${vehicle.id}`}>Ver disponibilidad</Link>
      </div>
    </article>
  );
}
