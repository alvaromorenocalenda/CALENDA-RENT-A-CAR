"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CalendarDays, ChevronRight, Clock3, MapPin } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/firebase";
import type { Booking } from "@/lib/types";
import { bookingStatusClass, bookingStatusLabel, dateTime, money } from "@/lib/utils";

function BookingImage({ booking }: { booking: Booking }) { return booking.vehicleImageUrl ? <img src={booking.vehicleImageUrl} alt={booking.vehicleName} /> : <div className="booking-image-placeholder"><span>CALENDA</span><strong>{booking.vehicleName}</strong></div>; }

export default function MisReservasPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (authLoading) return; if (!user) { setLoading(false); return; } (async () => { try { const snap = await getDocs(query(collection(db, "bookings"), where("userId", "==", user.uid))); const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, "id">) })); rows.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()); setBookings(rows); } catch (e) { console.error(e); } finally { setLoading(false); } })(); }, [user, authLoading]);
  const groups = useMemo(() => ({ upcoming: bookings.filter((b) => ["pendiente", "confirmada"].includes(b.status)), active: bookings.filter((b) => b.status === "activa"), past: bookings.filter((b) => ["finalizada", "cancelada"].includes(b.status)) }), [bookings]);
  if (authLoading || loading) return <><AppHeader /><div className="loading-screen"><div className="loader" /></div></>;
  return <div className="page"><AppHeader /><main className="client-app-main"><div className="container client-page-container"><div className="client-page-top"><div><p className="eyebrow">Área cliente</p><h1>Mis reservas</h1><p>Gestiona tus alquileres desde el móvil.</p></div><Link href="/vehiculos" className="btn btn-primary">Reservar un coche</Link></div>{!user ? <div className="client-empty"><CalendarDays /><strong>Inicia sesión para ver tus reservas</strong><p>Necesitas una cuenta para acceder al área de alquiler.</p><Link href="/login?next=/mis-reservas" className="btn btn-primary">Entrar</Link></div> : bookings.length ? <div className="client-bookings">{groups.active.length > 0 && <BookingGroup title="En curso" items={groups.active} active />}{groups.upcoming.length > 0 && <BookingGroup title="Próximas" items={groups.upcoming} />}{groups.past.length > 0 && <BookingGroup title="Anteriores" items={groups.past} />}</div> : <div className="client-empty"><CalendarDays /><strong>Todavía no tienes reservas</strong><p>Elige uno de los vehículos de la flota para empezar.</p><Link href="/vehiculos" className="btn btn-primary">Ver vehículos</Link></div>}</div></main><Footer /></div>;
}

function BookingGroup({ title, items, active = false }: { title: string; items: Booking[]; active?: boolean }) { return <section className="booking-group"><div className="booking-group-heading"><h2>{title}</h2><span>{items.length} {items.length === 1 ? "reserva" : "reservas"}</span></div><div className="booking-visual-list">{items.map((booking) => <Link href={`/reserva/${booking.id}`} className={`booking-visual-card ${active ? "is-active" : ""}`} key={booking.id}><div className="booking-visual-image"><BookingImage booking={booking} /></div><div className="booking-visual-content"><div className="booking-visual-status"><span className={bookingStatusClass(booking.status)}>{bookingStatusLabel(booking.status)}</span><span>{booking.paymentStatus === "pagado" ? "Pagado" : "Pago pendiente"}</span></div><h3>{booking.vehicleName}</h3><p className="booking-plate">Matrícula · {booking.vehiclePlate}</p><div className="booking-visual-details"><span><CalendarDays /> {dateTime(booking.startAt)} — {dateTime(booking.endAt)}</span><span><MapPin /> {booking.pickupCity}</span><strong>{money(booking.amount)}</strong></div><div className="booking-visual-action">{active ? <><Clock3 /> Alquiler en curso</> : <>Gestionar reserva <ChevronRight /></>}</div></div></Link>)}</div></section>; }
