"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { Fuel, Gauge, MapPin, Users } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/firebase";
import { firstCalendaVehicle } from "@/lib/fallbackVehicle";
import type { Vehicle } from "@/lib/types";
import { bookingTotal, money, rentalDays } from "@/lib/utils";

function localInputValue(date = new Date(Date.now() + 60 * 60 * 1000)) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [startAt, setStartAt] = useState(searchParams.get("start") || localInputValue());
  const [endAt, setEndAt] = useState(searchParams.get("end") || localInputValue(new Date(Date.now() + 25 * 60 * 60 * 1000)));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (params.id === firstCalendaVehicle.id) {
          setVehicle(firstCalendaVehicle);
          setActiveImage(firstCalendaVehicle.imageUrl || "");
          return;
        }
        const snap = await getDoc(doc(db, "vehicles", params.id));
        if (snap.exists()) {
          const loadedVehicle = { id: snap.id, ...(snap.data() as Omit<Vehicle, "id">) };
          setVehicle(loadedVehicle);
          setActiveImage(loadedVehicle.imageUrl || "");
        }
      } finally { setLoading(false); }
    })();
  }, [params.id]);

  const days = vehicle ? rentalDays(startAt, endAt) : 0;
  const amount = useMemo(() => vehicle ? bookingTotal(startAt, endAt, vehicle.priceDay) : 0, [startAt, endAt, vehicle]);

  const reserve = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!vehicle) return;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/vehiculos/${vehicle.id}`)}`);
      return;
    }
    if (!profile?.phone || !profile?.dni || !profile?.drivingLicense) {
      setError("Antes de reservar completa teléfono, DNI/NIE y permiso de conducir en Mi cuenta.");
      return;
    }
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return setError("La fecha de devolución debe ser posterior a la de inicio.");
    if (start.getTime() < Date.now() - 5 * 60 * 1000) return setError("La reserva no puede empezar en el pasado.");
    if (vehicle.status !== "disponible") return setError("Este vehículo no está disponible actualmente.");

    setBusy(true);
    try {
      const isoStart = start.toISOString();
      const isoEnd = end.toISOString();
      const availabilitySnap = await getDocs(query(collection(db, "availability"), where("vehicleId", "==", vehicle.id)));
      const conflict = availabilitySnap.docs.some((d) => {
        const a = d.data() as { startAt: string; endAt: string; status: string };
        if (["cancelada", "finalizada"].includes(a.status)) return false;
        return new Date(isoStart).getTime() < new Date(a.endAt).getTime() && new Date(isoEnd).getTime() > new Date(a.startAt).getTime();
      });
      if (conflict) {
        setError("Ese vehículo ya tiene una reserva que se cruza con esas fechas. Elige otra franja.");
        return;
      }

      const now = new Date().toISOString();
      const bookingRef = doc(collection(db, "bookings"));
      const availabilityRef = doc(db, "availability", bookingRef.id);
      const batch = writeBatch(db);
      batch.set(bookingRef, {
        userId: user.uid,
        userName: profile?.name || user.displayName || "Cliente",
        userEmail: user.email || "",
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brand} ${vehicle.model}`,
        vehiclePlate: vehicle.plate,
        vehicleImageUrl: vehicle.imageUrl || "",
        startAt: isoStart,
        endAt: isoEnd,
        pickupCity: vehicle.city,
        pickupAddress: vehicle.pickupAddress,
        amount,
        deposit: vehicle.deposit || 0,
        status: "pendiente",
        paymentStatus: "pendiente",
        initialPhotos: [],
        finalPhotos: [],
        inspectionInitialComplete: false,
        inspectionFinalComplete: false,
        createdAt: now,
        updatedAt: now,
      });
      batch.set(availabilityRef, { bookingId: bookingRef.id, vehicleId: vehicle.id, startAt: isoStart, endAt: isoEnd, status: "reservada", createdAt: now, updatedAt: now });
      await batch.commit();
      router.push(`/reserva/${bookingRef.id}`);
    } catch (err) {
      console.error(err);
      setError("No se ha podido crear la reserva. Comprueba Firestore y vuelve a intentarlo.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <><AppHeader /><div className="loading-screen"><div className="loader" /></div></>;
  if (!vehicle) return <><AppHeader /><main className="page-main"><div className="container"><div className="panel"><div className="empty-state"><strong>Vehículo no encontrado</strong></div></div></div></main></>;

  return (
    <div className="page">
      <AppHeader />
      <main className="page-main">
        <div className="container detail-grid">
          <section className="detail-card">
            <div className="detail-image">
              {activeImage || vehicle.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeImage || vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} />
              ) : (
                <div className="vehicle-placeholder"><span>{vehicle.brand}</span><strong>{vehicle.model}</strong></div>
              )}
            </div>
            {vehicle.galleryImages && vehicle.galleryImages.length > 1 && (
              <div className="detail-gallery" aria-label={`Fotos de ${vehicle.brand} ${vehicle.model}`}>
                {vehicle.galleryImages.map((image, index) => (
                  <button
                    type="button"
                    className={image === (activeImage || vehicle.imageUrl) ? "is-active" : ""}
                    onClick={() => setActiveImage(image)}
                    aria-label={`Ver foto ${index + 1}`}
                    key={image}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
            <div className="detail-body">
              <p className="eyebrow">{vehicle.year}</p>
              <h1>{vehicle.brand} {vehicle.model}</h1>
              <p className="muted">{vehicle.description || "Reserva este vehículo online y gestiona el alquiler desde tu cuenta."}</p>
              <div className="spec-grid">
                <div className="spec-box"><span>Combustible</span><strong><Fuel size={15} /> {vehicle.fuel}</strong></div>
                <div className="spec-box"><span>Transmisión</span><strong><Gauge size={15} /> {vehicle.transmission}</strong></div>
                <div className="spec-box"><span>Plazas</span><strong><Users size={15} /> {vehicle.seats}</strong></div>
                <div className="spec-box"><span>Recogida</span><strong><MapPin size={15} /> {vehicle.city}</strong></div>
                <div className="spec-box"><span>Precio</span><strong>{money(vehicle.priceDay)} / día</strong></div>
                <div className="spec-box"><span>Fianza</span><strong>{money(vehicle.deposit || 0)}</strong></div>
              </div>
            </div>
          </section>

          <form className="booking-box" onSubmit={reserve}>
            <p className="eyebrow">Tu reserva</p>
            <h2>{money(vehicle.priceDay)} <small>/ día</small></h2>
            <div className="field" style={{ marginTop: 18 }}><label>Recogida</label><input className="input" type="datetime-local" required value={startAt} onChange={(e) => setStartAt(e.target.value)} /></div>
            <div className="field" style={{ marginTop: 12 }}><label>Devolución</label><input className="input" type="datetime-local" required value={endAt} onChange={(e) => setEndAt(e.target.value)} /></div>
            <div className="price-summary">
              <div className="price-line"><span>{days || 0} día(s) × {money(vehicle.priceDay)}</span><strong>{money(amount)}</strong></div>
              <div className="price-line"><span>Fianza</span><strong>{money(vehicle.deposit || 0)}</strong></div>
              <div className="price-line total"><span>Total alquiler</span><strong>{money(amount)}</strong></div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-block" disabled={busy || !days}>{busy ? "Creando reserva..." : user ? "Reservar" : "Entrar para reservar"}</button>
            <p className="muted small" style={{ margin: "14px 0 0" }}>La disponibilidad se confirma al enviar la reserva.</p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
