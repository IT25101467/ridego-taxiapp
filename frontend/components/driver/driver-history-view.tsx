"use client";

import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from "@/lib/mock-data";

export default function DriverHistoryView() {
  const { currentUser, trips } = useApp();

  const completedTrips = trips.filter(
    (t) => t.driverId === currentUser?.id && t.status === "COMPLETED"
  );

  const totalEarned = completedTrips.reduce((sum, t) => sum + t.fare, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Trip History</h1>
        <p className="text-sm text-muted-foreground mt-0.5">All trips you have completed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Trips Completed", value: completedTrips.length.toString() },
          { label: "Total Earned", value: formatCurrency(totalEarned) },
          { label: "Avg. Per Trip", value: completedTrips.length ? formatCurrency(Math.round(totalEarned / completedTrips.length)) : "—" },
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
            <p className="text-sm font-medium text-foreground">No completed trips yet</p>
            <p className="text-xs text-muted-foreground mt-1">Completed trips will show here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Route</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Customer</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completedTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">{formatDate(trip.date)}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground text-sm">{trip.pickup}</div>
                      <div className="text-xs text-muted-foreground">→ {trip.dropoff}</div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{trip.customerName}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[trip.status]}`}>
                        {STATUS_LABELS[trip.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-foreground">{formatCurrency(trip.fare)}</td>
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
