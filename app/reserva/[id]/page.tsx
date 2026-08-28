"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { Camera, KeyRound, LockKeyhole, MapPin, ShieldCheck, UnlockKeyhole } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/firebase";
import type { Booking, Vehicle } from "@/lib/types";
import { bookingStatusClass, bookingStatusLabel, dateTime, money, reservationWindow } from "@/lib/utils";

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const snap = await getDoc(doc(db, "bookings", params.id));
      if (!snap.exists()) return;
      const data = { id: snap.id, ...(snap.data() as Omit<Booking, "id">) };
      setBooking(data);
      const vehicleSnap = await getDoc(doc(db, "vehicles", data.vehicleId));
      if (vehicleSnap.exists()) setVehicle({ id: vehicleSnap.id, ...(vehicleSnap.data() as Omit<Vehicle, "id">) });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace(`/login?next=${encodeURIComponent(`/reserva/${params.id}`)}`); return; }
    load();
  }, [user, authLoading, params.id, router]);

  const windowState = useMemo(() => booking ? reservationWindow(booking.startAt, booking.endAt) : null, [booking]);
  const isOwner = !!booking && !!user && booking.userId === user.uid;
  const isAdmin = profile?.role === "admin";
  const canInspectInitial = !!booking && ["pendiente", "confirmada"].includes(booking.status) && !booking.inspectionInitialComplete;
  const canInspectFinal = !!booking && ["activa", "confirmada"].includes(booking.status) && !!booking.inspectionInitialComplete && !booking.inspectionFinalComplete;
  const canOpen = !!booking && booking.status === "confirmada" && booking.paymentStatus === "pagado" && !!booking.inspectionInitialComplete && !!windowState?.active;

  const cancel = async () => {
    if (!booking || !confirm("¿Quieres cancelar esta reserva?")) return;
    setBusy(true);
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);
      batch.update(doc(db, "bookings", booking.id), { status: "cancelada", updatedAt: now });
      batch.update(doc(db, "availability", booking.id), { status: "cancelada", updatedAt: now });
      await batch.commit();
      await load();
    } catch (e) { console.error(e); setMessage("No se ha podido cancelar la reserva."); }
    finally { setBusy(false); }
  };

  const telematics = (command: "open" | "close") => {
    if (!canOpen && command === "open") {
      setMessage("Todavía no se cumplen todas las condiciones: reserva confirmada y pagada, inspección inicial completa y estar dentro de la franja horaria.");
      return;
    }
    setMessage(vehicle?.telematicsEnabled
      ? "El vehículo está marcado como preparado para telemática, pero el servidor Teltonika todavía no está conectado. No se ha enviado ninguna orden real."
      : "Apertura remota todavía no configurada. Cuando instalemos FMC130 + CAN-CONTROL esta acción se conectará al backend telemático.");
  };

  if (authLoading || loading) return <><AppHeader /><div className="loading-screen"><div className="loader" /></div></>;
  if (!booking || (!isOwner && !isAdmin)) return <><AppHeader /><main className="page-main"><div className="container"><div className="panel"><div className="empty-state"><strong>Reserva no disponible</strong><p>No existe o no tienes permiso para verla.</p></div></div></div></main></>;

  const timeline = [
    { label: "Reserva creada", note: dateTime(booking.createdAt), done: true },
    { label: "Pago y confirmación", note: booking.paymentStatus === "pagado" && booking.status !== "pendiente" ? "Completado" : "Pendiente de administración/pasarela", done: booking.paymentStatus === "pagado" && booking.status !== "pendiente" },
    { label: "Inspección inicial", note: booking.inspectionInitialComplete ? "Fotografías guardadas" : "Pendiente", done: !!booking.inspectionInitialComplete },
    { label: "Alquiler en curso", note: booking.status === "activa" ? "Vehículo en uso" : booking.status === "finalizada" ? "Completado" : "Pendiente", done: ["activa", "finalizada"].includes(booking.status) },
    { label: "Inspección final", note: booking.inspectionFinalComplete ? "Fotografías guardadas" : "Pendiente", done: !!booking.inspectionFinalComplete },
    { label: "Reserva finalizada", note: booking.status === "finalizada" ? "Completada" : "Pendiente", done: booking.status === "finalizada" },
  ];

  return (
    <div className="page">
      <AppHeader />
      <main className="page-main">
        <div className="container">
          <div className="page-heading">
            <div><p className="eyebrow">Reserva {booking.id.slice(0, 8).toUpperCase()}</p><h1>{booking.vehicleName}</h1><p>{booking.vehiclePlate} · {dateTime(booking.startAt)} → {dateTime(booking.endAt)}</p></div>
            <span className={bookingStatusClass(booking.status)}>{bookingStatusLabel(booking.status)}</span>
          </div>

          <div className="booking-detail-grid">
            <div>
              <section className="panel">
                <div className="panel-head"><h2>Estado del alquiler</h2><span className={booking.paymentStatus === "pagado" ? "badge badge-success" : "badge badge-warning"}>{booking.paymentStatus === "pagado" ? "Pago completado" : "Pago pendiente"}</span></div>
                <div className="panel-body" style={{ display: "grid", gap: 18 }}>{timeline.map((item) => <div key={item.label} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10 }}><div style={{ width: 16, height: 16, borderRadius: 50, marginTop: 2, background: item.done ? "#14805e" : "#d7e0e8", boxShadow: `0 0 0 4px ${item.done ? "#e9f8f1" : "#f0f3f6"}` }} /><div><strong style={{ color: "#0b1f33" }}>{item.label}</strong><div className="muted small">{item.note}</div></div></div>)}</div>
              </section>

              <section className="panel">
                <div className="panel-head"><h2>Datos de la reserva</h2></div>
                <div className="panel-body spec-grid" style={{ marginTop: 0 }}>
                  <div className="spec-box"><span>Inicio</span><strong>{dateTime(booking.startAt)}</strong></div><div className="spec-box"><span>Fin</span><strong>{dateTime(booking.endAt)}</strong></div><div className="spec-box"><span>Alquiler</span><strong>{money(booking.amount)}</strong></div><div className="spec-box"><span>Fianza</span><strong>{money(booking.deposit)}</strong></div><div className="spec-box"><span>Zona</span><strong><MapPin size={13} /> {booking.pickupCity}</strong></div><div className="spec-box"><span>Recogida</span><strong>{booking.pickupAddress || "Por definir"}</strong></div>
                </div>
              </section>
            </div>

            <aside className="panel">
              <div className="panel-head"><h3>Acciones</h3></div>
              <div className="panel-body action-stack">
                {message && <div className="notice notice-info">{message}</div>}
                {canInspectInitial && <Link className="btn btn-primary btn-block" href={`/reserva/${booking.id}/inspeccion?tipo=inicial`}><Camera size={18} /> Hacer fotos iniciales</Link>}
                {booking.inspectionInitialComplete && <Link className="btn btn-light btn-block" href={`/reserva/${booking.id}/inspeccion?tipo=inicial`}><Camera size={18} /> Ver / repetir fotos iniciales</Link>}
                <button className="btn btn-dark btn-block" disabled={!canOpen} onClick={() => telematics("open")}><UnlockKeyhole size={18} /> Abrir vehículo</button>
                <div className="notice notice-warning"><KeyRound size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />El futuro inmovilizador se habilitará por reserva; nunca se cortará un motor que esté circulando.</div>
                {canInspectFinal && <Link className="btn btn-primary btn-block" href={`/reserva/${booking.id}/inspeccion?tipo=final`}><Camera size={18} /> Hacer fotos de devolución</Link>}
                {booking.inspectionFinalComplete && <Link className="btn btn-light btn-block" href={`/reserva/${booking.id}/inspeccion?tipo=final`}><Camera size={18} /> Ver fotos finales</Link>}
                <button className="btn btn-light btn-block" disabled={!booking.inspectionFinalComplete} onClick={() => telematics("close")}><LockKeyhole size={18} /> Cerrar vehículo</button>
                <div className="notice notice-info"><ShieldCheck size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />Apertura/cierre reales quedan bloqueados hasta integrar un backend telemático autenticado.</div>
                {["pendiente", "confirmada"].includes(booking.status) && <button className="btn btn-danger btn-block" disabled={busy} onClick={cancel}>Cancelar reserva</button>}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
