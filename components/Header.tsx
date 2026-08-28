import Link from "next/link";
import { CarFront } from "lucide-react";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Calenda Rent a Car">
          <span className="brand-mark"><CarFront size={22} /></span>
          <span><strong>CALENDA</strong><small>RENT A CAR</small></span>
        </Link>
        <nav className="main-nav">
          <Link href="/vehiculos">Vehículos</Link>
          <Link href="/#como-funciona">Cómo funciona</Link>
          <Link href="/login">Iniciar sesión</Link>
          <Link href="/registro" className="btn btn-small btn-primary">Crear cuenta</Link>
        </nav>
      </div>
    </header>
  );
}
