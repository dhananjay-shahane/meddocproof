"use client";

import { Star, Check, X, Trash2, Search, ChevronLeft, ChevronRight, Loader2, MessageSquareText } from "lucide-react";
import { format } from "date-fns";
import type { AdminReview } from "@/hooks/use-admin-reviews";

interface ReviewListProps {
  reviews: AdminReview[];
  loading: boolean;
  error: string | null;
  filters: { filter: "all" | "approved" | "pending"; search: string };
  onFilterChange: (partial: { filter?: "all" | "approved" | "pending"; search?: string }) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  stats: { total: number; approved: number; pending: number } | null;
}

export function ReviewList({
  reviews,
  loading,
  error,
  filters,
  onFilterChange,
  page,
  totalPages,
  total,
  onPageChange,
  onApprove,
  onReject,
  onDelete,
  stats,
}: ReviewListProps) {
  return (
    <div className="space-y-4">
      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border bg-card p-1">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange({ filter: f })}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filters.filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="rounded-lg border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-xl border bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
          <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No Reviews Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {filters.filter === "pending"
              ? "No pending reviews to moderate."
              : "No reviews match the current filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{review.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        review.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.message}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Submitted: {format(new Date(review.createdAt), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {!review.approved && (
                    <button
                      onClick={() => onApprove(review.id)}
                      className="rounded-lg border border-green-200 bg-green-50 p-2 text-green-600 hover:bg-green-100"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {review.approved && (
                    <button
                      onClick={() => onReject(review.id)}
                      className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-600 hover:bg-amber-100"
                      title="Hide (unapprove)"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(review.id)}
                    className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} review{total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border p-2 hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border p-2 hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
