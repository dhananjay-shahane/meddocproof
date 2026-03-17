"use client";

import { formatRelativeDate, formatCurrency, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { UserSearch, Eye, Phone, CheckCircle } from "lucide-react";
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
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
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
                  Contact
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
                  Last Activity
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Actions
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
                        className="bg-blue-100 text-blue-600"
                      />
                      <span className="font-medium">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{user.phoneNumber}</span>
                      </div>
                      {user.email && (
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={
                        user.status === "active"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : user.status === "blocked"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-gray-200 bg-gray-50 text-gray-700"
                      }
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">{user.applicationCount}</td>
                  <td className="px-4 py-3 text-center">{user.certificateCount}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(user.totalSpent || 0)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.lastApplicationAt
                      ? formatRelativeDate(user.lastApplicationAt)
                      : user.lastLoginAt
                        ? `Joined ${formatRelativeDate(user.lastLoginAt)}`
                        : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
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
