"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  Driver,
  Trip,
  Review,
  TripStatus,
  mockUsers,
  mockDrivers,
  mockAdmin,
  mockTrips,
  mockReviews,
} from "./mock-data";

interface AppContextValue {
  currentUser: User | Driver | null;
  trips: Trip[];
  drivers: Driver[];
  customers: User[];
  reviews: Review[];
  tripRatings: Record<string, number>;
  login: (email: string, password: string, role: string) => Promise<boolean>;  
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  addTrip: (trip: Trip) => void;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  assignDriver: (tripId: string, driverId: string) => void;
  toggleDriverAvailability: (driverId: string) => void;
  addReview: (review: Review) => void;
  rateTripDriver: (tripId: string, rating: number) => void;
  addCustomer: (user: Omit<User, "id">) => void;
  updateCustomer: (id: string, data: Partial<User>) => void;
  deleteCustomer: (id: string) => void;
  addDriver: (driver: Omit<Driver, "id">) => void;
  updateDriver: (id: string, data: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | Driver | null>(null);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [customers, setCustomers] = useState<User[]>(mockUsers);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [tripRatings, setTripRatings] = useState<Record<string, number>>({});

useEffect(() => {
    async function loadRealData() {
      try {
        // --- 1. FETCH TRIPS ---
        console.log("Fetching real bookings from Java...");
        const tripRes = await fetch("http://localhost:8080/api/bookings/all"); 
        if (tripRes.ok) {
          const javaData = await tripRes.json();
          const realTrips: Trip[] = javaData.map((jTrip: any) => ({
            id: jTrip.bookingId,
            customerId: jTrip.passengerId,
            customerName: jTrip.passengerId, 
            driverId: jTrip.driverId,
            driverName: jTrip.driverId ? "Driver " + jTrip.driverId : null,
            pickup: jTrip.pickupLocation,
            dropoff: jTrip.dropoffLocation,
            vehicleType: "Car", 
            status: jTrip.status,
            fare: jTrip.calculatedFare || 0,
            distance: jTrip.distanceInKm || 0,
            date: new Date().toISOString()
          }));
          setTrips(realTrips); 
        }

        // --- 2. FETCH REVIEWS (NEW!) ---
        console.log("Fetching real reviews from Java...");
        const reviewRes = await fetch("http://localhost:8080/api/reviews/all");
        if (reviewRes.ok) {
          const javaReviews = await reviewRes.json();
          setReviews(javaReviews);

          // This maps the stars so React remembers what you clicked!
          const loadedRatings: Record<string, number> = {};
          javaReviews.forEach((rev: any) => {
            // Your ReviewController saves the trip ID in the "id" field
            loadedRatings[rev.id] = rev.rating; 
          });
          setTripRatings(loadedRatings);
        }

// --- 3. FETCH ALL USERS (NEW!) ---
        console.log("Fetching real users from Java...");
        const userRes = await fetch("http://localhost:8080/api/users/all");
        if (userRes.ok) {
          const allUsers = await userRes.json();
          
          // Filter the big list into our specific states
          const realCustomers = allUsers.filter((u: any) => u.role.toLowerCase() === "customer");
          const realDrivers = allUsers.filter((u: any) => u.role.toLowerCase() === "driver");

          setCustomers(realCustomers);
          setDrivers(realDrivers);
          console.log(`Loaded ${realCustomers.length} customers and ${realDrivers.length} drivers.`);
        }

      } catch (error) {
        console.error("Critical: Could not load data from Java server.", error);
      }
    }
    loadRealData();
  }, []);


  // --- REAL JAVA REGISTRATION ---
  async function register(userData: any): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
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
      const response = await fetch("http://localhost:8080/api/users/login", {
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
    const response = await fetch("http://localhost:8080/api/bookings/request", {
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
        await fetch(`http://localhost:8080/api/bookings/complete/${tripId}?driverId=${currentUser?.id}`, {
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
    const response = await fetch(`http://localhost:8080/api/bookings/assign/${tripId}?driverId=${driverId}`, {
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
      await fetch(`http://localhost:8080/api/users/availability/${driverId}?status=${newStatus}`, {
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
      await fetch("http://localhost:8080/api/reviews/add-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
      });
    } catch (error) {
      console.error("Failed to save review to Java", error);
    }
  }

// --- REAL STAR RATING SUBMISSION ---
  async function rateTripDriver(tripId: string, rating: number) {
    // 1. Instantly update the UI so the stars turn yellow
    setTripRatings((prev) => ({ ...prev, [tripId]: rating }));
    
    // 2. Send the rating to the new Java endpoint
    try {
      console.log(`Sending ${rating} star rating for trip ${tripId} to Java...`);
      await fetch(`http://localhost:8080/api/reviews/add?tripId=${tripId}&rating=${rating}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to save rating to Java", error);
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
    await fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" }); // Update Java
  }

  async function deleteDriver(id: string) {
    setDrivers((prev) => prev.filter((d) => d.id !== id)); // Update UI
    await fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" }); // Update Java
  }


  function addDriver(driver: Omit<Driver, "id">) {
    const newDriver: Driver = { ...driver, id: "d" + Date.now() };
    setDrivers((prev) => [...prev, newDriver]);
  }

  function updateDriver(id: string, data: Partial<Driver>) {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  }



  return (
    <AppContext.Provider
      value={{
        currentUser,
        trips,
        drivers,
        customers,
        reviews,
        tripRatings,
        login,
        register,
        logout,
        addTrip,
        updateTripStatus,
        assignDriver,
        toggleDriverAvailability,
        addReview,
        rateTripDriver,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addDriver,
        updateDriver,
        deleteDriver,
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
