import Link from "next/link";
import { CarFront, LockKeyhole, MapPinned, Plus, UnlockKeyhole } from "lucide-react";

const fleet = [
  { name: "Citroën C4 Cactus", plate: "0000 DEMO", status: "Disponible", location: "Higuera la Real", battery: "12,6 V" },
  { name: "Peugeot 208", plate: "0001 DEMO", status: "Disponible", location: "Higuera la Real", battery: "12,5 V" },
  { name: "Citroën Berlingo", plate: "0002 DEMO", status: "Alquilado", location: "Fregenal de la Sierra", battery: "12,4 V" },
];

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div className="container">
          <Link href="/" className="brand" style={{ color: "white" }}>
            <span className="brand-mark"><CarFront size={22} /></span>
            <span><strong>CALENDA</strong><small style={{ color: "#a9bdce" }}>ADMIN · RENT A CAR</small></span>
          </Link>
          <Link href="/" className="btn btn-small btn-light">Ver web pública</Link>
        </div>
      </div>
      <div className="container admin-main">
        <div className="admin-heading">
          <div><h1>Panel de flota</h1><p>Primera maqueta del panel desde el que gestionaremos vehículos, reservas, clientes y telemática.</p></div>
          <button className="btn btn-primary"><Plus size={17} /> Añadir vehículo</button>
        </div>

        <div className="stats">
          <div className="stat"><span>Vehículos</span><strong>3</strong></div>
          <div className="stat"><span>Disponibles</span><strong>2</strong></div>
          <div className="stat"><span>Alquilados</span><strong>1</strong></div>
          <div className="stat"><span>Reservas hoy</span><strong>2</strong></div>
        </div>

        <section className="panel">
          <div className="panel-head"><h2>Estado de la flota</h2><span style={{ color: "#6b7280", fontSize: 13 }}>Datos de demostración</span></div>
          {fleet.map((vehicle) => (
            <div className="data-row" key={vehicle.plate}>
              <div><strong>{vehicle.name}</strong><div style={{ color: "#6b7280", marginTop: 4 }}>{vehicle.plate}</div></div>
              <span className="status">● {vehicle.status}</span>
              <span><MapPinned size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />{vehicle.location}</span>
              <span>{vehicle.battery}</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Control remoto · próxima fase</h2></div>
          <div style={{ padding: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-dark" disabled><UnlockKeyhole size={18} /> Abrir vehículo</button>
            <button className="btn btn-light" disabled><LockKeyhole size={18} /> Cerrar vehículo</button>
            <span style={{ color: "#6b7280", alignSelf: "center", fontSize: 14 }}>Los botones se activarán cuando integremos el servidor telemático/Teltonika.</span>
          </div>
        </section>
      </div>
    </main>
  );
}
