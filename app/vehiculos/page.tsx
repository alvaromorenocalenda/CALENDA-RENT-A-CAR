import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const vehicles = [
  { name: "Citroën C4 Cactus", type: "SUV urbano", seats: "5 plazas", fuel: "Gasolina", transmission: "Manual", price: 39, location: "Higuera la Real" },
  { name: "Peugeot 208", type: "Compacto", seats: "5 plazas", fuel: "Gasolina", transmission: "Manual", price: 35, location: "Higuera la Real" },
  { name: "Citroën Berlingo", type: "Furgoneta", seats: "5 plazas", fuel: "Diésel", transmission: "Manual", price: 52, location: "Fregenal de la Sierra" },
  { name: "Renault Clio", type: "Compacto", seats: "5 plazas", fuel: "Gasolina", transmission: "Manual", price: 34, location: "Zafra" },
  { name: "Seat Arona", type: "SUV", seats: "5 plazas", fuel: "Gasolina", transmission: "Manual", price: 45, location: "Zafra" },
  { name: "Peugeot Partner", type: "Furgoneta", seats: "3 plazas", fuel: "Diésel", transmission: "Manual", price: 49, location: "Higuera la Real" },
];

export default function VehiculosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Encuentra tu vehículo</h1>
            <p>Catálogo inicial de demostración. En la siguiente fase lo conectaremos a Firestore para gestionar disponibilidad real.</p>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 34 }}>
          <div className="container">
            <div className="filters">
              <div className="field"><label>Zona</label><select defaultValue="all"><option value="all">Todas las zonas</option><option>Higuera la Real</option><option>Fregenal de la Sierra</option><option>Zafra</option></select></div>
              <div className="field"><label>Desde</label><input type="date" /></div>
              <div className="field"><label>Hasta</label><input type="date" /></div>
              <div className="field"><label>Tipo</label><select><option>Todos</option><option>Compacto</option><option>SUV</option><option>Furgoneta</option></select></div>
            </div>
            <div className="vehicle-grid">
              {vehicles.map((vehicle) => (
                <article className="vehicle-card" key={vehicle.name}>
                  <div className="vehicle-visual"><span className="vehicle-badge">● Disponible</span><div className="car-shape" aria-hidden="true" /></div>
                  <div className="vehicle-body">
                    <div className="vehicle-title">
                      <div><h3>{vehicle.name}</h3><span style={{ color: "#6b7280", fontSize: 13 }}>{vehicle.type} · {vehicle.location}</span></div>
                      <div className="vehicle-price">{vehicle.price} €<small>/ día</small></div>
                    </div>
                    <div className="vehicle-meta"><span>{vehicle.seats}</span><span>{vehicle.fuel}</span><span>{vehicle.transmission}</span></div>
                    <Link href="/registro" className="btn btn-primary btn-block">Reservar vehículo</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
