"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { CarFront, ChevronDown, Filter, MapPin, Search, X } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { db } from "@/lib/firebase";
import { firstCalendaVehicle } from "@/lib/fallbackVehicle";
import type { Vehicle } from "@/lib/types";

const optionValues = (vehicles: Vehicle[], key: keyof Vehicle) => [...new Set(vehicles.map((vehicle) => String(vehicle[key] ?? "")).filter(Boolean))];

export default function VehiculosPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [seats, setSeats] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  useEffect(() => {
    const initialParams = new URLSearchParams(window.location.search);
    const requestedCity = initialParams.get("city");
    if (requestedCity) setCity(requestedCity);
    setStartAt(initialParams.get("start") || "");
    setEndAt(initialParams.get("end") || "");
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "vehicles"), orderBy("createdAt", "desc")));
        const loadedVehicles = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) })).filter((v) => v.active !== false);
        setVehicles(loadedVehicles.length ? loadedVehicles : [firstCalendaVehicle]);
      } catch (error) {
        console.error("[v0] No se pudo cargar la flota:", error);
        setVehicles([firstCalendaVehicle]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const vehicleQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (startAt) params.set("start", startAt);
    if (endAt) params.set("end", endAt);
    return params.toString();
  }, [startAt, endAt]);

  const filtered = useMemo(() => vehicles.filter((vehicle) => {
    const text = `${vehicle.brand} ${vehicle.model} ${vehicle.city}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (!city || vehicle.city === city) && (!fuel || vehicle.fuel === fuel) && (!transmission || vehicle.transmission === transmission) && (!seats || String(vehicle.seats) === seats) && (!maxPrice || vehicle.priceDay <= Number(maxPrice));
  }), [vehicles, search, city, fuel, transmission, seats, maxPrice]);

  const cities = optionValues(vehicles, "city");
  const fuels = optionValues(vehicles, "fuel");
  const transmissions = optionValues(vehicles, "transmission");
  const seatOptions = optionValues(vehicles, "seats").sort((a, b) => Number(a) - Number(b));
  const priceOptions = ["30", "50", "75", "100"].filter((price) => vehicles.some((vehicle) => vehicle.priceDay <= Number(price)));
  const clearFilters = () => { setSearch(""); setCity(""); setFuel(""); setTransmission(""); setSeats(""); setMaxPrice(""); };

  const Filters = () => <div className="vehicle-filter-panel">
    <div className="vehicle-filter-heading"><strong>Filtrar resultados</strong><button type="button" className="mobile-filter-close" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros"><X /></button></div>
    <label className="vehicle-filter-field"><span>Ubicación</span><select value={city} onChange={(event) => setCity(event.target.value)}><option value="">Todas las ubicaciones</option>{cities.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label className="vehicle-filter-field"><span>Precio máximo / día</span><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="">Cualquier precio</option>{priceOptions.map((value) => <option key={value} value={value}>Hasta {value} €</option>)}</select></label>
    <label className="vehicle-filter-field"><span>Combustible</span><select value={fuel} onChange={(event) => setFuel(event.target.value)}><option value="">Cualquier combustible</option>{fuels.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label className="vehicle-filter-field"><span>Transmisión</span><select value={transmission} onChange={(event) => setTransmission(event.target.value)}><option value="">Cualquier transmisión</option>{transmissions.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label className="vehicle-filter-field"><span>Plazas</span><select value={seats} onChange={(event) => setSeats(event.target.value)}><option value="">Cualquier capacidad</option>{seatOptions.map((value) => <option key={value} value={value}>{value} plazas</option>)}</select></label>
    <button type="button" className="vehicle-clear-filters" onClick={clearFilters}>Limpiar filtros</button>
  </div>;

  return <div className="page premium-page vehicle-results-page"><AppHeader /><main className="vehicle-results-main"><div className="container">
    <header className="vehicle-results-header"><div><p className="eyebrow">Calenda Rent a Car</p><h1>Vehículos disponibles</h1><p>Elige el vehículo que mejor se adapta a tu trayecto.</p></div><div className="vehicle-results-meta"><span>{loading ? "Cargando" : `${filtered.length} resultado${filtered.length === 1 ? "" : "s"}`}</span><button type="button" className="mobile-filter-button" onClick={() => setFiltersOpen(true)}><Filter /> Filtros</button></div></header>
    <div className="vehicle-search-strip"><label><MapPin /><span>Lugar de recogida</span><select value={city} onChange={(event) => setCity(event.target.value)}><option value="">Todas las ubicaciones</option>{cities.map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Recogida</span><input type="datetime-local" aria-label="Fecha y hora de recogida" value={startAt} onChange={(event) => setStartAt(event.target.value)} /></label><label><span>Devolución</span><input type="datetime-local" aria-label="Fecha y hora de devolución" value={endAt} onChange={(event) => setEndAt(event.target.value)} /></label><label className="vehicle-search-input"><Search /><span>Buscar modelo</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Marca o modelo" /></label></div>
    <div className="vehicle-results-layout"><aside className="desktop-filters"><Filters /></aside><section className="vehicle-results-list" aria-live="polite">{loading ? <div className="loading-screen"><div className="loader" /></div> : filtered.length ? <div className="vehicle-results-grid">{filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} query={vehicleQuery} />)}</div> : <div className="vehicle-results-empty"><CarFront /><strong>No hay vehículos disponibles.</strong><button type="button" onClick={clearFilters}>Limpiar filtros</button></div>}</section></div>
    {filtersOpen && <div className="mobile-filter-overlay" role="dialog" aria-modal="true"><Filters /></div>}
  </div></main><Footer /></div>;
}
