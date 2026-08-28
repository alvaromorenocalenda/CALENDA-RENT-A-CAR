"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { CarFront, UserPlus } from "lucide-react";
import { auth, db } from "@/lib/firebase";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const displayName = `${name.trim()} ${surname.trim()}`.trim();
      await updateProfile(credential.user, { displayName });
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: name.trim(),
        surname: surname.trim(),
        displayName,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        role: "customer",
        verificationStatus: "pending",
        createdAt: serverTimestamp(),
      });
      router.push("/vehiculos");
    } catch (err: unknown) {
      const code = typeof err === "object" && err && "code" in err ? String((err as { code?: string }).code) : "";
      setError(code.includes("email-already-in-use") ? "Ya existe una cuenta con ese correo." : "No hemos podido crear la cuenta. Comprueba los datos e inténtalo de nuevo.");
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
          <h1>Tu alquiler empieza aquí.</h1>
          <p>Crea tu cuenta. Después añadiremos la verificación de identidad, carnet de conducir, método de pago y validación para poder abrir los vehículos.</p>
        </div>
        <span style={{ color: "#7890a5", fontSize: 13 }}>Registro seguro con Firebase Authentication</span>
      </section>

      <section className="auth-main">
        <div className="auth-card">
          <h2>Crear cuenta</h2>
          <p>Introduce tus datos básicos para empezar.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            <div className="form-grid">
              <div className="field"><label htmlFor="name">Nombre</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div className="field"><label htmlFor="surname">Apellidos</label><input id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} required /></div>
              <div className="field full"><label htmlFor="phone">Teléfono</label><input id="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
              <div className="field full"><label htmlFor="email">Correo electrónico</label><input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="field full"><label htmlFor="password">Contraseña</label><input id="password" type="password" autoComplete="new-password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}><UserPlus size={18} /> {loading ? "Creando cuenta..." : "Crear cuenta"}</button>
          </form>
          <div className="form-help">¿Ya tienes cuenta? <Link href="/login">Iniciar sesión</Link></div>
          <div className="form-help"><Link href="/">← Volver al inicio</Link></div>
        </div>
      </section>
    </main>
  );
}
