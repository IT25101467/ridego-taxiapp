"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={rating >= star ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={rating >= star ? "text-accent" : "text-border"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function AdminDriverReviewsView() {
  const { driverReviews, driverReviewSummaries } = useApp();
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [driverFilter, setDriverFilter] = useState<string | null>(null);

  const fleetAvg =
    driverReviews.length > 0
      ? (driverReviews.reduce((sum, r) => sum + r.rating, 0) / driverReviews.length).toFixed(1)
      : "0";

  const filteredReviews = driverReviews.filter((r) => {
    if (filterRating !== null && r.rating !== filterRating) return false;
    if (driverFilter !== null && r.driverId !== driverFilter) return false;
    return true;
  });

  const sortedSummaries = [...driverReviewSummaries].sort(
    (a, b) => b.avgRating - a.avgRating
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Driver Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ratings customers gave drivers after completed trips
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Total Driver Ratings</p>
          <p className="text-2xl font-bold text-foreground mt-2">{driverReviews.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Fleet Average</p>
          <p className="text-2xl font-bold text-accent mt-2">★ {fleetAvg}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Drivers Rated</p>
          <p className="text-2xl font-bold text-foreground mt-2">{sortedSummaries.length}</p>
        </div>
      </div>

      {sortedSummaries.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Driver Ratings Overview</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSummaries.map((driver) => (
              <button
                key={driver.driverId}
                type="button"
                onClick={() =>
                  setDriverFilter((prev) =>
                    prev === driver.driverId ? null : driver.driverId
                  )
                }
                className={`text-left bg-card border rounded-2xl p-4 transition ${
                  driverFilter === driver.driverId
                    ? "border-primary bg-sidebar-accent"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {driver.driverName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{driver.driverName}</p>
                    <p className="text-xs text-muted-foreground">{driver.reviewCount} review{driver.reviewCount === 1 ? "" : "s"}</p>
                  </div>
                  <p className="text-lg font-bold text-accent shrink-0">★ {driver.avgRating}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => {
            setFilterRating(null);
            setDriverFilter(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterRating === null && driverFilter === null
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-foreground hover:bg-muted"
          }`}
        >
          All Ratings
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterRating === rating
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-muted"
            }`}
          >
            ★ {rating} ({driverReviews.filter((r) => r.rating === rating).length})
          </button>
        ))}
        {driverFilter && (
          <span className="text-xs text-muted-foreground ml-2">
            Filtered by driver —{" "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() => setDriverFilter(null)}
            >
              clear
            </button>
          </span>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">All Trip Ratings</h2>
        {filteredReviews.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground">No driver ratings yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Customers can rate drivers from their Trip History after a completed ride
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span>
                        <span className="text-muted-foreground">Customer: </span>
                        <span className="font-semibold text-foreground">{review.customerName}</span>
                      </span>
                      <span>
                        <span className="text-muted-foreground">Driver: </span>
                        <span className="font-semibold text-foreground">{review.driverName}</span>
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      <span className="text-muted-foreground">Ride: </span>
                      {review.pickup} → {review.dropoff}
                    </p>
                    <p className="text-xs text-muted-foreground">Booking {review.bookingId}</p>
                    <StarDisplay rating={review.rating} />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
