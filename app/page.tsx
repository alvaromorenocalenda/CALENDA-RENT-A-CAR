import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, KeyRound, MapPin, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const vehicles = [
  { name: "Citroën C4 Cactus", type: "SUV urbano", seats: "5 plazas", fuel: "Gasolina", price: 39 },
  { name: "Peugeot 208", type: "Compacto", seats: "5 plazas", fuel: "Gasolina", price: 35 },
  { name: "Citroën Berlingo", type: "Furgoneta", seats: "5 plazas", fuel: "Diésel", price: 52 },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={15} /> Alquiler sin esperas ni mostradores</span>
              <h1>Reserva. Abre. Conduce. <span>Todo desde tu móvil.</span></h1>
              <p>Elige tu coche, haz la reserva online y recógelo de forma autónoma. La llave te espera dentro y tú controlas el alquiler desde la app.</p>
              <div className="hero-points">
                <span className="hero-point"><CheckCircle2 size={17} /> Reserva 100% online</span>
                <span className="hero-point"><Smartphone size={17} /> Apertura desde el móvil</span>
                <span className="hero-point"><Camera size={17} /> Inspección con fotos</span>
              </div>
            </div>

            <div className="search-card">
              <h2>Encuentra tu coche</h2>
              <p>Indica cuándo lo necesitas y te mostramos los vehículos disponibles.</p>
              <form className="form-grid" action="/vehiculos">
                <div className="field full">
                  <label htmlFor="zona">Zona de recogida</label>
                  <select id="zona" name="zona" defaultValue="higuera">
                    <option value="higuera">Higuera la Real</option>
                    <option value="fregenal">Fregenal de la Sierra</option>
                    <option value="zafra">Zafra</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="inicio">Fecha de inicio</label>
                  <input id="inicio" name="inicio" type="date" />
                </div>
                <div className="field">
                  <label htmlFor="horaInicio">Hora</label>
                  <input id="horaInicio" name="horaInicio" type="time" defaultValue="10:00" />
                </div>
                <div className="field">
                  <label htmlFor="fin">Fecha de devolución</label>
                  <input id="fin" name="fin" type="date" />
                </div>
                <div className="field">
                  <label htmlFor="horaFin">Hora</label>
                  <input id="horaFin" name="horaFin" type="time" defaultValue="18:00" />
                </div>
                <div className="field full">
                  <button className="btn btn-primary btn-block" type="submit">Buscar vehículos <ArrowRight size={18} /></button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Vehículos disponibles</h2>
                <p>Primer catálogo de muestra. Después los vehículos, precios y disponibilidad saldrán directamente de Firebase.</p>
              </div>
              <Link href="/vehiculos" className="text-link">Ver todos →</Link>
            </div>
            <div className="vehicle-grid">
              {vehicles.map((vehicle) => (
                <article className="vehicle-card" key={vehicle.name}>
                  <div className="vehicle-visual">
                    <span className="vehicle-badge">● Disponible</span>
                    <div className="car-shape" aria-hidden="true" />
                  </div>
                  <div className="vehicle-body">
                    <div className="vehicle-title">
                      <div><h3>{vehicle.name}</h3><span style={{ color: "#6b7280", fontSize: 13 }}>{vehicle.type}</span></div>
                      <div className="vehicle-price">{vehicle.price} €<small>/ día</small></div>
                    </div>
                    <div className="vehicle-meta">
                      <span>{vehicle.seats}</span><span>{vehicle.fuel}</span><span>Manual</span>
                    </div>
                    <Link href="/vehiculos" className="btn btn-dark btn-block">Ver disponibilidad</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-white" id="como-funciona">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Cómo funciona</h2>
                <p>Un alquiler completo sin tener que quedar con nadie para recoger o devolver las llaves.</p>
              </div>
            </div>
            <div className="steps">
              <div className="step"><div className="step-number">1</div><h3>Reserva</h3><p>Elige vehículo, fecha y hora. Identificamos al conductor y confirmamos el pago.</p></div>
              <div className="step"><div className="step-number">2</div><h3>Haz las fotos</h3><p>Al llegar, la aplicación te guía para fotografiar exterior, interior, kilómetros y combustible.</p></div>
              <div className="step"><div className="step-number">3</div><h3>Abre desde el móvil</h3><p>Con una reserva válida aparece el botón de apertura. La llave física se encuentra dentro del vehículo.</p></div>
              <div className="step"><div className="step-number">4</div><h3>Devuelve y cierra</h3><p>Aparca en la zona permitida, deja la llave dentro, realiza las fotos finales y cierra desde la app.</p></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="feature-band">
              <div>
                <h2>Diseñado para alquilar con tranquilidad</h2>
                <p><ShieldCheck size={16} style={{ verticalAlign: "middle" }} /> Registro de aperturas, ubicación GPS, fotos antes y después y control de cada reserva.</p>
              </div>
              <Link href="/registro" className="btn btn-primary">Crear mi cuenta <ArrowRight size={18} /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
