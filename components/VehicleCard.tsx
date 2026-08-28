import Link from "next/link";
import { Fuel, Gauge, MapPin, Users } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { money } from "@/lib/utils";

export default function VehicleCard({ vehicle, query = "" }: { vehicle: Vehicle; query?: string }) {
  const href = `/vehiculos/${vehicle.id}${query ? `?${query}` : ""}`;
  return (
    <article className="vehicle-card results-vehicle-card">
      <Link href={href} className="vehicle-image-wrap" aria-label={`Ver ${vehicle.brand} ${vehicle.model}`}>
        {vehicle.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className="vehicle-image" />
        ) : (
          <div className="vehicle-placeholder"><span>{vehicle.brand}</span><strong>{vehicle.model}</strong></div>
        )}
      </Link>
      <div className="vehicle-card-body">
        <div className="vehicle-title-row">
          <div><h2>{vehicle.brand} {vehicle.model}</h2></div>
          <div className="price"><strong>{money(vehicle.priceDay)}</strong><small>/ día</small></div>
        </div>
        <div className="vehicle-specs results-specs">
          <span><Fuel />{vehicle.fuel}</span>
          <span><Gauge />{vehicle.transmission}</span>
          <span><Users />{vehicle.seats} plazas</span>
        </div>
        <div className="vehicle-location"><MapPin />{vehicle.city}</div>
        <Link className="btn btn-primary vehicle-main-action" href={href}>Ver coche</Link>
      </div>
    </article>
  );
}
