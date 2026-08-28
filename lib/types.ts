export type UserRole = "cliente" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  dni?: string;
  drivingLicense?: string;
  verificationStatus?: "pendiente" | "verificado" | "rechazado";
  createdAt?: string;
  updatedAt?: string;
}

export type VehicleStatus = "disponible" | "alquilado" | "mantenimiento" | "inactivo";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  year: number;
  fuel: string;
  transmission: string;
  seats: number;
  priceDay: number;
  deposit: number;
  status: VehicleStatus;
  city: string;
  pickupAddress: string;
  description?: string;
  imageUrl?: string;
  features?: string[];
  active: boolean;
  trackerId?: string;
  telematicsEnabled?: boolean;
  immobilizerEnabled?: boolean;
  latitude?: number;
  longitude?: number;
  fuelLevel?: number;
  batteryVoltage?: number;
  mileage?: number;
  lastTelemetryAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus = "pendiente" | "confirmada" | "activa" | "finalizada" | "cancelada";
export type PaymentStatus = "pendiente" | "pagado" | "reembolsado";

export interface InspectionPhoto {
  slot: string;
  name: string;
  url: string;
  path: string;
  uploadedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  vehicleImageUrl?: string;
  startAt: string;
  endAt: string;
  pickupCity: string;
  pickupAddress: string;
  amount: number;
  deposit: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  initialPhotos?: InspectionPhoto[];
  finalPhotos?: InspectionPhoto[];
  inspectionInitialComplete?: boolean;
  inspectionFinalComplete?: boolean;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}
