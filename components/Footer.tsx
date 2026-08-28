import Link from "next/link";
import { CarFront } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand brand-light">
            <span className="brand-mark"><CarFront size={22} /></span>
            <span><strong>CALENDA</strong><small>RENT A CAR</small></span>
          </Link>
          <p>Alquiler autónomo: reserva, inspecciona, abre y devuelve el vehículo desde el móvil.</p>
        </div>
        <div>
          <strong>Alquiler</strong>
          <Link href="/vehiculos">Vehículos</Link>
          <Link href="/mis-reservas">Mis reservas</Link>
          <Link href="/mi-cuenta">Mi cuenta</Link>
        </div>
        <div>
          <strong>Información</strong>
          <span>Asistencia 24/7 · Próximamente</span>
          <span>Condiciones del alquiler · Próximamente</span>
          <span>Privacidad · Próximamente</span>
        </div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} Calenda Rent a Car · MVP en desarrollo</div>
    </footer>
  );
}
