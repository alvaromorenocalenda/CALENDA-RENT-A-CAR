import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Calenda Rent a Car",
    short_name: "Calenda Rent",
    description: "Reserva, abre y devuelve tu coche desde el móvil.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#0b1f33",
    lang: "es",
  };
}
