"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Search } from "lucide-react";
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
    <div className="page">
      <AppHeader />
      <main className="page-main">
        <div className="container">
          <div className="page-heading">
            <div><p className="eyebrow">Flota</p><h1>Vehículos disponibles</h1><p>Elige un coche y selecciona la franja exacta de tu reserva.</p></div>
          </div>

          <div className="panel" style={{ marginBottom: 22 }}>
            <div className="panel-body form-grid">
              <div className="field"><label>Buscar vehículo</label><div style={{ position: "relative" }}><Search size={17} style={{ position: "absolute", left: 13, top: 14, color: "#657287" }} /><input className="input" style={{ paddingLeft: 40 }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Marca, modelo o matrícula" /></div></div>
              <div className="field"><label>Zona</label><select className="select" value={city} onChange={(e) => setCity(e.target.value)}><option value="">Todas las zonas</option>{cities.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
          </div>

          {loading ? <div className="loading-screen"><div className="loader" /></div> : filtered.length ? (
            <div className="vehicle-grid">{filtered.map((v) => <VehicleCard key={v.id} vehicle={v} />)}</div>
          ) : (
            <div className="panel"><div className="empty-state"><strong>No hay vehículos publicados</strong><span>En cuanto el administrador añada el primer coche aparecerá aquí.</span></div></div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
