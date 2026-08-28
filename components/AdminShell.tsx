"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CarFront } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function AdminShell({ children, title, description, action }: { children: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/admin");
  }, [loading, user, router]);

  if (loading || (user && !profile)) return <div className="loading-screen"><div className="loader" /></div>;
  if (!user) return null;
  if (profile?.role !== "admin") {
    return (
      <main className="admin-shell">
        <div className="admin-top"><div className="container"><Link href="/" className="brand brand-light"><span className="brand-mark"><CarFront size={22} /></span><span><strong>CALENDA</strong><small>ADMIN · RENT A CAR</small></span></Link><Link href="/" className="btn btn-small btn-light">Volver a la web</Link></div></div>
        <div className="container admin-main"><div className="panel"><div className="empty-state"><strong>Tu cuenta todavía no es administradora</strong><p>Para el primer administrador, abre Firestore → colección <code>users</code> → tu UID y cambia el campo <code>role</code> de <code>cliente</code> a <code>admin</code>. Después recarga esta página.</p></div></div></div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="admin-top"><div className="container"><Link href="/" className="brand brand-light"><span className="brand-mark"><CarFront size={22} /></span><span><strong>CALENDA</strong><small>ADMIN · RENT A CAR</small></span></Link><Link href="/" className="btn btn-small btn-light">Ver web pública</Link></div></div>
      <div className="container admin-main">
        <div className="admin-heading"><div><p className="eyebrow">Administración</p><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
        <nav className="admin-nav"><Link href="/admin">Resumen</Link><Link href="/admin/vehiculos">Vehículos</Link><Link href="/admin/reservas">Reservas</Link><Link href="/admin/clientes">Clientes</Link></nav>
        {children}
      </div>
    </main>
  );
}
