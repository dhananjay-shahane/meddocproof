"use client";

import { useState } from "react";
import { useCoupons } from "@/hooks/use-coupons";
import {
  Plus,
  RefreshCw,
  Search,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Percent,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Coupon, CouponFiltersState } from "@/types";

const defaultFilters: CouponFiltersState = {
  search: "",
  filter: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const formatDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "MMM d, yyyy, h:mm a");
  } catch {
    return dateStr;
  }
};

const isExpired = (expiresAt: string | null | undefined): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

// Create Coupon Modal Component
function CreateCouponModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<boolean>;
  isSubmitting: boolean;
}) {
  const [couponType, setCouponType] = useState("specific");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("10");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("500");
  const [validityDays, setValidityDays] = useState("30");
  const [applicableFor, setApplicableFor] = useState("all");

  const handleSubmit = async () => {
    if (couponType === "specific" && !phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(validityDays));

    const success = await onSubmit({
      discountType: "percentage",
      discountValue: parseInt(discountPercentage),
      maxUses: couponType === "specific" ? 1 : 100,
      maxDiscountAmount: maxDiscountAmount ? parseInt(maxDiscountAmount) : null,
      expiresAt: expiresAt.toISOString(),
      applicableFor,
      phoneNumber: couponType === "specific" ? phoneNumber : null,
      isActive: true,
    });

    if (success) {
      // Reset form
      setPhoneNumber("");
      setDiscountPercentage("10");
      setMaxDiscountAmount("500");
      setValidityDays("30");
      setApplicableFor("all");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create Coupon</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a coupon for specific users or applicable to all users.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Coupon Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Coupon Type
            </label>
            <div className="relative">
              <select
                value={couponType}
                onChange={(e) => setCouponType(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="specific">For Specific Phone Number</option>
                <option value="general">General (For All Users)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Phone Number - only show for specific type */}
          {couponType === "specific" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Discount Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Discount Percentage (%)
            </label>
            <input
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="10"
              min="1"
              max="100"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Max Discount Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Max Discount Amount (₹) - Optional
            </label>
            <input
              type="number"
              value={maxDiscountAmount}
              onChange={(e) => setMaxDiscountAmount(e.target.value)}
              placeholder="500"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Validity Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Validity (Days)
            </label>
            <input
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
              placeholder="30"
              min="1"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Applicable For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Applicable For
            </label>
            <div className="relative">
              <select
                value={applicableFor}
                onChange={(e) => setApplicableFor(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Services (Certificates + Consultations)</option>
                <option value="certificates">Medical Certificates Only</option>
                <option value="consultations">Video Consultations Only</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Notes */}
          <div className="pt-2 text-xs text-gray-500 space-y-1">
            <p>• WhatsApp notification will be sent to the phone number</p>
            <p>• Coupon can be used for both certificates and consultations</p>
            <p>• One-time use per phone number</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create & Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CouponFiltersState>(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, stats, loading, createCoupon, updateCoupon, refetch } = useCoupons({
    filters,
    page,
  });

  const coupons = data?.items || [];
  const totalCoupons = data?.total || 0;
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput }));
    setPage(1);
  };

  const handleFilterChange = (filterValue: CouponFiltersState["filter"]) => {
    setStatusFilter(filterValue);
    setFilters((prev) => ({ ...prev, filter: filterValue }));
    setPage(1);
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success("Coupons refreshed");
  };

  const handleCreateCoupon = async (formData: Record<string, unknown>) => {
    setIsSubmitting(true);
    const success = await createCoupon(formData);
    setIsSubmitting(false);
    if (success) {
      toast.success("Coupon created and WhatsApp notification sent!");
    } else {
      toast.error("Failed to create coupon");
    }
    return success;
  };

  const handleDeactivate = async (coupon: Coupon) => {
    const success = await updateCoupon(coupon.id, { isActive: false });
    if (success) {
      toast.success(`Coupon ${coupon.code} deactivated`);
    } else {
      toast.error("Failed to deactivate coupon");
    }
  };

  const handleActivate = async (coupon: Coupon) => {
    const success = await updateCoupon(coupon.id, { isActive: true });
    if (success) {
      toast.success(`Coupon ${coupon.code} activated`);
    } else {
      toast.error("Failed to activate coupon");
    }
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-500">
            Manage general coupons and payment reminders ({totalCoupons} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Coupon
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by coupon code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              className="h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="all"
            >
              <option value="all">Type: All</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value as CouponFiltersState["filter"])}
              className="h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="h-11 px-6 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Search
          </button>
        </div>
      </div>

      {/* Coupon Cards */}
      <div className="space-y-4">
        {coupons.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No coupons found</p>
          </div>
        ) : (
          coupons.map((coupon: Coupon) => {
            const expired = isExpired(coupon.expiresAt);
            const isUsedUp = coupon.usedCount >= coupon.maxUses;
            const isActive = coupon.isActive && !expired && !isUsedUp;

            return (
              <div
                key={coupon.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Tag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {coupon.code}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% discount`
                          : `₹${coupon.discountValue} off`}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200 capitalize">
                      {coupon.discountType}
                    </span>
                    {isActive ? (
                      <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full border border-green-200">
                        Active
                      </span>
                    ) : expired ? (
                      <span className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-full border border-red-200">
                        Expired
                      </span>
                    ) : isUsedUp ? (
                      <span className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full border border-orange-200">
                        Used Up
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Row */}
                <div className="flex items-center gap-8 mb-4 text-sm">
                  {coupon.expiresAt && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Expires: {formatDate(coupon.expiresAt)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>
                      Used: {coupon.usedCount} / {coupon.maxUses}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {coupon.usedCount < coupon.maxUses ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">
                          {coupon.maxUses - coupon.usedCount} remaining
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Fully used</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Percent className="h-4 w-4 text-gray-400" />
                    <span>
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </span>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Created on{" "}
                    <span className="text-gray-700 font-medium">
                      {formatDate(coupon.createdAt)}
                    </span>
                  </p>

                  <div className="flex items-center gap-3">
                    {coupon.isActive && !expired ? (
                      <button
                        onClick={() => handleDeactivate(coupon)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                        Deactivate
                      </button>
                    ) : !expired ? (
                      <button
                        onClick={() => handleActivate(coupon)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Activate
                      </button>
                    ) : null}
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalCoupons > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * (data?.limit || 20) + 1}–
            {Math.min(page * (data?.limit || 20), totalCoupons)} of {totalCoupons}{" "}
            coupons
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    page === pageNum
                      ? "font-medium text-white bg-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && page < totalPages - 2 && (
              <>
                <span className="text-gray-500">...</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCoupon}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
