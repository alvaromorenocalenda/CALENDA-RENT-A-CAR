"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AppHeader from "@/components/AppHeader";
import { auth, db } from "@/lib/firebase";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });
      const now = new Date().toISOString();
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: "cliente",
        verificationStatus: "pendiente",
        createdAt: now,
        updatedAt: now,
      });
      router.push("/mi-cuenta?bienvenida=1");
    } catch (err: any) {
      console.error(err);
      if (err?.code === "auth/email-already-in-use") setError("Ya existe una cuenta con ese correo.");
      else setError("No se ha podido crear la cuenta. Revisa los datos e inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <AppHeader />
      <main className="auth-shell">
        <form className="auth-card" onSubmit={submit}>
          <p className="eyebrow">Alta de cliente</p>
          <h1>Crea tu cuenta</h1>
          <p>Después podrás completar tus datos de conductor y reservar vehículos.</p>
          <div className="form-grid">
            <div className="field full"><label>Nombre y apellidos</label><input className="input" required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label>Teléfono</label><input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div className="field"><label>Correo electrónico</label><input className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="field"><label>Contraseña</label><input className="input" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <div className="field"><label>Repetir contraseña</label><input className="input" type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={busy} style={{ marginTop: 18 }}>{busy ? "Creando cuenta..." : "Crear cuenta"}</button>
          <div className="auth-footer">¿Ya estás registrado? <Link href="/login">Entrar</Link></div>
        </form>
      </main>
    </div>
  );
}
