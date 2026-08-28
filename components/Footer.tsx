import Link from "next/link";
import { CarFront, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer premium-footer">
      <div className="container footer-grid premium-footer-grid">
        <div className="footer-brand-column">
          <Link href="/" className="brand brand-light premium-brand">
            <span className="brand-mark"><CarFront size={21} /></span>
            <span className="brand-copy"><strong>CALENDA</strong><small>RENT A CAR</small></span>
          </Link>
          <p>Una forma más sencilla de alquilar: reserva, accede y devuelve el vehículo desde el móvil.</p>
          <div className="footer-contact-line"><MapPin size={15} /> Higuera la Real · Badajoz</div>
        </div>
        <div>
          <strong>Alquiler</strong>
          <Link href="/vehiculos">Vehículos</Link>
          <Link href="/mis-reservas">Mis reservas</Link>
          <Link href="/mi-cuenta">Mi cuenta</Link>
        </div>
        <div>
          <strong>Calenda</strong>
          <span>Alquiler autónomo</span>
          <span>Acceso digital</span>
          <span>Asistencia · Próximamente</span>
        </div>
        <div>
          <strong>Información</strong>
          <span>Condiciones de alquiler</span>
          <span>Privacidad y datos</span>
          <span className="footer-contact-line"><Mail size={14} /> Atención al cliente</span>
        </div>
      </div>
      <div className="container footer-bottom premium-footer-bottom">
        <span>© {new Date().getFullYear()} Calenda Rent a Car</span>
        <span>Movilidad sencilla. Tecnología útil.</span>
      </div>
    </footer>
  );
}
