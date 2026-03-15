"use client";

import { useState, useCallback } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  RefreshCw,
  Download,
  Check,
  X,
} from "lucide-react";
import { formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

// Mock data
const mockWithdrawals = [
  {
    id: "WD174835968199",
    doctorId: "doc-1",
    doctorName: "Dr. Amit Kumar",
    amount: 100,
    walletBalance: 0,
    status: "approved",
    requestedAt: "2025-06-08T10:49:09Z",
    processedAt: "2025-06-10T00:00:00Z",
  },
];

interface Withdrawal {
  id: string;
  doctorId: string;
  doctorName: string;
  amount: number;
  walletBalance: number;
  status: string;
  requestedAt: string;
  processedAt: string | null;
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processDialog, setProcessDialog] = useState<{
    open: boolean;
    withdrawal: Withdrawal | null;
    action: "approve" | "reject" | null;
  }>({ open: false, withdrawal: null, action: null });
  const [remarks, setRemarks] = useState("");

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (statusFilter !== "all" && w.status !== statusFilter) return false;
    return true;
  });

  // Calculate stats
  const totalRequests = withdrawals.length;
  const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const pendingAmount = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);
  const approvedAmount = withdrawals
    .filter((w) => w.status === "approved" || w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredWithdrawals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredWithdrawals.map((w) => w.id));
    }
  };

  const handleProcess = useCallback(
    async (action: "approve" | "reject") => {
      if (!processDialog.withdrawal) return;

      try {
        setWithdrawals((prev) =>
          prev.map((w) =>
            w.id === processDialog.withdrawal!.id
              ? {
                  ...w,
                  status: action === "approve" ? "approved" : "rejected",
                  processedAt: new Date().toISOString(),
                }
              : w
          )
        );

        toast.success(
          `Withdrawal ${action === "approve" ? "approved" : "rejected"} successfully`
        );
        setProcessDialog({ open: false, withdrawal: null, action: null });
        setRemarks("");
      } catch {
        toast.error("Failed to process withdrawal");
      }
    },
    [processDialog.withdrawal]
  );

  const getStatusBadge = (status: string) => {
    if (status === "approved" || status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          <CheckCircle className="h-3 w-3" />
          Approved
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
          <X className="h-3 w-3" />
          Rejected
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Withdrawal Management
          </h1>
          <p className="text-sm text-slate-500">
            Review and process doctor withdrawal requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Requests */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Requests</p>
            <DollarSign className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalRequests}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Pending</p>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(pendingAmount)}
          </p>
        </div>

        {/* Approved */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Approved</p>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(approvedAmount)}
          </p>
        </div>

        {/* Selected */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Selected</p>
            <FileText className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {selectedIds.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">Ready for processing</p>
        </div>
      </div>

      {/* Filter */}
      <div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Withdrawals Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/50">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredWithdrawals.length &&
                      filteredWithdrawals.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Wallet Balance
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Requested
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((w) => (
                  <tr
                    key={w.id}
                    className="border-b last:border-0 hover:bg-slate-50/50"
                  >
                    {/* Checkbox */}
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(w.id)}
                        onChange={() => toggleSelect(w.id)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </td>

                    {/* Doctor */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">
                        {w.doctorName}
                      </p>
                      <p className="text-xs text-slate-400">ID: {w.id}</p>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">
                        {formatCurrency(w.amount)}
                      </p>
                    </td>

                    {/* Wallet Balance */}
                    <td className="px-4 py-4">
                      <p className="text-slate-500">Total:</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">{getStatusBadge(w.status)}</td>

                    {/* Requested */}
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-900">
                        {formatDate(w.requestedAt, "M/d/yyyy")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(w.requestedAt, "h:mm:ss a")}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      {w.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-green-600 hover:bg-green-50"
                            onClick={() =>
                              setProcessDialog({
                                open: true,
                                withdrawal: w,
                                action: "approve",
                              })
                            }
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-red-600 hover:bg-red-50"
                            onClick={() =>
                              setProcessDialog({
                                open: true,
                                withdrawal: w,
                                action: "reject",
                              })
                            }
                          >
                            <X className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      ) : w.processedAt ? (
                        <p className="text-sm text-slate-500">
                          {formatDate(w.processedAt, "M/d/yyyy")}
                        </p>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Dialog */}
      <Dialog
        open={processDialog.open}
        onOpenChange={(open) =>
          !open && setProcessDialog({ open: false, withdrawal: null, action: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {processDialog.action === "approve" ? "Approve" : "Reject"} Withdrawal
            </DialogTitle>
            <DialogDescription>
              {processDialog.action === "approve"
                ? "Confirm approval of this withdrawal request."
                : "Please provide a reason for rejection."}
            </DialogDescription>
          </DialogHeader>
          {processDialog.withdrawal && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Doctor</span>
                  <span className="font-medium">
                    {processDialog.withdrawal.doctorName}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-slate-500">Amount</span>
                  <span className="font-medium">
                    {formatCurrency(processDialog.withdrawal.amount)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-slate-500">Request ID</span>
                  <span className="font-medium">{processDialog.withdrawal.id}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Remarks (optional)</label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any notes..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setProcessDialog({ open: false, withdrawal: null, action: null })
              }
            >
              Cancel
            </Button>
            <Button
              variant={processDialog.action === "approve" ? "default" : "destructive"}
              onClick={() =>
                processDialog.action && handleProcess(processDialog.action)
              }
            >
              {processDialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
