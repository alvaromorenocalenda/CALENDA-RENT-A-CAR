"use client";

import { FormEvent, useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { CarFront, Pencil, Plus } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { db } from "@/lib/firebase";
import type { Vehicle, VehicleStatus } from "@/lib/types";
import { money } from "@/lib/utils";

const initial = {
  brand: "Citroën", model: "C4 Cactus", plate: "", year: 2017, fuel: "Gasolina", transmission: "Manual", seats: 5,
  priceDay: 39, deposit: 250, status: "disponible" as VehicleStatus, city: "Higuera la Real", pickupAddress: "",
  description: "", imageUrl: "", trackerId: "", active: true, telematicsEnabled: false, immobilizerEnabled: false,
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState(initial);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, "vehicles"));
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) }));
      rows.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
      setVehicles(rows);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage("");
    const now = new Date().toISOString();
    const data = {
      ...form,
      brand: form.brand.trim(), model: form.model.trim(), plate: form.plate.trim().toUpperCase(), pickupAddress: form.pickupAddress.trim(),
      description: form.description.trim(), imageUrl: form.imageUrl.trim(), trackerId: form.trackerId.trim(),
      features: ["Apertura desde móvil", "Fotos de entrega y devolución"], updatedAt: now,
    };
    try {
      if (editId) await updateDoc(doc(db, "vehicles", editId), data);
      else await addDoc(collection(db, "vehicles"), { ...data, createdAt: now });
      setMessage(editId ? "Vehículo actualizado." : "Vehículo añadido a la flota.");
      setEditId(null); setForm(initial); await load();
    } catch (e) { console.error(e); setMessage("No se ha podido guardar. Comprueba que tu usuario tenga role=admin y que las reglas estén desplegadas."); }
    finally { setBusy(false); }
  };

  const edit = (v: Vehicle) => {
    setEditId(v.id);
    setForm({
      brand: v.brand, model: v.model, plate: v.plate, year: v.year, fuel: v.fuel, transmission: v.transmission, seats: v.seats,
      priceDay: v.priceDay, deposit: v.deposit || 0, status: v.status, city: v.city, pickupAddress: v.pickupAddress || "",
      description: v.description || "", imageUrl: v.imageUrl || "", trackerId: v.trackerId || "", active: v.active !== false,
      telematicsEnabled: !!v.telematicsEnabled, immobilizerEnabled: !!v.immobilizerEnabled,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminShell title="Vehículos" description="Alta de coches, precios, localización y preparación para FMC130 + CAN-CONTROL.">
      <section className="panel">
        <div className="panel-head"><h2>{editId ? "Editar vehículo" : "Añadir vehículo"}</h2>{editId && <button className="btn btn-small btn-light" onClick={() => { setEditId(null); setForm(initial); }}>Cancelar edición</button>}</div>
        <form className="panel-body" onSubmit={save}>
          <div className="admin-form-grid">
            <div className="field"><label>Marca</label><input className="input" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
            <div className="field"><label>Modelo</label><input className="input" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
            <div className="field"><label>Matrícula</label><input className="input" required value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="1234 ABC" /></div>
            <div className="field"><label>Año</label><input className="input" type="number" required value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></div>
            <div className="field"><label>Combustible</label><select className="select" value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })}><option>Gasolina</option><option>Diésel</option><option>Híbrido</option><option>Eléctrico</option></select></div>
            <div className="field"><label>Cambio</label><select className="select" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}><option>Manual</option><option>Automático</option></select></div>
            <div className="field"><label>Plazas</label><input className="input" type="number" min="1" max="9" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} /></div>
            <div className="field"><label>Precio / día (€)</label><input className="input" type="number" min="0" step="0.01" value={form.priceDay} onChange={(e) => setForm({ ...form, priceDay: Number(e.target.value) })} /></div>
            <div className="field"><label>Fianza (€)</label><input className="input" type="number" min="0" step="0.01" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: Number(e.target.value) })} /></div>
            <div className="field"><label>Estado</label><select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VehicleStatus })}><option value="disponible">Disponible</option><option value="alquilado">Alquilado</option><option value="mantenimiento">Mantenimiento</option><option value="inactivo">Inactivo</option></select></div>
            <div className="field"><label>Municipio / zona</label><input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="field"><label>ID tracker Teltonika</label><input className="input" value={form.trackerId} onChange={(e) => setForm({ ...form, trackerId: e.target.value })} placeholder="IMEI / ID futuro" /></div>
            <div className="field span-3"><label>Dirección de recogida</label><input className="input" value={form.pickupAddress} onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })} placeholder="Ubicación exacta del vehículo" /></div>
            <div className="field span-3"><label>URL de imagen</label><input className="input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
            <div className="field span-3"><label>Descripción</label><textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className="switch-row">
            <label className="checkbox-label"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Publicado en la web</label>
            <label className="checkbox-label"><input type="checkbox" checked={form.telematicsEnabled} onChange={(e) => setForm({ ...form, telematicsEnabled: e.target.checked })} /> Hardware telemático instalado</label>
            <label className="checkbox-label"><input type="checkbox" checked={form.immobilizerEnabled} onChange={(e) => setForm({ ...form, immobilizerEnabled: e.target.checked })} /> Inmovilizador instalado</label>
          </div>
          {message && <div className={message.includes("No se") ? "form-error" : "form-success"}>{message}</div>}
          <button className="btn btn-primary" disabled={busy}><Plus size={17} /> {busy ? "Guardando..." : editId ? "Guardar cambios" : "Añadir vehículo"}</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Flota ({vehicles.length})</h2></div>
        {vehicles.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Vehículo</th><th>Precio</th><th>Estado</th><th>Zona</th><th>Telemática</th><th></th></tr></thead><tbody>{vehicles.map((v) => <tr key={v.id}><td><strong>{v.brand} {v.model}</strong><div className="muted small">{v.plate} · {v.year}</div></td><td>{money(v.priceDay)}/día</td><td><span className={v.status === "disponible" ? "badge badge-success" : "badge badge-warning"}>{v.status}</span></td><td>{v.city}</td><td>{v.telematicsEnabled ? `Sí · ${v.trackerId || "sin ID"}` : "No instalada"}</td><td><button className="btn btn-small btn-light" onClick={() => edit(v)}><Pencil size={14} /> Editar</button></td></tr>)}</tbody></table></div> : <div className="empty-state"><CarFront size={34} /><strong>No hay vehículos</strong><p>El formulario ya viene preparado con tu Citroën C4 Cactus 2017: introduce la matrícula y guárdalo como primer coche.</p></div>}
      </section>
    </AdminShell>
  );
}
