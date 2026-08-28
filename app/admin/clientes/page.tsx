"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import AdminShell from "@/components/AdminShell";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

export default function AdminClientsPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const rows = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<UserProfile, "uid">) }));
      rows.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setUsers(rows);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  const patch = async (uid: string, data: Partial<UserProfile>) => {
    setBusy(uid);
    try { await updateDoc(doc(db, "users", uid), { ...data, updatedAt: new Date().toISOString() }); await load(); }
    catch (e) { console.error(e); alert("No se ha podido actualizar el cliente."); }
    finally { setBusy(null); }
  };

  return (
    <AdminShell title="Clientes" description="Perfiles de conductor y estado de verificación.">
      <section className="panel">
        <div className="panel-head"><h2>Usuarios ({users.length})</h2></div>
        {users.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Cliente</th><th>Contacto</th><th>DNI</th><th>Permiso</th><th>Verificación</th><th>Rol</th></tr></thead><tbody>{users.map((u) => <tr key={u.uid}>
          <td><strong>{u.name || "Sin nombre"}</strong><div className="muted small">{u.uid.slice(0, 10)}…</div></td>
          <td>{u.email}<div className="muted small">{u.phone || "Sin teléfono"}</div></td>
          <td>{u.dni || "—"}</td><td>{u.drivingLicense || "—"}</td>
          <td><select className="select" style={{ minWidth: 140 }} disabled={busy === u.uid} value={u.verificationStatus || "pendiente"} onChange={(e) => patch(u.uid, { verificationStatus: e.target.value as UserProfile["verificationStatus"] })}><option value="pendiente">Pendiente</option><option value="verificado">Verificado</option><option value="rechazado">Rechazado</option></select></td>
          <td><select className="select" style={{ minWidth: 130 }} disabled={busy === u.uid} value={u.role || "cliente"} onChange={(e) => patch(u.uid, { role: e.target.value as UserProfile["role"] })}><option value="cliente">Cliente</option><option value="admin">Admin</option></select></td>
        </tr>)}</tbody></table></div> : <div className="empty-state">Todavía no hay clientes registrados.</div>}
      </section>
      <div className="notice notice-warning" style={{ marginTop: 18 }}>La verificación manual sirve solo para el MVP. Antes de aceptar alquileres reales conviene sustituirla por verificación documental y de permiso de conducir mediante un proveedor especializado.</div>
    </AdminShell>
  );
}
