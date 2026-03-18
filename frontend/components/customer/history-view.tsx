"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from "@/lib/mock-data";

function StarRating({ tripId }: { tripId: string }) {
  const { tripRatings, rateTripDriver } = useApp();
  const saved = tripRatings[tripId] ?? 0;
  const [hovered, setHovered] = useState(0);
  const [toast, setToast] = useState(false);

  function handleRate(star: number) {
    if (saved) return; // already rated
    rateTripDriver(tripId, star);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  const display = saved > 0 ? saved : hovered;

  return (
    <div className="relative flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={saved > 0}
          onClick={() => handleRate(star)}
          onMouseEnter={() => !saved && setHovered(star)}
          onMouseLeave={() => !saved && setHovered(0)}
          className={`transition-transform ${!saved ? "hover:scale-110" : ""} ${saved ? "cursor-default" : "cursor-pointer"}`}
          aria-label={`Rate ${star} stars`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={display >= star ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={display >= star ? "text-accent" : "text-muted-foreground/40"}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      {toast && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background text-xs font-medium px-2.5 py-1 rounded-lg shadow pointer-events-none">
          Rating submitted!
        </span>
      )}
    </div>
  );
}

export default function HistoryView() {
  const { currentUser, trips } = useApp();

  const completedTrips = trips.filter(
    (t) => t.customerId === currentUser?.id && t.status === "COMPLETED"
  );

  const totalSpent = completedTrips.reduce((sum, t) => sum + t.fare, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Trip History</h1>
        <p className="text-sm text-muted-foreground mt-0.5">All your past rides</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Rides", value: completedTrips.length.toString() },
          { label: "Total Spent", value: formatCurrency(totalSpent) },
          {
            label: "Avg. Fare",
            value: completedTrips.length
              ? formatCurrency(Math.round(totalSpent / completedTrips.length))
              : "—",
          },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {completedTrips.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-foreground">No ride history yet</p>
            <p className="text-xs text-muted-foreground mt-1">Your completed rides will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Trip</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Vehicle</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Driver</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fare</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rate Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completedTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">{formatDate(trip.date)}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground text-sm">{trip.pickup}</div>
                      <div className="text-xs text-muted-foreground">{"→"} {trip.dropoff}</div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{trip.vehicleType}</td>
                    <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{trip.driverName ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[trip.status]}`}>
                        {STATUS_LABELS[trip.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-foreground">{formatCurrency(trip.fare)}</td>
                    <td className="px-5 py-4">
                      <StarRating tripId={trip.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
