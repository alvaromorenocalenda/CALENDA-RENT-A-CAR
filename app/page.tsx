"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, KeyRound, MapPinned, ShieldCheck, Smartphone, TimerReset } from "lucide-react";
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
    <div className="page">
      <AppHeader />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Alquiler autónomo · 24/7</p>
              <h1>Reserva. Abre. Conduce. <span>Sin esperas.</span></h1>
              <p>Elige tu coche, haz la inspección desde el móvil, abre el vehículo desde la aplicación y devuelve las llaves cuando termines.</p>
              <div className="hero-points">
                <span className="hero-point">Sin mostrador</span>
                <span className="hero-point">Fotos antes y después</span>
                <span className="hero-point">Apertura desde el móvil</span>
                <span className="hero-point">Reserva por horas y días</span>
              </div>
            </div>

            <div className="hero-card">
              <h2>Busca tu coche</h2>
              <p>Selecciona dónde y cuándo lo necesitas.</p>
              <div className="search-grid">
                <div className="field full">
                  <label>Zona de recogida</label>
                  <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Higuera la Real" />
                </div>
                <div className="field">
                  <label>Inicio</label>
                  <input className="input" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div className="field">
                  <label>Devolución</label>
                  <input className="input" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
                <button className="btn btn-primary full" onClick={search}>Ver vehículos disponibles</button>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-white">
          <div className="container">
            <div className="section-title">
              <p className="eyebrow">Cómo funcionará</p>
              <h2>Todo el alquiler desde el teléfono</h2>
              <p>El proceso está pensado para que el cliente pueda realizar una reserva completa sin tener que recoger llaves en una oficina.</p>
            </div>
            <div className="process-grid">
              <article className="process-card"><div className="process-number">1</div><h3>Reserva</h3><p>Elige vehículo, fecha y hora. La plataforma calcula el importe y crea la reserva.</p></article>
              <article className="process-card"><div className="process-number">2</div><h3>Inspección</h3><p>Al llegar al coche haces las fotografías obligatorias del exterior, interior y cuadro.</p></article>
              <article className="process-card"><div className="process-number">3</div><h3>Abre y conduce</h3><p>Con la reserva autorizada podrás abrir el coche desde el móvil y coger la llave del interior.</p></article>
              <article className="process-card"><div className="process-number">4</div><h3>Devuelve</h3><p>Aparca en una zona válida, haz las fotos finales, deja la llave y cierra desde la aplicación.</p></article>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-title">
              <p className="eyebrow">Diseñado para carsharing</p>
              <h2>El software preparado para conectar el coche real</h2>
              <p>La parte web ya separa reservas, inspecciones y administración de la futura integración telemática del vehículo.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card"><div className="feature-icon"><Smartphone /></div><h3>Apertura remota</h3><p>La aplicación validará usuario, reserva y horario antes de enviar una orden al sistema telemático.</p></article>
              <article className="feature-card"><div className="feature-icon"><Camera /></div><h3>Pruebas fotográficas</h3><p>Cada alquiler guarda fotos iniciales y finales asociadas al cliente, vehículo y reserva.</p></article>
              <article className="feature-card"><div className="feature-icon"><ShieldCheck /></div><h3>Arranque autorizado</h3><p>La arquitectura contempla inmovilización fuera de la franja de reserva sin cortar nunca un vehículo en circulación.</p></article>
              <article className="feature-card"><div className="feature-icon"><MapPinned /></div><h3>GPS y devolución</h3><p>La ficha del vehículo ya está preparada para guardar posición y zonas de devolución.</p></article>
              <article className="feature-card"><div className="feature-icon"><TimerReset /></div><h3>Reservas por tiempo</h3><p>Fechas de inicio y fin, estados de alquiler y control de disponibilidad dentro de la misma plataforma.</p></article>
              <article className="feature-card"><div className="feature-icon"><KeyRound /></div><h3>Llave dentro</h3><p>El cliente abre con el móvil, recoge la llave física y la vuelve a guardar antes de finalizar.</p></article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
