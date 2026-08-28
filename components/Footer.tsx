import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">CALENDA <span>RENT A CAR</span></div>
          <p>Alquiler autónomo de vehículos con apertura desde el móvil.</p>
        </div>
        <div>
          <strong>Alquiler</strong>
          <Link href="/vehiculos">Ver vehículos</Link>
          <Link href="/#como-funciona">Cómo funciona</Link>
        </div>
        <div>
          <strong>Cuenta</strong>
          <Link href="/login">Iniciar sesión</Link>
          <Link href="/registro">Crear cuenta</Link>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 Calenda Rent a Car</div>
    </footer>
  );
}
