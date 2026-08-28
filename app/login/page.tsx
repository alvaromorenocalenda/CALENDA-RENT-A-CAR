"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [nextPath, setNextPath] = useState("/mis-reservas");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next?.startsWith("/")) setNextPath(next);
  }, []);

  useEffect(() => {
    if (user) router.replace(nextPath);
  }, [user, router, nextPath]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push(nextPath);
    } catch (err) {
      console.error(err);
      setError("No se ha podido iniciar sesión. Revisa el correo y la contraseña.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <AppHeader />
      <main className="auth-shell">
        <form className="auth-card" onSubmit={submit}>
          <p className="eyebrow">Acceso cliente</p>
          <h1>Entra en tu cuenta</h1>
          <p>Consulta tus reservas, sube inspecciones y gestiona tus alquileres.</p>
          <div className="field"><label>Correo electrónico</label><input className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="field" style={{ marginTop: 13 }}><label>Contraseña</label><input className="input" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={busy} style={{ marginTop: 18 }}>{busy ? "Entrando..." : "Entrar"}</button>
          <div className="auth-footer">¿Todavía no tienes cuenta? <Link href="/registro">Crear cuenta</Link></div>
        </form>
      </main>
    </div>
  );
}
