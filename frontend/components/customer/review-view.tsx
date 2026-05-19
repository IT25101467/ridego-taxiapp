"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { Review } from "@/lib/mock-data";

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
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

function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export default function ReviewView() {
  const { currentUser, reviews, trips, drivers, addReview } = useApp();
  const [selectedTripId, setSelectedTripId] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [driverFilter, setDriverFilter] = useState("all");

  const reviewableTrips = useMemo(
    () =>
      trips.filter(
        (t) =>
          t.customerId === currentUser?.id &&
          t.status === "COMPLETED" &&
          t.driverId
      ),
    [trips, currentUser?.id]
  );

  const selectedTrip = reviewableTrips.find((t) => t.id === selectedTripId);

  const myReviews = reviews.filter((r) => r.customerId === currentUser?.id);

  const driverReviews = useMemo(() => {
    const withDriver = reviews.filter((r) => r.driverId);
    if (driverFilter === "all") return withDriver;
    return withDriver.filter((r) => r.driverId === driverFilter);
  }, [reviews, driverFilter]);

  const driversWithReviews = useMemo(() => {
    const ids = new Set(reviews.filter((r) => r.driverId).map((r) => r.driverId));
    return drivers.filter((d) => ids.has(d.id));
  }, [reviews, drivers]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || !currentUser || !selectedTrip?.driverId) return;

    const review: Review = {
      id: "r" + Date.now(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      driverId: selectedTrip.driverId,
      driverName: selectedTrip.driverName || "Driver",
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    await new Promise((r) => setTimeout(r, 500));
    addReview(review);
    setSubmitted(true);
    setRating(0);
    setComment("");
    setSelectedTripId("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Driver Reviews</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Rate your driver after a trip and browse reviews from other customers
        </p>
      </div>

      {/* Driver ratings overview */}
      {driversWithReviews.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {driversWithReviews.map((driver) => {
            const driverRev = reviews.filter((r) => r.driverId === driver.id);
            const avg = averageRating(driverRev);
            return (
              <button
                key={driver.id}
                type="button"
                onClick={() => setDriverFilter(driver.id)}
                className={`text-left bg-card border rounded-2xl p-4 transition hover:border-primary/40 ${
                  driverFilter === driver.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <p className="font-semibold text-foreground text-sm">{driver.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <StarDisplay rating={Math.round(avg)} size={14} />
                  <span className="text-sm font-medium text-foreground">{avg.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({driverRev.length} review{driverRev.length !== 1 ? "s" : ""})
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Review form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">Rate Your Driver</h3>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-semibold text-foreground">Thank you for your review!</p>
              <p className="text-sm text-muted-foreground mt-1">Other customers can now see your feedback.</p>
            </div>
          ) : reviewableTrips.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Complete a trip with a driver before leaving a review. Check Trip History after your ride.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select trip</label>
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Choose a completed ride…</option>
                  {reviewableTrips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.driverName} — {trip.pickup} → {trip.dropoff}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTrip && (
                <div className="rounded-xl bg-muted/50 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Driver: </span>
                  <span className="font-medium text-foreground">{selectedTrip.driverName}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill={(hovered || rating) >= star ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={(hovered || rating) >= star ? "text-accent" : "text-border"}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was your driver?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0 || !selectedTripId}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit driver review
              </button>
            </form>
          )}
        </div>

        {/* Your reviews */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Your reviews</h3>
          {myReviews.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-sm text-muted-foreground">You have not reviewed a driver yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReviews.map((review) => (
                <ReviewCard key={review.id} review={review} showCustomer={false} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All driver reviews — visible to customers */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold text-foreground">All driver reviews</h3>
          <select
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
          >
            <option value="all">All drivers</option>
            {driversWithReviews.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {driverReviews.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground">No driver reviews yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {driverReviews.map((review) => (
              <ReviewCard key={review.id} review={review} showCustomer />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  showCustomer,
}: {
  review: Review;
  showCustomer: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          {review.driverName && (
            <p className="text-sm font-semibold text-foreground">{review.driverName}</p>
          )}
          {showCustomer && review.customerName && (
            <p className="text-xs text-muted-foreground mt-0.5">by {review.customerName}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{review.date}</span>
      </div>
      <StarDisplay rating={review.rating} />
      <p className="text-sm text-foreground leading-relaxed mt-2">
        {review.comment || "No comment provided."}
      </p>
    </div>
  );
}
