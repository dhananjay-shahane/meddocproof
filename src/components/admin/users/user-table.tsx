"use client";

import { formatRelativeDate, formatCurrency, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { UserSearch, MessageCircle } from "lucide-react";
import type { UserListItem, PaginatedResponse } from "@/types";

interface UserTableProps {
  data: PaginatedResponse<UserListItem> | null;
  loading: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onPageChange: (page: number) => void;
  onBulkWhatsApp: () => void;
}

export function UserTable({
  data,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onPageChange,
  onBulkWhatsApp,
}: UserTableProps) {
  if (loading) return <PageLoader />;

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={UserSearch}
        title="No users found"
        description="Try adjusting your filters or search query."
      />
    );
  }

  const allSelected =
    data.items.length > 0 && data.items.every((u) => selectedIds.has(u.id));
  const someSelected = data.items.some((u) => selectedIds.has(u.id));

  return (
    <div>
      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2.5">
          <span className="text-sm font-medium">
            {selectedIds.size} user{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <Button size="sm" onClick={onBulkWhatsApp} className="gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            Send WhatsApp
          </Button>
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={onToggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Applications
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Certificates
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={() => onToggleSelect(user.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        fallback={getInitials(user.fullName)}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium">{user.fullName}</p>
                          {user.hasPaidOrder && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">
                              Paid
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {user.phoneNumber}
                          {user.email && ` · ${user.email}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        user.status === "active"
                          ? "default"
                          : user.status === "blocked"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">{user.applicationCount}</td>
                  <td className="px-4 py-3 font-medium">{user.certificateCount}</td>
                  <td className="px-4 py-3 font-medium">
                    {user.totalSpent > 0
                      ? formatCurrency(user.totalSpent)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.lastApplicationAt
                      ? formatRelativeDate(user.lastApplicationAt)
                      : user.lastLoginAt
                        ? formatRelativeDate(user.lastLoginAt)
                        : "Never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
          className="mt-4"
        />
      )}
    </div>
  );
}
