"use client";

import { formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ticket, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import type { Coupon, PaginatedResponse } from "@/types";

interface CouponTableProps {
  data: PaginatedResponse<Coupon> | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

function isExpired(coupon: Coupon): boolean {
  if (!coupon.isActive) return true;
  if (coupon.expiresAt && new Date(coupon.expiresAt) <= new Date()) return true;
  return false;
}

export function CouponTable({
  data,
  loading,
  onPageChange,
  onEdit,
  onDelete,
}: CouponTableProps) {
  if (loading) return <PageLoader />;

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title="No coupons found"
        description="Create your first coupon to get started."
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Discount</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usage</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Expires</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((coupon) => {
              const expired = isExpired(coupon);
              return (
                <tr key={coupon.id} className="border-b transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm font-semibold">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy code"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      {coupon.discountType === "percentage" ? "off" : "flat"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span>
                      {coupon.usedCount}
                      {coupon.maxUses > 0 && (
                        <span className="text-muted-foreground">/{coupon.maxUses}</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={expired ? "destructive" : "default"}>
                      {expired ? "Expired" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coupon.expiresAt
                      ? formatRelativeDate(coupon.expiresAt)
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatRelativeDate(coupon.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(coupon)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(coupon)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
