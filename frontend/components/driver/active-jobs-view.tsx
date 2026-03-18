"use client";

import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDate } from "@/lib/mock-data";
import { Driver } from "@/lib/mock-data";

export default function ActiveJobsView() {
  const { currentUser, trips, updateTripStatus, toggleDriverAvailability } = useApp();
  const driver = currentUser as Driver;

  const assignedTrips = trips.filter(
    (t) => t.driverId === currentUser?.id && (t.status === "ASSIGNED" || t.status === "ON_TRIP")
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Active Jobs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Trips assigned to you by the dispatcher</p>
      </div>

      {/* Availability banner */}
      <div className={`rounded-2xl border p-5 flex items-center justify-between ${
        driver?.available ? "bg-green-50 border-green-200" : "bg-muted border-border"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${driver?.available ? "bg-green-100" : "bg-border"}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={driver?.available ? "#16a34a" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="17" r="1" />
              <circle cx="20" cy="17" r="1" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {driver?.available ? "You are available for rides" : "You are currently offline"}
            </p>
            <p className="text-xs text-muted-foreground">
              {driver?.available ? "You will receive new job assignments" : "Toggle to start accepting rides"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">{driver?.available ? "Online" : "Offline"}</span>
          <button
            onClick={() => toggleDriverAvailability(driver.id)}
            className={`relative w-12 h-6 rounded-full transition-colors ${driver?.available ? "bg-green-500" : "bg-border"}`}
            aria-label="Toggle availability"
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${driver?.available ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Assigned trips */}
      {assignedTrips.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">No active jobs right now</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {driver?.available
              ? "Stay online — you'll be notified when a job is assigned."
              : "Go online to start receiving trip assignments."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignedTrips.map((trip) => (
            <div key={trip.id} className="bg-card border border-border rounded-2xl p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {trip.status === "ASSIGNED" ? "Assigned" : "On Trip"}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-foreground">Trip #{trip.id}</p>
                </div>
                <span className="text-lg font-bold text-foreground">{formatCurrency(trip.fare)}</span>
              </div>

              {/* Route */}
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pickup</p>
                    <p className="text-sm font-medium text-foreground">{trip.pickup}</p>
                  </div>
                </div>
                <div className="ml-1.5 border-l-2 border-dashed border-border pl-3 py-0.5">
                  <div className="w-0" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Drop-off</p>
                    <p className="text-sm font-medium text-foreground">{trip.dropoff}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Customer", value: trip.customerName },
                  { label: "Vehicle", value: trip.vehicleType },
                  { label: "Date", value: new Date(trip.date).toLocaleDateString() },
                ].map((item) => (
                  <div key={item.label} className="bg-muted rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {trip.status === "ASSIGNED" && (
                  <button
                    onClick={() => {
                      console.log("[v0] PUT /api/trips/" + trip.id + "/status — ON_TRIP");
                      updateTripStatus(trip.id, "ON_TRIP");
                    }}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
                  >
                    Start Trip
                  </button>
                )}
                {trip.status === "ON_TRIP" && (
                  <button
                    onClick={() => {
                      console.log("[v0] PUT /api/trips/" + trip.id + "/status — COMPLETED");
                      updateTripStatus(trip.id, "COMPLETED");
                    }}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition"
                  >
                    Finish Trip
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
