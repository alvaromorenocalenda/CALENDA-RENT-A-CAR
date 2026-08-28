"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CalendarDays, CarFront, LayoutDashboard, UsersRound } from "lucide-react";
import { useAuth } from "./AuthProvider";

const adminLinks = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/vehiculos", label: "Vehículos", icon: CarFront },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
  { href: "/admin/clientes", label: "Clientes", icon: UsersRound },
];

export default function AdminShell({ children, title, description, action }: { children: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/admin");
  }, [loading, user, router]);

  if (loading || (user && !profile)) return <div className="loading-screen"><div className="loader" /></div>;
  if (!user) return null;

  if (profile?.role !== "admin") {
    return (
      <main className="admin-shell">
        <div className="admin-top"><div className="container"><Link href="/" className="brand brand-light premium-brand"><span className="brand-mark"><CarFront size={21} /></span><span className="brand-copy"><strong>CALENDA</strong><small>CONTROL CENTER</small></span></Link><Link href="/" className="btn btn-small btn-light">Volver a la web</Link></div></div>
        <div className="container admin-main"><div className="panel"><div className="empty-state"><strong>Tu cuenta todavía no es administradora</strong><p>Para el primer administrador, abre Firestore → colección <code>users</code> → tu UID y cambia el campo <code>role</code> de <code>cliente</code> a <code>admin</code>. Después recarga esta página.</p></div></div></div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div className="container">
          <Link href="/" className="brand brand-light premium-brand"><span className="brand-mark"><CarFront size={21} /></span><span className="brand-copy"><strong>CALENDA</strong><small>CONTROL CENTER</small></span></Link>
          <div className="admin-top-actions"><span className="admin-role-chip">Administrador</span><Link href="/" className="btn btn-small btn-light">Ver web pública</Link></div>
        </div>
      </div>
      <div className="container admin-main">
        <div className="admin-heading"><div><p className="eyebrow">Control de operaciones</p><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
        <nav className="admin-nav">
          {adminLinks.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} className={active ? "active" : ""}><Icon size={15} /> {label}</Link>;
          })}
        </nav>
        {children}
      </div>
    </main>
  );
}
