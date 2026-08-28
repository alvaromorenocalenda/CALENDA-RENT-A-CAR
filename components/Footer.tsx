import Link from "next/link";
import { CarFront } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer rental-footer">
      <div className="container rental-footer-grid">
        <div>
          <Link href="/" className="brand brand-light rental-brand">
            <span className="brand-mark"><CarFront size={20} /></span>
            <span><strong>CALENDA</strong><small>RENT A CAR</small></span>
          </Link>
          <p>Alquiler de vehículos con gestión digital de reservas y recogida.</p>
        </div>
        <div>
          <strong>Alquiler</strong>
          <Link href="/vehiculos">Vehículos</Link>
          <Link href="/mis-reservas">Mis reservas</Link>
          <Link href="/mi-cuenta">Mi cuenta</Link>
        </div>
        <div>
          <strong>Información</strong>
          <span>Higuera la Real · Badajoz</span>
          <span>Condiciones de alquiler</span>
          <span>Privacidad</span>
        </div>
      </div>
      <div className="container rental-footer-bottom">© {new Date().getFullYear()} Calenda Rent a Car</div>
    </footer>
  );
}
