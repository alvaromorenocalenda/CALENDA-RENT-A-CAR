"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { BadgeCheck, IdCard, UserRound } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/firebase";

export default function MiCuentaPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [license, setLicense] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/mi-cuenta");
  }, [loading, user, router]);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name || "");
    setPhone(profile.phone || "");
    setDni(profile.dni || "");
    setLicense(profile.drivingLicense || "");
  }, [profile]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true); setMessage("");
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: name.trim(), phone: phone.trim(), dni: dni.trim().toUpperCase(), drivingLicense: license.trim().toUpperCase(), updatedAt: new Date().toISOString(),
      });
      await refreshProfile();
      setMessage("Datos guardados correctamente.");
    } catch (e) { console.error(e); setMessage("No se han podido guardar los cambios."); }
    finally { setBusy(false); }
  };

  if (loading || !user || !profile) return <><AppHeader /><div className="loading-screen"><div className="loader" /></div></>;

  return (
    <div className="page">
      <AppHeader />
      <main className="page-main">
        <div className="container">
          <div className="page-heading"><div><p className="eyebrow">Área cliente</p><h1>Mi cuenta</h1><p>Completa los datos necesarios para poder crear reservas.</p></div></div>
          <div className="account-grid">
            <aside className="profile-card">
              <div className="profile-avatar"><UserRound size={32} /></div>
              <h2>{profile.name}</h2><p>{profile.email}</p>
              <div className="profile-list">
                <span>Tipo de cuenta <strong>{profile.role === "admin" ? "Administrador" : "Cliente"}</strong></span>
                <span>Verificación <strong>{profile.verificationStatus || "pendiente"}</strong></span>
                <span>Teléfono <strong>{profile.phone || "Pendiente"}</strong></span>
                <span>DNI/NIE <strong>{profile.dni ? "Informado" : "Pendiente"}</strong></span>
                <span>Permiso <strong>{profile.drivingLicense ? "Informado" : "Pendiente"}</strong></span>
              </div>
            </aside>

            <section className="panel">
              <div className="panel-head"><h2>Datos del conductor</h2><span className={profile.verificationStatus === "verificado" ? "badge badge-success" : "badge badge-warning"}>{profile.verificationStatus === "verificado" ? "Verificado" : "Pendiente de verificar"}</span></div>
              <form className="panel-body" onSubmit={save}>
                <div className="notice notice-info" style={{ marginBottom: 16 }}><BadgeCheck size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />Esta versión guarda los datos básicos. Antes de operar con clientes reales conectaremos un proveedor de verificación documental para validar DNI y carnet sin depender de una revisión manual.</div>
                <div className="form-grid">
                  <div className="field full"><label>Nombre y apellidos</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                  <div className="field"><label>Teléfono</label><input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
                  <div className="field"><label>Correo</label><input className="input" value={profile.email} disabled /></div>
                  <div className="field"><label>DNI / NIE</label><input className="input" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="12345678A" required /></div>
                  <div className="field"><label>N.º permiso de conducir</label><input className="input" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="Número del permiso" required /></div>
                </div>
                <div className="notice notice-warning" style={{ marginTop: 16 }}><IdCard size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />No subas fotografías del DNI a esta versión de pruebas. La carga de documentos se añadirá cuando integremos el servicio de verificación adecuado.</div>
                {message && <div className={message.includes("correctamente") ? "form-success" : "form-error"}>{message}</div>}
                <button className="btn btn-primary" disabled={busy} style={{ marginTop: 16 }}>{busy ? "Guardando..." : "Guardar datos"}</button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
