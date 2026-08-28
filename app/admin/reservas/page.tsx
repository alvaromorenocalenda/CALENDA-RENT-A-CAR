"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, updateDoc, writeBatch } from "firebase/firestore";
import AdminShell from "@/components/AdminShell";
import { db } from "@/lib/firebase";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";
import { bookingStatusClass, bookingStatusLabel, dateTime, money } from "@/lib/utils";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("todas");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, "bookings"));
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, "id">) }));
      rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(rows);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  const shown = useMemo(() => filter === "todas" ? bookings : bookings.filter((b) => b.status === filter), [bookings, filter]);

  const setStatus = async (b: Booking, status: BookingStatus) => {
    setBusyId(b.id);
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);
      batch.update(doc(db, "bookings", b.id), { status, updatedAt: now });
      const availabilityStatus = status === "cancelada" ? "cancelada" : status === "finalizada" ? "finalizada" : status === "activa" ? "activa" : "reservada";
      batch.update(doc(db, "availability", b.id), { status: availabilityStatus, updatedAt: now });
      await batch.commit();
      await load();
    } catch (e) { console.error(e); alert("No se ha podido actualizar la reserva."); }
    finally { setBusyId(null); }
  };

  const setPayment = async (b: Booking, paymentStatus: PaymentStatus) => {
    setBusyId(b.id);
    try { await updateDoc(doc(db, "bookings", b.id), { paymentStatus, updatedAt: new Date().toISOString() }); await load(); }
    catch (e) { console.error(e); alert("No se ha podido actualizar el pago."); }
    finally { setBusyId(null); }
  };

  return (
    <AdminShell title="Reservas" description="Revisión y control manual del ciclo completo mientras conectamos pagos y telemática.">
      <section className="panel">
        <div className="panel-head">
          <h2>Reservas ({shown.length})</h2>
          <select className="select" style={{ width: 190 }} value={filter} onChange={(e) => setFilter(e.target.value)}><option value="todas">Todas</option><option value="pendiente">Pendientes</option><option value="confirmada">Confirmadas</option><option value="activa">En curso</option><option value="finalizada">Finalizadas</option><option value="cancelada">Canceladas</option></select>
        </div>
        {shown.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Cliente</th><th>Vehículo</th><th>Fechas</th><th>Importe</th><th>Estado</th><th>Inspecciones</th><th>Acciones</th></tr></thead><tbody>{shown.map((b) => <tr key={b.id}>
          <td><strong>{b.userName || "Cliente"}</strong><div className="muted small">{b.userEmail}</div></td>
          <td><strong>{b.vehicleName}</strong><div className="muted small">{b.vehiclePlate}</div></td>
          <td>{dateTime(b.startAt)}<div className="muted small">hasta {dateTime(b.endAt)}</div></td>
          <td>{money(b.amount)}<div className="muted small">Fianza {money(b.deposit)}</div></td>
          <td><span className={bookingStatusClass(b.status)}>{bookingStatusLabel(b.status)}</span><div style={{ marginTop: 5 }}><span className={b.paymentStatus === "pagado" ? "badge badge-success" : "badge badge-warning"}>{b.paymentStatus}</span></div></td>
          <td><div className="small">Inicial: {b.inspectionInitialComplete ? "✅" : "—"}</div><div className="small">Final: {b.inspectionFinalComplete ? "✅" : "—"}</div></td>
          <td><div style={{ display: "flex", flexWrap: "wrap", gap: 6, minWidth: 220 }}>
            {b.paymentStatus !== "pagado" && b.status !== "cancelada" && <button className="btn btn-small btn-light" disabled={busyId === b.id} onClick={() => setPayment(b, "pagado")}>Marcar pagado</button>}
            {b.status === "pendiente" && <button className="btn btn-small btn-primary" disabled={busyId === b.id || b.paymentStatus !== "pagado"} onClick={() => setStatus(b, "confirmada")}>Confirmar</button>}
            {b.status === "confirmada" && <button className="btn btn-small btn-dark" disabled={busyId === b.id || !b.inspectionInitialComplete} onClick={() => setStatus(b, "activa")}>Iniciar</button>}
            {b.status === "activa" && <button className="btn btn-small btn-primary" disabled={busyId === b.id || !b.inspectionFinalComplete} onClick={() => setStatus(b, "finalizada")}>Finalizar</button>}
            {["pendiente", "confirmada"].includes(b.status) && <button className="btn btn-small btn-danger" disabled={busyId === b.id} onClick={() => setStatus(b, "cancelada")}>Cancelar</button>}
          </div></td>
        </tr>)}</tbody></table></div> : <div className="empty-state">No hay reservas con ese estado.</div>}
      </section>
      <div className="notice notice-info" style={{ marginTop: 18 }}>En producción, “pagado”, “iniciar” y “finalizar” pasarán a estar gobernados por la pasarela, la franja horaria, las inspecciones y el servidor telemático.</div>
    </AdminShell>
  );
}
