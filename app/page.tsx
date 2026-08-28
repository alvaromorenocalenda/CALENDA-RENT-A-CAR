"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { ArrowRight, Camera, CarFront, KeyRound, MapPin, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { db } from "@/lib/firebase";
import { firstCalendaVehicle } from "@/lib/fallbackVehicle";
import type { Vehicle } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("Higuera la Real");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    let mounted = true;
    getDocs(query(collection(db, "vehicles"), orderBy("createdAt", "desc"), limit(3)))
      .then((snap) => {
        if (!mounted) return;
        const loadedVehicles = snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) }))
            .filter((vehicle) => vehicle.active !== false);
        const hasC4Cactus = loadedVehicles.some((vehicle) =>
          vehicle.id === firstCalendaVehicle.id ||
          `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes("c4 cactus")
        );
        setVehicles(hasC4Cactus ? loadedVehicles : [firstCalendaVehicle, ...loadedVehicles].slice(0, 3));
      })
      .catch((error) => {
        console.error("No se pudo cargar la flota destacada:", error);
        if (mounted) setVehicles([firstCalendaVehicle]);
      });
    return () => { mounted = false; };
  }, []);

  const search = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    router.push(`/vehiculos?${params.toString()}`);
  };

  const heroVehicle = vehicles.find((vehicle) => vehicle.imageUrl) || vehicles[0];

  return (
    <div className="page mobility-home">
      <AppHeader />
      <main>
        <section className="mobility-hero">
          <div className="container mobility-hero-grid">
            <div className="mobility-hero-copy">
              <p className="mobility-kicker">Calenda Rent a Car</p>
              <h1>Tu coche <span>cuando lo necesites.</span></h1>
              <p>Reserva desde el móvil, recoge el vehículo y gestiona todo tu alquiler online.</p>
              <div className="mobility-hero-actions">
                <Link href="/vehiculos" className="btn btn-primary">Buscar coche <ArrowRight size={18} /></Link>
                <a href="#como-funciona" className="mobility-link">Cómo funciona</a>
              </div>
            </div>

            <div className="mobility-visual" aria-label="Vehículo Calenda Rent a Car">
              {heroVehicle?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroVehicle.imageUrl} alt={`${heroVehicle.brand} ${heroVehicle.model}`} />
              ) : (
                <div className="mobility-visual-placeholder">
                  <Image src="/brand/calenda-rent-a-car-logo.webp" alt="Calenda Rent a Car" width={560} height={420} priority />
                </div>
              )}
              {heroVehicle && <span className="mobility-visual-label">{heroVehicle.brand} {heroVehicle.model}</span>}
            </div>
          </div>
        </section>

        <div className="mobility-search-wrap" data-reveal>
          <div className="container">
            <div className="mobility-search">
              <div className="field">
                <label>Recogida</label>
                <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Localidad" />
              </div>
              <div className="field">
                <label>Fecha y hora de inicio</label>
                <input className="input" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div className="field">
                <label>Fecha y hora de devolución</label>
                <input className="input" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={search}>Buscar coches</button>
            </div>
          </div>
        </div>

        <section id="como-funciona" className="mobility-section" data-reveal>
          <div className="container">
            <div className="mobility-section-head">
              <div>
                <p className="label">Cómo funciona</p>
                <h2>Reserva y conduce.</h2>
              </div>
              <p>Todo el proceso está pensado para hacerlo desde el teléfono, sin pasar por un mostrador.</p>
            </div>

            <div className="mobility-steps">
              <article className="mobility-step"><span className="mobility-step-number">01</span><h3>Regístrate</h3><p>Crea tu cuenta y completa tus datos de conductor.</p></article>
              <article className="mobility-step"><span className="mobility-step-number">02</span><h3>Reserva</h3><p>Elige el coche y selecciona la fecha y hora que necesitas.</p></article>
              <article className="mobility-step"><span className="mobility-step-number">03</span><h3>Haz las fotos y abre</h3><p>Revisa el vehículo desde el móvil antes de comenzar.</p></article>
              <article className="mobility-step"><span className="mobility-step-number">04</span><h3>Conduce y devuelve</h3><p>Al terminar, realiza la revisión final y cierra el alquiler.</p></article>
            </div>
          </div>
        </section>

        <section className="mobility-fleet" data-reveal>
          <div className="container">
            <div className="mobility-section-head">
              <div>
                <p className="label">Nuestra flota</p>
                <h2>Elige tu coche.</h2>
              </div>
              <Link href="/vehiculos" className="mobility-link">Ver todos <ArrowRight size={16} /></Link>
            </div>
            {vehicles.length ? (
              <div className="vehicle-grid">
                {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
              </div>
            ) : (
              <div className="fleet-empty"><CarFront size={22} /><span>No hay vehículos disponibles en este momento.</span></div>
            )}
          </div>
        </section>

        <section className="mobility-access" data-reveal>
          <div className="container mobility-access-grid">
            <div className="mobility-access-copy">
              <p className="label">Todo desde el móvil</p>
              <h2>Tu alquiler, en una sola app.</h2>
              <p>Reserva, revisa el estado del coche y gestiona las acciones del alquiler desde tu cuenta.</p>
            </div>
            <div className="mobility-access-list">
              <article className="mobility-access-item"><span><Smartphone size={20} /></span><div><h3>Reserva online</h3><p>Consulta la flota y selecciona tu franja de alquiler.</p></div></article>
              <article className="mobility-access-item"><span><Camera size={20} /></span><div><h3>Inspección fotográfica</h3><p>Haz las fotografías obligatorias antes y después del alquiler.</p></div></article>
              <article className="mobility-access-item"><span><KeyRound size={20} /></span><div><h3>Acceso al vehículo</h3><p>La plataforma queda preparada para apertura remota cuando conectemos la telemática.</p></div></article>
            </div>
          </div>
        </section>

        <section className="mobility-location" data-reveal>
          <div className="container mobility-location-card">
            <div><h2>Recogida en Higuera la Real.</h2><p>Consulta la ubicación exacta de cada vehículo antes de reservar.</p></div>
            <div className="mobility-location-pin"><MapPin size={28} /></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
