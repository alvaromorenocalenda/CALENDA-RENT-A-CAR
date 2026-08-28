import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calenda Rent a Car",
  description: "Reserva, abre y devuelve tu coche desde el móvil.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
