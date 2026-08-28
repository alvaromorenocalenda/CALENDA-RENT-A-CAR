"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { MapPinned } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { db } from "@/lib/firebase";
import type { Booking, Vehicle } from "@/lib/types";
import { bookingStatusClass, bookingStatusLabel, dateTime } from "@/lib/utils";

export default function AdminPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [vSnap, bSnap, uSnap] = await Promise.all([
          getDocs(collection(db, "vehicles")),
          getDocs(collection(db, "bookings")),
          getDocs(collection(db, "users")),
        ]);
        setVehicles(vSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) })));
        const rows = bSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, "id">) }));
        rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(rows);
        setUsersCount(uSnap.size);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const available = vehicles.filter((v) => v.status === "disponible" && v.active !== false).length;
  const activeRentals = bookings.filter((b) => b.status === "activa").length;
  const pending = bookings.filter((b) => b.status === "pendiente").length;

  return (
    <AdminShell title="Resumen" description="Control general de flota, reservas, clientes y preparación telemática." action={<Link className="btn btn-primary" href="/admin/vehiculos">Gestionar flota</Link>}>
      {loading ? <div className="loading-screen"><div className="loader" /></div> : <>
        <div className="stats">
          <div className="stat"><span>Vehículos</span><strong>{vehicles.length}</strong></div>
          <div className="stat"><span>Disponibles</span><strong>{available}</strong></div>
          <div className="stat"><span>Alquileres activos</span><strong>{activeRentals}</strong></div>
          <div className="stat"><span>Clientes</span><strong>{usersCount}</strong></div>
        </div>

        {pending > 0 && <div className="notice notice-warning" style={{ marginBottom: 20 }}>Tienes <strong>{pending}</strong> reserva(s) pendiente(s) de revisar, confirmar y marcar como pagadas.</div>}

        <section className="panel">
          <div className="panel-head"><h2>Estado de la flota</h2><Link href="/admin/vehiculos" className="btn btn-small btn-light">Ver todos</Link></div>
          {vehicles.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Vehículo</th><th>Estado</th><th>Ubicación</th><th>Tracker</th><th>Telemática</th></tr></thead><tbody>{vehicles.slice(0, 8).map((v) => <tr key={v.id}><td><strong>{v.brand} {v.model}</strong><div className="muted small">{v.plate}</div></td><td><span className={`badge ${v.status === "disponible" ? "badge-success" : "badge-warning"}`}>{v.status}</span></td><td><MapPinned size={13} /> {v.city}</td><td>{v.trackerId || "—"}</td><td>{v.telematicsEnabled ? "Preparada" : "Pendiente"}</td></tr>)}</tbody></table></div> : <div className="empty-state"><strong>No hay vehículos</strong><Link href="/admin/vehiculos" className="btn btn-primary">Añadir primer vehículo</Link></div>}
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Últimas reservas</h2><Link href="/admin/reservas" className="btn btn-small btn-light">Ver todas</Link></div>
          {bookings.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Cliente</th><th>Vehículo</th><th>Inicio</th><th>Estado</th></tr></thead><tbody>{bookings.slice(0, 8).map((b) => <tr key={b.id}><td><strong>{b.userName || "Cliente"}</strong><div className="muted small">{b.userEmail}</div></td><td>{b.vehicleName}<div className="muted small">{b.vehiclePlate}</div></td><td>{dateTime(b.startAt)}</td><td><span className={bookingStatusClass(b.status)}>{bookingStatusLabel(b.status)}</span></td></tr>)}</tbody></table></div> : <div className="empty-state">Todavía no hay reservas.</div>}
        </section>
      </>}
    </AdminShell>
  );
}
