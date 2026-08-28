"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CalendarDays, MapPin } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/firebase";
import type { Booking } from "@/lib/types";
import { bookingStatusClass, bookingStatusLabel, dateTime, money } from "@/lib/utils";

export default function MisReservasPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "bookings"), where("userId", "==", user.uid)));
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, "id">) }));
        rows.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
        setBookings(rows);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [user, authLoading]);

  if (authLoading || loading) return <><AppHeader /><div className="loading-screen"><div className="loader" /></div></>;

  return (
    <div className="page">
      <AppHeader />
      <main className="page-main">
        <div className="container">
          <div className="page-heading">
            <div><p className="eyebrow">Área cliente</p><h1>Mis reservas</h1><p>Desde aquí realizarás las inspecciones, apertura y devolución de cada alquiler.</p></div>
            <Link href="/vehiculos" className="btn btn-primary">Reservar un coche</Link>
          </div>

          {!user ? (
            <div className="panel"><div className="empty-state"><strong>Inicia sesión para ver tus reservas</strong><p>Necesitas una cuenta para acceder al área de alquiler.</p><Link href="/login?next=/mis-reservas" className="btn btn-primary">Entrar</Link></div></div>
          ) : bookings.length ? (
            <div className="booking-list">
              {bookings.map((booking) => (
                <article className="booking-card" key={booking.id}>
                  <div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                      <span className={bookingStatusClass(booking.status)}>{bookingStatusLabel(booking.status)}</span>
                      <span className={booking.paymentStatus === "pagado" ? "badge badge-success" : "badge badge-warning"}>{booking.paymentStatus === "pagado" ? "Pagado" : "Pago pendiente"}</span>
                    </div>
                    <h3>{booking.vehicleName} · {booking.vehiclePlate}</h3>
                    <div className="booking-meta">
                      <span><CalendarDays size={14} /> {dateTime(booking.startAt)} → {dateTime(booking.endAt)}</span>
                      <span><MapPin size={14} /> {booking.pickupCity}</span>
                      <span>{money(booking.amount)}</span>
                    </div>
                  </div>
                  <Link href={`/reserva/${booking.id}`} className="btn btn-dark">Gestionar reserva</Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="panel"><div className="empty-state"><CalendarDays size={34} /><strong>Todavía no tienes reservas</strong><p>Elige uno de los vehículos de la flota para empezar.</p><Link href="/vehiculos" className="btn btn-primary">Ver vehículos</Link></div></div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
