"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { ArrowRight, CarFront } from "lucide-react";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { db } from "@/lib/firebase";
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
        if (mounted) setVehicles(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) })).filter((vehicle) => vehicle.active !== false));
      })
      .catch((error) => console.error("[v0] No se pudo cargar la flota destacada:", error));
    return () => { mounted = false; };
  }, []);

  const search = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    router.push(`/vehiculos?${params.toString()}`);
  };

  return (
    <div className="page rental-page">
      <AppHeader />
      <main>
        <section className="rental-hero">
          <div className="container rental-hero-inner">
            <div className="rental-hero-copy">
              <p className="rental-kicker">CALENDA RENT A CAR</p>
              <h1>Alquila tu coche de forma sencilla.</h1>
              <p>Reserva online, recoge el vehículo y gestiona tu alquiler desde el móvil.</p>
              <Link href="/vehiculos" className="rental-text-link">Ver nuestra flota <ArrowRight size={16} /></Link>
            </div>
            <div className="rental-search-box">
              <h2>Buscar vehículo</h2>
              <div className="rental-search-grid">
                <div className="field full"><label>Recogida</label><input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Localidad" /></div>
                <div className="field"><label>Fecha y hora de inicio</label><input className="input" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} /></div>
                <div className="field"><label>Fecha y hora de devolución</label><input className="input" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
                <button className="btn btn-primary full" onClick={search}>Buscar coches</button>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="rental-section how-section">
          <div className="container">
            <div className="rental-section-heading"><p>Cómo funciona</p></div>
            <div className="rental-steps">
              <div className="rental-step"><span>01</span><div><h3>Reserva</h3><p>Selecciona el vehículo y las fechas.</p></div></div>
              <div className="rental-step"><span>02</span><div><h3>Revisa el coche</h3><p>Realiza las fotografías al llegar.</p></div></div>
              <div className="rental-step"><span>03</span><div><h3>Recoge y conduce</h3><p>Abre el vehículo cuando la reserva esté autorizada.</p></div></div>
              <div className="rental-step"><span>04</span><div><h3>Devuelve</h3><p>Realiza la inspección final y termina el alquiler.</p></div></div>
            </div>
          </div>
        </section>

        <section className="rental-fleet-preview">
          <div className="container">
            <div className="rental-section-heading fleet-preview-heading"><div><p>La flota</p><h2>Vehículos disponibles</h2></div><Link href="/vehiculos" className="rental-text-link">Ver todos <ArrowRight size={16} /></Link></div>
            {vehicles.length ? <div className="vehicle-grid premium-vehicle-grid">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="fleet-empty"><CarFront size={22} /><span>No hay vehículos disponibles en este momento.</span></div>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
