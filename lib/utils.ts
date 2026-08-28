import type { Booking, BookingStatus } from "./types";

export const money = (value: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value || 0);

export const dateTime = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export const dateOnly = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(d);
};

export function rentalDays(startAt: string, endAt: string) {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  if (!start || !end || end <= start) return 0;
  return Math.max(1, Math.ceil((end - start) / 86_400_000));
}

export function bookingTotal(startAt: string, endAt: string, priceDay: number) {
  return rentalDays(startAt, endAt) * priceDay;
}

export function overlaps(startAt: string, endAt: string, booking: Booking) {
  if (["cancelada", "finalizada"].includes(booking.status)) return false;
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  const otherStart = new Date(booking.startAt).getTime();
  const otherEnd = new Date(booking.endAt).getTime();
  return start < otherEnd && end > otherStart;
}

export function bookingStatusLabel(status: BookingStatus) {
  const labels: Record<BookingStatus, string> = {
    pendiente: "Pendiente",
    confirmada: "Confirmada",
    activa: "En curso",
    finalizada: "Finalizada",
    cancelada: "Cancelada",
  };
  return labels[status];
}

export function bookingStatusClass(status: BookingStatus) {
  return `badge badge-${status}`;
}

export function reservationWindow(startAt: string, endAt: string) {
  const now = Date.now();
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  return {
    before: now < start,
    active: now >= start && now <= end,
    after: now > end,
  };
}
