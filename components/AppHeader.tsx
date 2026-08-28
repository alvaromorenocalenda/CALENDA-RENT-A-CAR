"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CarFront, LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const links = [
  { href: "/vehiculos", label: "Vehículos" },
  { href: "/mis-reservas", label: "Mis reservas" },
  { href: "/mi-cuenta", label: "Mi cuenta" },
];

export default function AppHeader() {
  const { user, profile, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="site-header premium-header">
      <div className="container header-inner">
        <Link href="/" className="brand premium-brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><CarFront size={21} strokeWidth={1.9} /></span>
          <span className="brand-copy"><strong>CALENDA</strong><small>RENT A CAR</small></span>
        </Link>

        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href || pathname.startsWith(item.href + "/") ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {profile?.role === "admin" && (
            <Link href="/admin" className={pathname.startsWith("/admin") ? "active" : ""} onClick={() => setOpen(false)}>
              <ShieldCheck size={15} /> Administración
            </Link>
          )}
        </nav>

        <div className="header-actions">
          {!loading && !user && (
            <>
              <Link href="/login" className="btn btn-ghost btn-small">Entrar</Link>
              <Link href="/registro" className="btn btn-dark btn-small header-cta">Crear cuenta</Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link href="/mi-cuenta" className="user-chip">
                <span className="user-avatar"><UserRound size={15} /></span>
                <span>{profile?.name?.split(" ")[0] || "Mi cuenta"}</span>
              </Link>
              <button className="icon-button desktop-only" onClick={doLogout} title="Cerrar sesión"><LogOut size={17} /></button>
            </>
          )}
          <button className="menu-button" onClick={() => setOpen((v) => !v)} aria-label="Abrir menú">
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
      {open && user && <button className="mobile-logout" onClick={doLogout}><LogOut size={17} /> Cerrar sesión</button>}
    </header>
  );
}
