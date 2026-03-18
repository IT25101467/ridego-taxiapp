"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Trip, TripStatus, STATUS_COLORS, STATUS_LABELS, formatCurrency, formatDate } from "@/lib/mock-data";

const ALL_STATUSES: TripStatus[] = ["PENDING", "ASSIGNED", "ON_TRIP", "COMPLETED", "CANCELLED"];

export default function AllBookingsView() {
  const { trips, drivers, assignDriver, updateTripStatus } = useApp();
  const [selectedTripForAssign, setSelectedTripForAssign] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<TripStatus | "ALL">("ALL");

  const availableDrivers = drivers.filter((d) => d.available);
  const filtered = filterStatus === "ALL" ? trips : trips.filter((t) => t.status === filterStatus);

  const stats = {
    total: trips.length,
    pending: trips.filter((t) => t.status === "PENDING").length,
    active: trips.filter((t) => t.status === "ON_TRIP").length,
    completed: trips.filter((t) => t.status === "COMPLETED").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">All Bookings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage and monitor all ride requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Rides", value: stats.total, color: "text-foreground" },
          { label: "Pending", value: stats.pending, color: "text-amber-600" },
          { label: "On Trip", value: stats.active, color: "text-blue-600" },
          { label: "Completed", value: stats.completed, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterStatus === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-border"
            }`}
          >
            {s === "ALL" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Assign Driver Modal */}
      {selectedTripForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSelectedTripForAssign(null)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-semibold text-foreground mb-4">Assign a Driver</h3>
            {availableDrivers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No available drivers right now.</p>
            ) : (
              <div className="space-y-2">
                {availableDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => {
                      assignDriver(selectedTripForAssign, driver.id);
                      setSelectedTripForAssign(null);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition text-left border border-border"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{driver.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.totalTrips} trips · ★ {driver.rating}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setSelectedTripForAssign(null)}
              className="mt-4 w-full py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bookings table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Route</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Driver</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fare</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((trip) => (
                <tr key={trip.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 text-xs text-muted-foreground font-mono">#{trip.id}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{trip.customerName}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="text-sm text-foreground">{trip.pickup}</div>
                    <div className="text-xs text-muted-foreground">→ {trip.dropoff}</div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground text-sm">
                    {trip.driverName ?? <span className="text-amber-500 font-medium">Unassigned</span>}
                  </td>
                  <td className="px-5 py-4">
                    {/* Inline status changer */}
                    <select
                      value={trip.status}
                      onChange={(e) => updateTripStatus(trip.id, e.target.value as TripStatus)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${STATUS_COLORS[trip.status]}`}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-foreground">{formatCurrency(trip.fare)}</td>
                  <td className="px-5 py-4 text-right">
                    {trip.status === "PENDING" && (
                      <button
                        onClick={() => setSelectedTripForAssign(trip.id)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition whitespace-nowrap"
                      >
                        Assign Driver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No bookings found for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
