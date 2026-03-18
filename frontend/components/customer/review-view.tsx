"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Review } from "@/lib/mock-data";

export default function ReviewView() {
  const { currentUser, reviews, addReview } = useApp();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const myReviews = reviews.filter((r) => r.customerId === currentUser?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || !currentUser) return;
    const review: Review = {
      id: "r" + Date.now(),
      customerId: currentUser.id,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };
    await new Promise((r) => setTimeout(r, 500));
    addReview(review);
    setSubmitted(true);
    setRating(0);
    setComment("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Leave a Review</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Share your experience with RideGo</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Review form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">Rate Your Experience</h3>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-semibold text-foreground">Thank you for your review!</p>
              <p className="text-sm text-muted-foreground mt-1">Your feedback helps us improve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star rating */}
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

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>

        {/* Past reviews */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Your Reviews</h3>
          {myReviews.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-sm text-muted-foreground">No reviews yet. Share your first experience!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="14" height="14" viewBox="0 0 24 24"
                          fill={review.rating >= star ? "currentColor" : "none"}
                          stroke="currentColor" strokeWidth="1.5"
                          className={review.rating >= star ? "text-accent" : "text-border"}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{review.comment || "No comment provided."}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
