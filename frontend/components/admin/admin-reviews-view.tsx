"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";

export default function AdminReviewsView() {
  const { reviews, customers, updateReview, deleteReview } = useApp();
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const startEditReview = (reviewId: string, rating: number, comment: string) => {
    setEditingReviewId(reviewId);
    setEditRating(rating);
    setEditComment(comment);
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment("");
  };

  const saveReview = async () => {
    if (!editingReviewId) return;
    await updateReview(editingReviewId, { rating: editRating, comment: editComment });
    cancelEdit();
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm("Delete this review permanently?");
    if (!confirmed) return;
    await deleteReview(reviewId);
  };

  // Helper function to get customer name by ID
  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || "Anonymous";
  };

  // Filter reviews by rating if selected
  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customer Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and view all customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Total Reviews</p>
          <p className="text-2xl font-bold text-foreground mt-2">{reviews.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Average Rating</p>
          <p className="text-2xl font-bold text-accent mt-2">★ {avgRating}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-bold text-foreground mt-2">{new Set(reviews.map((r) => r.customerId)).size}</p>
        </div>
      </div>

      {/* Filter by rating */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterRating(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterRating === null
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-foreground hover:bg-muted"
          }`}
        >
          All Reviews
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
            ★ {rating} ({reviews.filter((r) => r.rating === rating).length})
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div>
        {filteredReviews.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-foreground">{getCustomerName(review.customerId)}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={review.rating >= star ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className={review.rating >= star ? "text-accent" : "text-border"}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">{review.date}</span>
                      <button
                        onClick={() => startEditReview(review.id, review.rating, review.comment)}
                        className="rounded-full border border-border px-3 py-1 text-foreground transition hover:bg-muted"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="rounded-full border border-destructive text-destructive px-3 py-1 transition hover:bg-destructive/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingReviewId === review.id ? (
                    <div className="space-y-4 rounded-2xl border border-border bg-background p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Edit Review</p>
                        <div className="flex gap-2 flex-wrap">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditRating(star)}
                              className={`h-10 w-10 rounded-2xl border px-0.5 text-lg transition ${
                                editRating >= star ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={saveReview}
                          className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-2xl border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground leading-relaxed">{review.comment || "No comment provided."}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
