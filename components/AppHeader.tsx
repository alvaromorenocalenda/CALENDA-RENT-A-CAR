"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, CarFront, LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const authenticatedLinks = [
  { href: "/vehiculos", label: "Vehículos" },
  { href: "/mis-reservas", label: "Mis reservas" },
  { href: "/mi-cuenta", label: "Mi cuenta" },
];
const publicLinks = [
  { href: "/vehiculos", label: "Vehículos" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "mailto:info@calenda.es", label: "Ayuda" },
];

export default function AppHeader() {
  const { user, profile, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const visibleLinks = user ? [{ href: "/", label: "Inicio" }, ...authenticatedLinks] : publicLinks;
  const showClientNav = !!user && !pathname.startsWith("/admin") && pathname !== "/login" && pathname !== "/registro";
  const doLogout = async () => { await logout(); setOpen(false); router.push("/"); };

  return (
    <header className="site-header rental-header">
      <div className="container header-inner">
        <Link href="/" className="brand rental-brand official-brand" onClick={() => setOpen(false)} aria-label="Calenda Rent a Car">
          <Image src="/brand/calenda-rent-a-car-logo.webp" alt="Calenda Rent a Car" width={145} height={109} priority />
        </Link>
        <nav className={`main-nav rental-nav ${open ? "is-open" : ""}`}>
          {visibleLinks.map((item) => <Link key={item.href} href={item.href} className={item.href.startsWith("/#") ? "" : pathname === item.href || pathname.startsWith(item.href + "/") ? "active" : ""} onClick={() => setOpen(false)}>{item.label}</Link>)}
          {user && profile?.role === "admin" && <Link href="/admin" className={pathname.startsWith("/admin") ? "active" : ""} onClick={() => setOpen(false)}><ShieldCheck size={15} /> Administración</Link>}
        </nav>
        <div className="header-actions">
          {!loading && !user && <><Link href="/login" className="btn btn-ghost btn-small">Entrar</Link><Link href="/registro" className="btn btn-primary btn-small">Crear cuenta</Link></>}
          {!loading && user && <><Link href="/mi-cuenta" className="user-chip"><UserRound size={16} /><span>{profile?.name?.split(" ")[0] || "Mi cuenta"}</span></Link><button className="icon-button desktop-only" onClick={doLogout} title="Cerrar sesión"><LogOut size={17} /></button></>}
          <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">{open ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      {open && user && <button className="mobile-logout" onClick={doLogout}><LogOut size={17} /> Cerrar sesión</button>}
      {showClientNav && <nav className="client-bottom-nav" aria-label="Navegación principal"><Link href="/" className={pathname === "/" ? "active" : ""}><CarFront size={19} /><span>Inicio</span></Link><Link href="/vehiculos" className={pathname.startsWith("/vehiculos") ? "active" : ""}><CarFront size={19} /><span>Coches</span></Link><Link href="/mis-reservas" className={pathname.startsWith("/mis-reservas") || pathname.startsWith("/reserva/") ? "active" : ""}><CalendarDays size={19} /><span>Reservas</span></Link><Link href="/mi-cuenta" className={pathname.startsWith("/mi-cuenta") ? "active" : ""}><UserRound size={19} /><span>Cuenta</span></Link></nav>}
    </header>
  );
}
