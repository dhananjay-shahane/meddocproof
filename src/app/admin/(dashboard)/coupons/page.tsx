"use client";

import { useState, useCallback } from "react";
import { useCoupons } from "@/hooks/use-coupons";
import { CouponStats } from "@/components/admin/coupons/coupon-stats";
import { CouponFilters } from "@/components/admin/coupons/coupon-filters";
import { CouponTable } from "@/components/admin/coupons/coupon-table";
import { CouponFormDialog } from "@/components/admin/coupons/coupon-form-dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Coupon, CouponFiltersState } from "@/types";

const defaultFilters: CouponFiltersState = {
  search: "",
  filter: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CouponFiltersState>(defaultFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  const { data, stats, loading, createCoupon, updateCoupon, deleteCoupon } = useCoupons({
    filters,
    page,
  });

  const handleFilterChange = useCallback((partial: Partial<CouponFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

  const handleEdit = useCallback((coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData: Record<string, unknown>) => {
      if (editingCoupon) {
        const success = await updateCoupon(editingCoupon.id, formData);
        if (success) toast.success("Coupon updated successfully");
        else toast.error("Failed to update coupon");
        return success;
      } else {
        const success = await createCoupon(formData);
        if (success) toast.success("Coupon created successfully");
        else toast.error("Failed to create coupon");
        return success;
      }
    },
    [editingCoupon, createCoupon, updateCoupon]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingCoupon) return;
    const success = await deleteCoupon(deletingCoupon.id);
    if (success) toast.success("Coupon deleted");
    else toast.error("Failed to delete coupon");
    setDeletingCoupon(null);
  }, [deletingCoupon, deleteCoupon]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground">Create and manage discount coupons.</p>
        </div>
        <Button
          onClick={() => {
            setEditingCoupon(null);
            setFormOpen(true);
          }}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      <CouponStats stats={stats} loading={loading} />

      <CouponFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <CouponTable
        data={data}
        loading={loading}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={setDeletingCoupon}
      />

      <CouponFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingCoupon(null);
        }}
        coupon={editingCoupon}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog
        open={!!deletingCoupon}
        onOpenChange={(open) => !open && setDeletingCoupon(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete coupon &quot;{deletingCoupon?.code}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
