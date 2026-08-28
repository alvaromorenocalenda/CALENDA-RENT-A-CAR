"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { CarFront, Search, SlidersHorizontal } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { db } from "@/lib/firebase";
import type { Vehicle } from "@/lib/types";

export default function VehiculosPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "vehicles"), orderBy("createdAt", "desc")));
        setVehicles(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) })).filter((v) => v.active !== false));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => vehicles.filter((v) => {
    const text = `${v.brand} ${v.model} ${v.plate} ${v.city}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (!city || v.city === city);
  }), [vehicles, search, city]);

  const cities = [...new Set(vehicles.map((v) => v.city).filter(Boolean))];

  return (
    <div className="page premium-page">
      <AppHeader />
      <main>
        <section className="fleet-hero">
          <div className="container fleet-hero-inner">
            <div>
              <p className="eyebrow eyebrow-light">Flota Calenda</p>
              <h1>Encuentra el coche que encaja contigo.</h1>
              <p>Consulta disponibilidad, precio y características antes de reservar. Todo el proceso se gestiona desde tu cuenta.</p>
            </div>
            <div className="fleet-hero-mark"><CarFront size={76} strokeWidth={1.25} /></div>
          </div>
        </section>

        <section className="page-main premium-fleet-main">
          <div className="container">
            <div className="fleet-toolbar">
              <div className="fleet-toolbar-title"><SlidersHorizontal size={18} /><span>Filtrar vehículos</span></div>
              <div className="fleet-result-count">{loading ? "Cargando flota…" : `${filtered.length} vehículo${filtered.length === 1 ? "" : "s"}`}</div>
            </div>

            <div className="filter-surface">
              <div className="field">
                <label>Buscar</label>
                <div className="input-with-icon"><Search size={17} /><input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Marca, modelo o matrícula" /></div>
              </div>
              <div className="field">
                <label>Zona de recogida</label>
                <select className="select" value={city} onChange={(e) => setCity(e.target.value)}><option value="">Todas las zonas</option>{cities.map((c) => <option key={c} value={c}>{c}</option>)}</select>
              </div>
            </div>

            {loading ? <div className="loading-screen"><div className="loader" /></div> : filtered.length ? (
              <div className="vehicle-grid premium-vehicle-grid">{filtered.map((v) => <VehicleCard key={v.id} vehicle={v} />)}</div>
            ) : (
              <div className="panel premium-empty-panel"><div className="empty-state"><CarFront size={34} /><strong>No hay vehículos disponibles con estos filtros</strong><span>Prueba otra zona o elimina el texto de búsqueda.</span></div></div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
