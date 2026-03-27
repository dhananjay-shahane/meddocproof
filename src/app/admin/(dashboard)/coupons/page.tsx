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
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Coupon, CouponFiltersState } from "@/types";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `DISC-${suffix}`;
}

const defaultFilters: CouponFiltersState = {
  search: "",
  filter: "all",
  type: "all",
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
  const [couponType, setCouponType] = useState("general");
  const [code, setCode] = useState(() => generateCode());
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [validityDays, setValidityDays] = useState("30");
  const [applicableFor, setApplicableFor] = useState("all");

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (couponType === "specific" && !phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }
    const val = parseFloat(discountValue);
    if (!val || val <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }
    if (discountType === "percentage" && val > 100) {
      toast.error("Percentage must be 100 or less");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(validityDays));

    const success = await onSubmit({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: val,
      maxUses: couponType === "specific" ? 1 : 100,
      maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
      expiresAt: expiresAt.toISOString(),
      applicableFor,
      couponType,
      phoneNumber: couponType === "specific" ? phoneNumber : null,
      isActive: true,
    });

    if (success) {
      setCode(generateCode());
      setDiscountType("percentage");
      setDiscountValue("10");
      setPhoneNumber("");
      setMaxDiscountAmount("");
      setValidityDays("30");
      setApplicableFor("all");
      setCouponType("general");
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
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SAVE20"
                className="flex-1 h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setCode(generateCode())}
                className="px-3 h-11 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
              >
                Generate
              </button>
            </div>
          </div>

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
                <option value="general">General (All Users)</option>
                <option value="specific">Specific Phone Number</option>
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

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Discount Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDiscountType("percentage")}
                className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                  discountType === "percentage"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setDiscountType("fixed")}
                className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                  discountType === "fixed"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Fixed (₹)
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {discountType === "percentage" ? "Discount Percentage (%)" : "Discount Amount (₹)"}
            </label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percentage" ? "10" : "200"}
              min="1"
              max={discountType === "percentage" ? "100" : undefined}
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Max Discount Amount (percentage only) */}
          {discountType === "percentage" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Max Discount Amount (₹){" "}
                <span className="text-gray-400 font-normal">— Optional cap</span>
              </label>
              <input
                type="number"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(e.target.value)}
                placeholder="e.g. 500"
                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

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
            {couponType === "specific" ? (
              <>
                <p>• WhatsApp notification will be sent to the phone number</p>
                <p>• One-time use per phone number</p>
              </>
            ) : (
              <p>• Coupon can be used by any user up to the max usage limit</p>
            )}
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

