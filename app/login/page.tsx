"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CarFront, LogIn } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/vehiculos");
    } catch {
      setError("No hemos podido iniciar sesión. Revisa el correo y la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-side">
        <Link href="/" className="brand" style={{ color: "white" }}>
          <span className="brand-mark"><CarFront size={22} /></span>
          <span><strong>CALENDA</strong><small style={{ color: "#a9bdce" }}>RENT A CAR</small></span>
        </Link>
        <div>
          <h1>Tu coche te espera. Sin colas.</h1>
          <p>Entra en tu cuenta para ver tus reservas, hacer la inspección del vehículo y abrirlo desde el móvil cuando llegue la hora.</p>
        </div>
        <span style={{ color: "#7890a5", fontSize: 13 }}>Reserva · Fotos · Apertura · Devolución</span>
      </section>

      <section className="auth-main">
        <div className="auth-card">
          <h2>Iniciar sesión</h2>
          <p>Accede a tu cuenta de Calenda Rent a Car.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              <LogIn size={18} /> {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <div className="form-help">¿Todavía no tienes cuenta? <Link href="/registro">Crear cuenta</Link></div>
          <div className="form-help"><Link href="/">← Volver al inicio</Link></div>
        </div>
      </section>
    </main>
  );
}
