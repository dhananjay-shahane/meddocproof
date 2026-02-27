"use client";

import { useCallback } from "react";
import { useAdminReviews } from "@/hooks/use-admin-reviews";
import { ReviewList } from "@/components/admin/reviews/review-list";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const {
    reviews,
    stats,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    setPage,
    approveReview,
    rejectReview,
    deleteReview,
  } = useAdminReviews();

  const handleApprove = useCallback(
    async (id: string) => {
      const success = await approveReview(id);
      if (success) toast.success("Review approved");
      else toast.error("Failed to approve review");
    },
    [approveReview]
  );

  const handleReject = useCallback(
    async (id: string) => {
      const success = await rejectReview(id);
      if (success) toast.success("Review hidden");
      else toast.error("Failed to update review");
    },
    [rejectReview]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const success = await deleteReview(id);
      if (success) toast.success("Review deleted");
      else toast.error("Failed to delete review");
    },
    [deleteReview]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
        <p className="text-muted-foreground">
          Moderate user reviews that appear on the public homepage.
        </p>
      </div>

      <ReviewList
        reviews={reviews}
        loading={loading}
        error={error}
        filters={filters}
        onFilterChange={setFilters}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        stats={stats}
      />
    </div>
  );
}
