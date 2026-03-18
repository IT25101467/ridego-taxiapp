"use client";

import { useApp } from "@/lib/app-context";
import { Trip, TripStatus, STATUS_LABELS, formatCurrency, formatDate } from "@/lib/mock-data";

const STEPS: TripStatus[] = ["PENDING", "ASSIGNED", "ON_TRIP", "COMPLETED"];

function TripProgressBar({ status }: { status: TripStatus }) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="relative">
      {/* Track */}
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-border" />
        {/* Progress line */}
        <div
          className="absolute top-3 left-0 h-0.5 bg-primary transition-all duration-700"
          style={{ width: currentIndex === STEPS.length - 1 ? "100%" : `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={step} className="relative flex flex-col items-center gap-2 z-10">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isCompleted
                  ? "bg-primary border-primary"
                  : isActive
                  ? "bg-white border-primary shadow-md shadow-primary/20"
                  : "bg-white border-border"
              }`}>
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isActive ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                ) : null}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                {STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActiveTripCard({ trip }: { trip: Trip }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Active Trip</span>
          </div>
          <h3 className="text-base font-semibold text-foreground mt-1">{trip.pickup} → {trip.dropoff}</h3>
        </div>
        <span className="text-sm font-bold text-foreground">{formatCurrency(trip.fare)}</span>
      </div>

      <TripProgressBar status={trip.status} />

      {trip.driverName && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">{trip.driverName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{trip.driverName}</p>
            <p className="text-xs text-muted-foreground">{trip.vehicleType} · Assigned Driver</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-xs font-medium text-foreground">4.8</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Vehicle", value: trip.vehicleType },
          { label: "Trip ID", value: "#" + trip.id },
          { label: "Date", value: new Date(trip.date).toLocaleDateString() },
        ].map((item) => (
          <div key={item.label} className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyTripsView() {
  const { currentUser, trips } = useApp();

  // THE FIX: Use .filter() to get ALL active trips as an array
  const activeTrips = trips.filter(
    (t) => t.customerId === currentUser?.id && 
           (t.status === "PENDING" || t.status === "ASSIGNED" || t.status === "ON_TRIP")
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Trips</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track your active rides in real time</p>
      </div>

      {/* Active trips */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide text-muted-foreground">Active Rides</h2>
        
        {/* THE FIX: Check array length and map through each trip */}
        {activeTrips.length > 0 ? (
          <div className="flex flex-col gap-6">
            {activeTrips.map((trip) => (
              <ActiveTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="17" r="1" />
                <circle cx="20" cy="17" r="1" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No active ride</p>
            <p className="text-xs text-muted-foreground mt-1">Book a ride to see it tracked here</p>
          </div>
        )}
      </div>
    </div>
  );
}