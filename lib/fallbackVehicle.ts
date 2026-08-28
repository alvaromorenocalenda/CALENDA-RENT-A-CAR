import type { Vehicle } from "@/lib/types";

export const firstCalendaVehicle: Vehicle = {
  id: "citroen-c4-cactus",
  brand: "Citroën",
  model: "C4 Cactus",
  plate: "",
  year: 2017,
  fuel: "Gasolina",
  transmission: "Manual",
  seats: 5,
  priceDay: 39,
  deposit: 250,
  status: "disponible",
  city: "Higuera la Real",
  pickupAddress: "Higuera la Real, Badajoz",
  description: "Un crossover cómodo, práctico y diferente, ideal tanto para desplazamientos diarios como para escapadas.",
  imageUrl: "/vehicles/citroen-c4-cactus/portada.webp",
  galleryImages: [
    "/vehicles/citroen-c4-cactus/portada.webp",
    "/vehicles/citroen-c4-cactus/lateral.webp",
    "/vehicles/citroen-c4-cactus/trasera.webp",
    "/vehicles/citroen-c4-cactus/frontal.webp",
  ],
  features: ["Aire acondicionado", "5 plazas", "Amplio maletero"],
  active: true,
};
