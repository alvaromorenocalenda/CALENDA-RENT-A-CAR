"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Camera,
  CarFront,
  CheckCircle2,
  Clock3,
  KeyRound,
  MapPin,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
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
    <div className="page premium-page">
      <AppHeader />
      <main>
        <section className="hero premium-hero">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="container premium-hero-grid">
            <div className="hero-copy premium-hero-copy">
              <div className="premium-badge"><Sparkles size={15} /> Movilidad simple, digital y sin esperas</div>
              <h1>Tu coche, listo <span>cuando tú lo estés.</span></h1>
              <p className="hero-lead">Reserva, accede y devuelve el vehículo desde el móvil. Sin mostrador, sin colas y con todo el proceso dentro de una sola aplicación.</p>
              <div className="hero-actions-row">
                <Link href="/vehiculos" className="btn btn-primary btn-large">Ver vehículos <ArrowRight size={18} /></Link>
                <a href="#como-funciona" className="btn btn-hero-secondary btn-large">Cómo funciona</a>
              </div>
              <div className="hero-proof-row">
                <span><CheckCircle2 size={16} /> Reserva online</span>
                <span><CheckCircle2 size={16} /> Acceso desde el móvil</span>
                <span><CheckCircle2 size={16} /> Inspección fotográfica</span>
              </div>
            </div>

            <div className="hero-experience">
              <div className="hero-car-stage">
                <div className="hero-stage-top">
                  <span>CALENDA SMART ACCESS</span>
                  <span className="live-dot"><i /> Preparado</span>
                </div>
                <div className="hero-car-icon"><CarFront size={148} strokeWidth={1.25} /></div>
                <div className="hero-stage-copy">
                  <span>Tu alquiler, en tu bolsillo</span>
                  <strong>Reserva · Abre · Conduce</strong>
                </div>
                <div className="hero-mini-cards">
                  <div><Smartphone size={18} /><span>Acceso digital</span></div>
                  <div><ShieldCheck size={18} /><span>Proceso seguro</span></div>
                  <div><Clock3 size={18} /><span>Disponibilidad 24/7</span></div>
                </div>
              </div>

              <div className="hero-card premium-search-card">
                <div className="search-card-heading">
                  <div><p className="eyebrow">Reserva</p><h2>Encuentra tu coche</h2></div>
                  <span className="search-card-icon"><MapPin size={19} /></span>
                </div>
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
                  <button className="btn btn-primary full" onClick={search}>Buscar disponibilidad <ArrowRight size={17} /></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-trustbar">
          <div className="container premium-trustbar-inner">
            <div><strong>100%</strong><span>gestión digital</span></div>
            <div><strong>24/7</strong><span>acceso al vehículo</span></div>
            <div><strong>8 fotos</strong><span>por inspección</span></div>
            <div><strong>1 app</strong><span>para todo el alquiler</span></div>
          </div>
        </section>

        <section className="section premium-section" id="como-funciona">
          <div className="container">
            <div className="section-heading-row">
              <div className="section-title">
                <p className="eyebrow">Una experiencia mejor</p>
                <h2>Alquilar un coche debería ser así de fácil.</h2>
              </div>
              <p className="section-side-copy">Hemos diseñado el proceso para eliminar esperas y trámites innecesarios. Tú eliges cuándo empiezas y cuándo terminas.</p>
            </div>

            <div className="process-grid premium-process-grid">
              <article className="process-card premium-process-card"><div className="process-number">01</div><div className="process-icon"><Clock3 /></div><h3>Reserva</h3><p>Selecciona vehículo, fecha y hora. La plataforma comprueba disponibilidad y prepara tu alquiler.</p></article>
              <article className="process-card premium-process-card"><div className="process-number">02</div><div className="process-icon"><Camera /></div><h3>Inspecciona</h3><p>Al llegar, haces las fotografías obligatorias para dejar registrado el estado del vehículo.</p></article>
              <article className="process-card premium-process-card"><div className="process-number">03</div><div className="process-icon"><KeyRound /></div><h3>Abre y conduce</h3><p>Con la reserva autorizada, abres desde el móvil y recoges la llave física que queda en el interior.</p></article>
              <article className="process-card premium-process-card"><div className="process-number">04</div><div className="process-icon"><CheckCircle2 /></div><h3>Devuelve</h3><p>Aparca, completa la inspección final, guarda la llave y cierra el coche desde la aplicación.</p></article>
            </div>
          </div>
        </section>

        <section className="section premium-dark-section">
          <div className="container premium-tech-grid">
            <div className="premium-tech-copy">
              <p className="eyebrow eyebrow-light">Tecnología útil</p>
              <h2>Todo lo importante, sin complicarte la vida.</h2>
              <p>La plataforma está preparada para conectar reservas, identidad, fotografías, localización y acceso remoto al vehículo en un único flujo.</p>
              <Link href="/vehiculos" className="text-link-light">Explorar la flota <ArrowRight size={17} /></Link>
            </div>
            <div className="premium-feature-stack">
              <article className="premium-feature"><span><Smartphone /></span><div><h3>Acceso desde el móvil</h3><p>La aplicación valida usuario, reserva y horario antes de permitir el acceso.</p></div></article>
              <article className="premium-feature"><span><ShieldCheck /></span><div><h3>Control y trazabilidad</h3><p>Cada reserva, inspección y cambio de estado queda asociado al usuario y al vehículo.</p></div></article>
              <article className="premium-feature"><span><MapPin /></span><div><h3>Vehículo conectado</h3><p>Preparado para GPS, telemática, apertura remota y control seguro de la franja de alquiler.</p></div></article>
            </div>
          </div>
        </section>

        <section className="section premium-cta-section">
          <div className="container">
            <div className="premium-cta-card">
              <div><p className="eyebrow">Tu próximo viaje empieza aquí</p><h2>Elige coche. El resto lo hacemos fácil.</h2><p>Consulta la flota, selecciona tus fechas y gestiona todo desde tu cuenta.</p></div>
              <Link href="/vehiculos" className="btn btn-primary btn-large">Ver vehículos <ArrowRight size={18} /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
