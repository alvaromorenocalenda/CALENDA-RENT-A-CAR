import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./business.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Calenda Rent a Car",
    template: "%s · Calenda Rent a Car",
  },
  description: "Reserva, abre y devuelve tu coche desde el móvil.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d71920",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-white">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
