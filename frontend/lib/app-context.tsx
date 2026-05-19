"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE_URL } from "./config";
import {
  User,
  Driver,
  Trip,
  Review,
  DriverReview,
  DriverReviewSummary,
  TripStatus,
  mockUsers,
  mockDrivers,
  mockTrips,
  mockReviews,
} from "./mock-data";

interface AppContextValue {
  currentUser: User | Driver | null;
  trips: Trip[];
  drivers: Driver[];
  customers: User[];
  reviews: Review[];
  driverReviews: DriverReview[];
  driverReviewSummaries: DriverReviewSummary[];
  tripRatings: Record<string, number>;
  login: (email: string, password: string, role: string) => Promise<boolean>;  
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  addTrip: (trip: Trip) => void;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  assignDriver: (tripId: string, driverId: string) => void;
  toggleDriverAvailability: (driverId: string) => void;
  addReview: (review: Review) => void;
  updateReview: (id: string, data: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  rateTripDriver: (tripId: string, rating: number) => Promise<{ success: boolean; error?: string }>;
  addCustomer: (user: Omit<User, "id">) => void;
  updateCustomer: (id: string, data: Partial<User>) => void;
  deleteCustomer: (id: string) => void;
  addDriver: (driver: Omit<Driver, "id">) => void;
  updateDriver: (id: string, data: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  updateProfile: (id: string, data: Record<string, string>) => Promise<Record<string, any>>;
  deleteAccount: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | Driver | null>(null);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [customers, setCustomers] = useState<User[]>(mockUsers);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [driverReviews, setDriverReviews] = useState<DriverReview[]>([]);
  const [driverReviewSummaries, setDriverReviewSummaries] = useState<DriverReviewSummary[]>([]);
  const [tripRatings, setTripRatings] = useState<Record<string, number>>({});

  async function loadDriverReviewSummaries() {
    try {
      const res = await fetch(`${API_BASE_URL}/driver-reviews/summary`);
      if (res.ok) {
        setDriverReviewSummaries(await res.json());
      }
    } catch (error) {
      console.error("Failed to load driver review summaries", error);
    }
  }

  useEffect(() => {
    async function loadRealData() {
      try {
        let nameById = (id: string) => id;

        console.log("Fetching real users from Java...");
        const userRes = await fetch(`${API_BASE_URL}/users/all`);
        if (userRes.ok) {
          const allUsers = await userRes.json();
          const realCustomers = allUsers.filter((u: { role: string }) => u.role.toLowerCase() === "customer");
          const realDrivers = allUsers.filter((u: { role: string }) => u.role.toLowerCase() === "driver");
          setCustomers(realCustomers);
          setDrivers(realDrivers);
          nameById = (id: string) => allUsers.find((u: { id: string }) => u.id === id)?.name ?? id;
        }

        console.log("Fetching real bookings from Java...");
        const tripRes = await fetch(`${API_BASE_URL}/bookings/all`);
        if (tripRes.ok) {
          const javaData = await tripRes.json();
          const realTrips: Trip[] = javaData.map((jTrip: {
            bookingId: string;
            passengerId: string;
            driverId: string | null;
            pickupLocation: string;
            dropoffLocation: string;
            status: TripStatus;
            calculatedFare?: number;
            distanceInKm?: number;
          }) => ({
            id: jTrip.bookingId,
            customerId: jTrip.passengerId,
            customerName: nameById(jTrip.passengerId),
            driverId: jTrip.driverId,
            driverName: jTrip.driverId ? nameById(jTrip.driverId) : null,
            pickup: jTrip.pickupLocation,
            dropoff: jTrip.dropoffLocation,
            vehicleType: "Car",
            status: jTrip.status,
            fare: jTrip.calculatedFare || 0,
            distance: jTrip.distanceInKm || 0,
            date: new Date().toISOString(),
          }));
          setTrips(realTrips);
        }

        console.log("Fetching app reviews from Java...");
        const reviewRes = await fetch(`${API_BASE_URL}/reviews/all`);
        if (reviewRes.ok) {
          setReviews(await reviewRes.json());
        }

        console.log("Fetching driver reviews from Java...");
        const driverReviewRes = await fetch(`${API_BASE_URL}/driver-reviews/all`);
        if (driverReviewRes.ok) {
          const loaded: DriverReview[] = await driverReviewRes.json();
          setDriverReviews(loaded);
          const loadedRatings: Record<string, number> = {};
          loaded.forEach((rev) => {
            loadedRatings[rev.bookingId] = rev.rating;
          });
          setTripRatings(loadedRatings);
        }

        await loadDriverReviewSummaries();
      } catch (error) {
        console.error("Critical: Could not load data from Java server.", error);
      }
    }
    loadRealData();
  }, []);


  // --- REAL JAVA REGISTRATION ---
  async function register(userData: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return response.ok;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  }
// --- REAL JAVA LOGIN ---
  async function login(email: string, password: string, role: string): Promise<boolean> {
    console.log(`Attempting real login for ${email} as ${role}...`);

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.error) {
        // Java sent back an error (e.g., "Invalid email or password")
        console.error("Login failed:", data.error);
        alert(data.error); // Optional: show a quick popup to the user
        return false;
      }

      // Success! Java sent back the user profile.
      setCurrentUser(data);
      console.log("Login successful! Welcome,", data.name);
      return true;

    } catch (error) {
      console.error("Server connection failed", error);
      alert("Could not connect to the server.");
      return false;
    }
  }

