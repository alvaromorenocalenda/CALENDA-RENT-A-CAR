import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="site-footer rental-footer">
      <div className="container rental-footer-grid">
        <div>
          <Link href="/" className="brand brand-light rental-brand official-brand official-brand-footer" aria-label="Calenda Rent a Car">
            <Image src="/brand/calenda-rent-a-car-logo.webp" alt="Calenda Rent a Car" width={174} height={131} />
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