// ── EDIT COUPON MODAL ───────────────────────────────────────
function EditCouponModal({
  coupon,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  coupon: Coupon;
  onClose: () => void;
  onSubmit: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  isSubmitting: boolean;
}) {
  const [code, setCode] = useState(coupon.code);
  const [discountType, setDiscountType] = useState(coupon.discountType);
  const [discountValue, setDiscountValue] = useState(String(coupon.discountValue));
  const [maxUses, setMaxUses] = useState(String(coupon.maxUses));
  const [isActive, setIsActive] = useState(coupon.isActive);
  const [expiresAt, setExpiresAt] = useState(
    coupon.expiresAt ? format(new Date(coupon.expiresAt), "yyyy-MM-dd") : ""
  );

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error("Coupon code is required"); return; }
    const val = parseFloat(discountValue);
    if (!val || val <= 0) { toast.error("Discount value must be greater than 0"); return; }
    if (discountType === "percentage" && val > 100) { toast.error("Percentage must be 100 or less"); return; }

    const success = await onSubmit(coupon.id, {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: val,
      maxUses: parseInt(maxUses) || 0,
      isActive,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Coupon</h2>
          <p className="text-sm text-gray-500 mt-1">
            Updating <span className="font-mono font-bold text-blue-600">{coupon.code}</span>
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type</label>
            <div className="flex gap-2">
              {(["percentage", "fixed"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDiscountType(t)}
                  className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                    discountType === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t === "percentage" ? "Percentage (%)" : "Fixed (₹)"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {discountType === "percentage" ? "Discount (%)" : "Discount Amount (₹)"}
            </label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              min="1"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Max Uses <span className="text-gray-400 font-normal">(0 = unlimited)</span>
            </label>
            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              min="0"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Expiry Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700">Active</label>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition-colors ${isActive ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${isActive ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── VIEW DETAILS MODAL ──────────────────────────────────────
function ViewDetailsModal({ coupon, onClose }: { coupon: Coupon; onClose: () => void }) {
  const expired = isExpired(coupon.expiresAt);
  const isUsedUp = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
  const isActive = coupon.isActive && !expired && !isUsedUp;

  const rows: [string, string][] = [
    ["Code", coupon.code],
    ["Discount Type", coupon.discountType === "percentage" ? "Percentage" : "Fixed Amount"],
    ["Discount", coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`],
    ["Max Uses", coupon.maxUses === 0 ? "Unlimited" : String(coupon.maxUses)],
    ["Used Count", String(coupon.usedCount)],
    ["Remaining", coupon.maxUses === 0 ? "Unlimited" : String(Math.max(0, coupon.maxUses - coupon.usedCount))],
    ["Expires", coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"],
    ["Created", formatDate(coupon.createdAt)],
    ["Status", isActive ? "Active" : expired ? "Expired" : isUsedUp ? "Used Up" : "Inactive"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Tag className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Coupon Details</h2>
        </div>
        <div className="space-y-0">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className={`text-sm font-medium ${label === "Code" ? "font-mono text-blue-600" : "text-gray-900"}`}>{value}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-5 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Close
        </button>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CouponFiltersState>(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [viewingCoupon, setViewingCoupon] = useState<Coupon | null>(null);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);

  const { data, loading, createCoupon, updateCoupon, deleteCoupon, refetch } = useCoupons({
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

  const handleTypeFilterChange = (val: string) => {
    setTypeFilter(val);
    setFilters((prev) => ({ ...prev, type: val as CouponFiltersState["type"] }));
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
      toast.success("Coupon created successfully!");
    } else {
      toast.error("Failed to create coupon");
    }
    return success;
  };

  const handleEditCoupon = async (id: string, updateData: Record<string, unknown>) => {
    const success = await updateCoupon(id, updateData);
    if (success) toast.success("Coupon updated");
    else toast.error("Failed to update coupon");
    return success;
  };

  const handleDeleteCoupon = async (id: string) => {
    const success = await deleteCoupon(id);
    setDeletingCouponId(null);
    if (success) toast.success("Coupon deleted");
    else toast.error("Failed to delete coupon");
  };

  const handleDeactivate = async (coupon: Coupon) => {
    const success = await updateCoupon(coupon.id, { isActive: false });
    if (success) toast.success(`${coupon.code} deactivated`);
    else toast.error("Failed to deactivate coupon");
  };

  const handleActivate = async (coupon: Coupon) => {
    const success = await updateCoupon(coupon.id, { isActive: true });
    if (success) toast.success(`${coupon.code} activated`);
    else toast.error("Failed to activate coupon");
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-500">
            Manage general coupons and payment reminders ({totalCoupons} total)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {/* Search Input */}
          <div className="flex-1 sm:min-w-[180px] relative">
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Delete confirmation banner */}
      {deletingCouponId && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-red-700 font-medium">
            Are you sure you want to delete this coupon? This cannot be undone.
          </p>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <button
              onClick={() => setDeletingCouponId(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteCoupon(deletingCouponId)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}

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
            const isUsedUp = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
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
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm">
                  {coupon.expiresAt && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Expires: {formatDate(coupon.expiresAt)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>
                      Used: {coupon.usedCount} / {coupon.maxUses === 0 ? "∞" : coupon.maxUses}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {coupon.maxUses === 0 || coupon.usedCount < coupon.maxUses ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">
                          {coupon.maxUses === 0 ? "Unlimited uses" : `${coupon.maxUses - coupon.usedCount} remaining`}
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Created on{" "}
                    <span className="text-gray-700 font-medium">
                      {formatDate(coupon.createdAt)}
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
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
                    <button
                      onClick={() => setEditingCoupon(coupon)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setViewingCoupon(coupon)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => setDeletingCouponId(coupon.id)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
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

      {/* Modals */}
      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCoupon}
        isSubmitting={isSubmitting}
      />
      {editingCoupon && (
        <EditCouponModal
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSubmit={handleEditCoupon}
          isSubmitting={isSubmitting}
        />
      )}
      {viewingCoupon && (
        <ViewDetailsModal
          coupon={viewingCoupon}
          onClose={() => setViewingCoupon(null)}
        />
      )}
    </div>
  );
}