  function logout() {
    console.log("[v0] User logged out");
    setCurrentUser(null);
  }

async function addTrip(trip: Trip) {
    console.log("Sending new ride to Spring Boot...");

    // 1. Send the data to your Java backend
    const response = await fetch(`${API_BASE_URL}/bookings/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: trip.id,
        passengerId: trip.customerId || "P-001",
        pickupLocation: trip.pickup,
        dropoffLocation: trip.dropoff,
        // The Magic Fix: We add "|| 0.0" so if it's empty, it sends a zero instead of crashing Java!
        distanceInKm: trip.distance || 0.0, 
        calculatedFare: trip.fare || 0.0,
        status: trip.status || "PENDING"
      })
    });

    // 2. Read the reply from Java
    const reply = await response.text();
    console.log("Java replied:", reply);

    // 3. Update the UI so the new trip shows up on the screen
    setTrips((prev) => [trip, ...prev]);
  }

async function updateTripStatus(tripId: string, status: TripStatus) {
    // 1. Instantly update the React UI so the button changes colors
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status } : t))
    );

    // 2. If the driver clicked "Finish Trip", tell Java to save it!
    if (status === "COMPLETED") {
      try {
        console.log(`Telling Java to complete trip ${tripId}...`);
        await fetch(`${API_BASE_URL}/bookings/complete/${tripId}?driverId=${currentUser?.id}`, {
          method: "PUT",
        });
      } catch (error) {
        console.error("Failed to update Java", error);
      }
    } 
  }

async function assignDriver(tripId: string, driverId: string) {
    console.log(`Assigning Driver ${driverId} to Trip ${tripId} in Spring Boot...`);
    
    // 1. Send the update to your Java backend
    // Note: We use the backticks ` ` to inject the variables straight into the URL
    const response = await fetch(`${API_BASE_URL}/bookings/assign/${tripId}?driverId=${driverId}`, {
      method: "PUT" // PUT is the standard for "Updating" existing data
    });

    // 2. Read Java's reply
    const reply = await response.text();
    console.log("Java replied:", reply);

// 3. Update the React UI so the Admin sees the status change to ASSIGNED
    const driver = drivers.find((d) => d.id === driverId);
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { 
              ...t, 
              driverId: driverId, 
              // The Fix: Fallback to a string if the name is missing
              driverName: driver ? driver.name : "Unknown Driver", 
              status: "ASSIGNED" 
            }
          : t
      )
    );
  }

async function toggleDriverAvailability(driverId: string) {
    // 1. Figure out what the NEW status should be
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;
    const newStatus = !driver.available;

    // 2. Instantly update the UI so the button feels "snappy"
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, available: newStatus } : d))
    );

    // If the person logged in IS the driver, update their session too
    if (currentUser?.id === driverId) {
      setCurrentUser((prev) => (prev ? { ...prev, available: newStatus } : prev));
    }

    // 3. Tell Java to save this change to users.txt
    try {
      console.log(`Toggling Driver ${driverId} to ${newStatus ? "Online" : "Offline"}...`);
      await fetch(`${API_BASE_URL}/users/availability/${driverId}?status=${newStatus}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Failed to update availability in Java", error);
    }
  }

async function addReview(review: Review) {
    // 1. Instantly update the UI
    setReviews((prev) => [review, ...prev]);

    // 2. Send the full review (with comments) to Java
    try {
      console.log("Sending full review to Java...", review);
      await fetch(`${API_BASE_URL}/reviews/add-full`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
      });
    } catch (error) {
      console.error("Failed to save review to Java", error);
    }
  }

  async function updateReview(id: string, data: Partial<Review>) {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, ...data } : review)));
    try {
      await fetch(`${API_BASE_URL}/reviews/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to update review in Java", error);
    }
  }

  async function deleteReview(id: string) {
    setReviews((prev) => prev.filter((review) => review.id !== id));
    try {
      await fetch(`${API_BASE_URL}/reviews/delete/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete review in Java", error);
    }
  }

  async function rateTripDriver(tripId: string, rating: number): Promise<{ success: boolean; error?: string }> {
    if (!currentUser) {
      return { success: false, error: "You must be signed in to rate a driver." };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/driver-reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: tripId,
          customerId: currentUser.id,
          rating,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.error ?? "Failed to save rating." };
      }

      setTripRatings((prev) => ({ ...prev, [tripId]: rating }));
      if (data.review) {
        setDriverReviews((prev) => [data.review as DriverReview, ...prev]);
      }
      await loadDriverReviewSummaries();
      return { success: true };
    } catch (error) {
      console.error("Failed to save driver rating", error);
      return { success: false, error: "Could not connect to the server." };
    }
  }

  function addCustomer(user: Omit<User, "id">) {
    const newUser: User = { ...user, id: "c" + Date.now() };
    setCustomers((prev) => [...prev, newUser]);
  }

  function updateCustomer(id: string, data: Partial<User>) {
    setCustomers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  }

  async function deleteCustomer(id: string) {
    setCustomers((prev) => prev.filter((u) => u.id !== id)); // Update UI
    await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" }); // Update Java
  }

  async function deleteDriver(id: string) {
    setDrivers((prev) => prev.filter((d) => d.id !== id)); // Update UI
    await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" }); // Update Java
  }


  function addDriver(driver: Omit<Driver, "id">) {
    const newDriver: Driver = { ...driver, id: "d" + Date.now() };
    setDrivers((prev) => [...prev, newDriver]);
  }

  function updateDriver(id: string, data: Partial<Driver>) {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  }

  async function updateProfile(id: string, data: Record<string, string>) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.error) {
        return result;
      }
      setCurrentUser((prev) => (prev && prev.id === id ? { ...prev, ...result } : prev));
      if (result.role === "customer") {
        setCustomers((prev) => prev.map((u) => (u.id === id ? { ...u, name: result.name, phone: result.phone } : u)));
      }
      if (result.role === "driver") {
        setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, name: result.name, phone: result.phone } : d)));
      }
      return result;
    } catch {
      return { error: "Could not update profile." };
    }
  }

  async function deleteAccount(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!result.success) {
        return false;
      }
      setCustomers((prev) => prev.filter((u) => u.id !== id));
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      setCurrentUser(null);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        trips,
        drivers,
        customers,
        reviews,
        driverReviews,
        driverReviewSummaries,
        tripRatings,
        login,
        register,
        logout,
        addTrip,
        updateTripStatus,
        assignDriver,
        toggleDriverAvailability,
        addReview,
        updateReview,
        deleteReview,
        rateTripDriver,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addDriver,
        updateDriver,
        deleteDriver,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
