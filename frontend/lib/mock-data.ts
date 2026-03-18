// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = "customer" | "driver" | "admin";
export type TripStatus = "PENDING" | "ASSIGNED" | "ON_TRIP" | "COMPLETED" | "CANCELLED";
export type VehicleType = "Car" | "Tuk" | "Van" | "Bike";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  password: string; // plain for demo only
}

export interface Driver extends User {
  role: "driver";
  available: boolean;
  totalTrips: number;
  rating: number;
}

export interface Trip {
  id: string;
  distance?: number | string;
  customerId: string;
  customerName: string;
  driverId: string | null;
  driverName: string | null;
  pickup: string;
  dropoff: string;
  vehicleType: VehicleType;
  status: TripStatus;
  fare: number;
  date: string;
}

export interface Review {
  id: string;
  customerId: string;
  rating: number;
  comment: string;
  date: string;
}

// ─── Mock Users ───────────────────────────────────────────────────────────────

export const mockUsers: User[] = [
  {
    id: "c1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+94 77 123 4567",
    role: "customer",
    password: "password",
  },
  {
    id: "c2",
    name: "James Perera",
    email: "james@example.com",
    phone: "+94 71 234 5678",
    role: "customer",
    password: "password",
  },
  {
    id: "c3",
    name: "Amelia Fernando",
    email: "amelia@example.com",
    phone: "+94 76 345 6789",
    role: "customer",
    password: "password",
  },
];

export const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "Nimal Bandara",
    email: "nimal@example.com",
    phone: "+94 77 987 6543",
    role: "driver",
    password: "password",
    available: true,
    totalTrips: 142,
    rating: 4.8,
  },
  {
    id: "d2",
    name: "Kamal Silva",
    email: "kamal@example.com",
    phone: "+94 71 876 5432",
    role: "driver",
    password: "password",
    available: false,
    totalTrips: 87,
    rating: 4.6,
  },
  {
    id: "d3",
    name: "Ruwan Jayawardena",
    email: "ruwan@example.com",
    phone: "+94 76 765 4321",
    role: "driver",
    password: "password",
    available: true,
    totalTrips: 210,
    rating: 4.9,
  },
];

export const mockAdmin: User = {
  id: "a1",
  name: "Admin User",
  email: "admin@ridego.com",
  phone: "+94 11 000 0000",
  role: "admin",
  password: "admin123",
};

// ─── Mock Trips ───────────────────────────────────────────────────────────────

export const mockTrips: Trip[] = [
  {
    id: "t1",
    customerId: "c1",
    customerName: "Sarah Johnson",
    driverId: "d1",
    driverName: "Nimal Bandara",
    pickup: "Colombo Fort",
    dropoff: "Nugegoda",
    vehicleType: "Car",
    status: "ON_TRIP",
    fare: 650,
    date: "2025-01-10T09:30:00",
  },
  {
    id: "t2",
    customerId: "c2",
    customerName: "James Perera",
    driverId: null,
    driverName: null,
    pickup: "Kandy City Center",
    dropoff: "Peradeniya",
    vehicleType: "Tuk",
    status: "PENDING",
    fare: 180,
    date: "2025-01-10T10:15:00",
  },
  {
    id: "t3",
    customerId: "c3",
    customerName: "Amelia Fernando",
    driverId: "d3",
    driverName: "Ruwan Jayawardena",
    pickup: "Galle Bus Stand",
    dropoff: "Unawatuna",
    vehicleType: "Van",
    status: "COMPLETED",
    fare: 420,
    date: "2025-01-09T14:00:00",
  },
  {
    id: "t4",
    customerId: "c1",
    customerName: "Sarah Johnson",
    driverId: "d2",
    driverName: "Kamal Silva",
    pickup: "Wellawatte",
    dropoff: "Mount Lavinia",
    vehicleType: "Car",
    status: "COMPLETED",
    fare: 310,
    date: "2025-01-08T17:45:00",
  },
  {
    id: "t5",
    customerId: "c1",
    customerName: "Sarah Johnson",
    driverId: "d1",
    driverName: "Nimal Bandara",
    pickup: "Bambalapitiya",
    dropoff: "Kollupitiya",
    vehicleType: "Tuk",
    status: "COMPLETED",
    fare: 120,
    date: "2025-01-07T08:00:00",
  },
  {
    id: "t6",
    customerId: "c2",
    customerName: "James Perera",
    driverId: "d3",
    driverName: "Ruwan Jayawardena",
    pickup: "Pettah",
    dropoff: "Dehiwala",
    vehicleType: "Car",
    status: "COMPLETED",
    fare: 480,
    date: "2025-01-06T11:30:00",
  },
];

// ─── Mock Reviews ─────────────────────────────────────────────────────────────

export const mockReviews: Review[] = [
  {
    id: "r1",
    customerId: "c1",
    rating: 5,
    comment: "Excellent service! The driver was very professional.",
    date: "2025-01-09",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_LABELS: Record<TripStatus, string> = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  ON_TRIP: "On Trip",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const STATUS_COLORS: Record<TripStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  ON_TRIP: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};
