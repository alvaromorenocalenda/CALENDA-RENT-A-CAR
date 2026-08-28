import Link from "next/link";
import { Fuel, Gauge, MapPin, Users } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { money } from "@/lib/utils";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return <article className="vehicle-card results-vehicle-card">
    <div className="vehicle-image-wrap">{vehicle.imageUrl ? <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className="vehicle-image" /> : <div className="vehicle-placeholder"><span>{vehicle.brand}</span><strong>{vehicle.model}</strong></div>}</div>
    <div className="vehicle-card-body"><div className="vehicle-title-row"><div><p className="vehicle-kicker">{vehicle.brand}</p><h2>{vehicle.model}</h2></div><div className="price"><strong>{money(vehicle.priceDay)}</strong><small>/ día</small></div></div>
      <div className="vehicle-specs results-specs"><span><Fuel />{vehicle.fuel}</span><span><Gauge />{vehicle.transmission}</span><span><Users />{vehicle.seats} plazas</span></div>
      <div className="vehicle-location"><MapPin />{vehicle.city}</div>
      <Link className="btn btn-primary btn-block vehicle-main-action" href={`/vehiculos/${vehicle.id}`}>Ver vehículo</Link>
    </div>
  </article>;
}
