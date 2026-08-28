"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("Higuera la Real");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

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
                <div className="field full">
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
                <button className="btn btn-primary full" onClick={search}>Buscar coches</button>
              </div>
            </div>
          </div>
        </section>

        <section className="rental-benefits">
          <div className="container rental-benefits-grid">
            <div><strong>Reserva online</strong><span>Elige vehículo, fecha y hora desde la web.</span></div>
            <div><strong>Sin entrega en mostrador</strong><span>El proceso de recogida se gestiona desde tu cuenta.</span></div>
            <div><strong>Control del alquiler</strong><span>Consulta reservas, inspecciones y estado del vehículo.</span></div>
          </div>
        </section>

        <section className="rental-section">
          <div className="container">
            <div className="rental-section-heading">
              <p>Cómo funciona</p>
              <h2>Cuatro pasos y listo.</h2>
            </div>
            <div className="rental-steps">
              <div className="rental-step"><span>1</span><div><h3>Reserva</h3><p>Selecciona el coche y las fechas que necesitas.</p></div></div>
              <div className="rental-step"><span>2</span><div><h3>Revisa el coche</h3><p>Al llegar, haces las fotografías indicadas desde el móvil.</p></div></div>
              <div className="rental-step"><span>3</span><div><h3>Recoge y conduce</h3><p>Cuando la reserva esté autorizada podrás acceder al vehículo.</p></div></div>
              <div className="rental-step"><span>4</span><div><h3>Devuelve</h3><p>Haz la revisión final, deja la llave y termina el alquiler.</p></div></div>
            </div>
          </div>
        </section>

        <section className="rental-info-section">
          <div className="container rental-info-grid">
            <div>
              <p className="rental-kicker dark">ALQUILER DIGITAL</p>
              <h2>Todo lo necesario en una sola cuenta.</h2>
            </div>
            <div className="rental-info-list">
              <p><strong>Reservas.</strong> Consulta próximas reservas y alquileres anteriores.</p>
              <p><strong>Inspecciones.</strong> Las fotografías iniciales y finales quedan vinculadas a cada alquiler.</p>
              <p><strong>Vehículos.</strong> Consulta características, ubicación y precio antes de reservar.</p>
              <p><strong>Acceso remoto.</strong> Se activará en los vehículos equipados con el sistema telemático.</p>
            </div>
          </div>
        </section>

        <section className="rental-cta">
          <div className="container rental-cta-inner">
            <div><h2>¿Necesitas un coche?</h2><p>Consulta los vehículos disponibles y elige tus fechas.</p></div>
            <Link href="/vehiculos" className="btn btn-dark">Ver vehículos</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
