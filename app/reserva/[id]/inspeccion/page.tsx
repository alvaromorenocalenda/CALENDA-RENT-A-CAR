"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Camera, CheckCircle2, Image as ImageIcon } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/components/AuthProvider";
import { db, storage } from "@/lib/firebase";
import type { Booking, InspectionPhoto } from "@/lib/types";

const SLOTS = [
  ["frontal", "Frontal"],
  ["trasera", "Trasera"],
  ["lateral-izquierdo", "Lateral izquierdo"],
  ["lateral-derecho", "Lateral derecho"],
  ["esquina-delantera", "Esquina delantera"],
  ["esquina-trasera", "Esquina trasera"],
  ["interior", "Interior"],
  ["cuadro", "Cuadro / combustible / km"],
] as const;

export default function InspectionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("tipo") === "final" ? "final" : "inicial";
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [photos, setPhotos] = useState<InspectionPhoto[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace(`/login?next=${encodeURIComponent(`/reserva/${params.id}/inspeccion?tipo=${type}`)}`); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "bookings", params.id));
        if (!snap.exists()) return;
        const data = { id: snap.id, ...(snap.data() as Omit<Booking, "id">) };
        if (data.userId !== user.uid) return;
        setBooking(data);
        setPhotos(type === "inicial" ? data.initialPhotos || [] : data.finalPhotos || []);
      } finally { setLoading(false); }
    })();
  }, [user, authLoading, params.id, router, type]);

  const complete = useMemo(() => SLOTS.every(([slot]) => photos.some((p) => p.slot === slot)), [photos]);

  const upload = async (slot: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !booking || !user) return;
    if (!file.type.startsWith("image/")) return setError("Solo se admiten imágenes.");
    if (file.size > 12 * 1024 * 1024) return setError("La fotografía no puede superar 12 MB.");
    setError("");
    setUploading(slot);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `booking-inspections/${user.uid}/${booking.id}/${type}/${slot}-${Date.now()}-${safeName}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);
      const nextPhoto: InspectionPhoto = { slot, name: safeName, url, path, uploadedAt: new Date().toISOString() };
      const next = [...photos.filter((p) => p.slot !== slot), nextPhoto];
      setPhotos(next);
      const field = type === "inicial" ? "initialPhotos" : "finalPhotos";
      await updateDoc(doc(db, "bookings", booking.id), { [field]: next, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.error(e);
      setError("No se ha podido subir la fotografía. Comprueba Firebase Storage y sus reglas.");
    } finally { setUploading(null); }
  };

  const finish = async () => {
    if (!booking || !complete) return;
    try {
      const field = type === "inicial" ? "inspectionInitialComplete" : "inspectionFinalComplete";
      await updateDoc(doc(db, "bookings", booking.id), { [field]: true, updatedAt: new Date().toISOString() });
      router.push(`/reserva/${booking.id}`);
    } catch (e) { console.error(e); setError("No se ha podido completar la inspección."); }
  };

  if (authLoading || loading) return <><AppHeader /><div className="loading-screen"><div className="loader" /></div></>;
  if (!booking) return <><AppHeader /><main className="page-main"><div className="container"><div className="panel"><div className="empty-state"><strong>Inspección no disponible</strong></div></div></div></main></>;

  return (
    <div className="page">
      <AppHeader />
      <main className="page-main">
        <div className="container">
          <div className="page-heading">
            <div><p className="eyebrow">{type === "inicial" ? "Antes de conducir" : "Antes de finalizar"}</p><h1>Inspección {type}</h1><p>{booking.vehicleName} · {booking.vehiclePlate}. Haz las 8 fotografías obligatorias con el coche completo y bien visible.</p></div>
            <Link href={`/reserva/${booking.id}`} className="btn btn-light">Volver a la reserva</Link>
          </div>

          <div className="notice notice-warning" style={{ marginBottom: 18 }}><Camera size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />Usa fotografías actuales tomadas en el momento de la entrega o devolución. Se guardan asociadas a esta reserva.</div>
          {error && <div className="form-error">{error}</div>}

          <div className="photo-grid">
            {SLOTS.map(([slot, label]) => {
              const photo = photos.find((p) => p.slot === slot);
              return (
                <article className="photo-slot" key={slot}>
                  <div className="photo-preview">
                    {photo ? <img src={photo.url} alt={label} /> : <ImageIcon size={38} color="#9aa8b6" />}
                  </div>
                  <div className="photo-slot-body">
                    <strong>{photo ? <><CheckCircle2 size={14} color="#14805e" style={{ verticalAlign: "middle", marginRight: 5 }} />{label}</> : label}</strong>
                    <input className="photo-input" type="file" accept="image/*" capture="environment" disabled={uploading !== null} onChange={(e) => upload(slot, e)} />
                    {uploading === slot && <div className="muted small" style={{ marginTop: 6 }}>Subiendo fotografía...</div>}
                  </div>
                </article>
              );
            })}
          </div>

          <section className="panel" style={{ marginTop: 20 }}>
            <div className="panel-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
              <div><strong style={{ color: "#0b1f33" }}>{photos.filter((p) => SLOTS.some(([s]) => s === p.slot)).length} / {SLOTS.length} fotografías</strong><div className="muted small">Debes completar todas antes de continuar.</div></div>
              <button className="btn btn-primary" disabled={!complete || uploading !== null} onClick={finish}>{type === "inicial" ? "Finalizar inspección inicial" : "Finalizar inspección de devolución"}</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
