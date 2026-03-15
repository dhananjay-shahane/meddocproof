"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Search,
  Filter,
  FileText,
  RefreshCw,
  ArrowLeft,
  MoreHorizontal,
  Eye,
  Receipt,
  UserPlus,
  Send,
  MessageSquare,
  FileEdit,
  FileQuestion,
  XCircle,
  Clock,
  DollarSign,
  User,
} from "lucide-react";
import { useApplications } from "@/hooks/use-applications";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssignDoctorModal } from "@/components/admin/applications/assign-doctor-modal";
import { ApplicationDetailsDialog } from "@/components/admin/applications/application-details-dialog";
import type { Application, ApplicationFiltersState } from "@/types";
import { toast } from "sonner";

const defaultFilters: ApplicationFiltersState = {
  search: "",
  status: "all",
  certificateType: "all",
  dateFrom: "",
  dateTo: "",
};

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "payment_completed", label: "Payment Completed" },
  { value: "doctor_assigned", label: "Doctor Assigned" },
  { value: "consultation_done", label: "Consultation Done" },
  { value: "completed", label: "Completed" },
];

const certTypeOptions = [
  { value: "all", label: "All Certificate Types" },
  { value: "sick_leave", label: "Sick Leave" },
  { value: "fitness", label: "Fitness" },
  { value: "work_from_home", label: "Work From Home" },
  { value: "caretaker", label: "Caretaker" },
  { value: "recovery", label: "Recovery" },
];

export default function CompletedApplicationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ApplicationFiltersState>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const { data, loading, refetch } = useApplications({
    tab: "completed",
    filters,
    page,
  });

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setPage(1);
  };

  const handleFilterChange = useCallback(
    (key: keyof ApplicationFiltersState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    []
  );

  const handleViewDetails = (appId: string) => {
    setSelectedAppId(appId);
    setDetailsModalOpen(true);
  };

  const handleAssignDoctor = (app: Application) => {
    setSelectedApp(app);
    setAssignModalOpen(true);
  };

  const handleInvoice = (app: Application) => {
    toast.info("Invoice generation coming soon");
  };

  const getStatusBadge = (app: Application) => {
    if (app.status === "completed") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Payment Completed
        </span>
      );
    }
    if (app.assignedDoctorId && app.consultationCompleted) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Consultation Done
        </span>
      );
    }
    if (app.assignedDoctorId) {
      return (
        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
          Doctor Assigned
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        Payment Completed
      </span>
    );
  };

  const getProgressPercentage = (app: Application): number => {
    // Calculate based on status
    if (app.status === "completed") return 100;
    if (app.consultationCompleted) return 75;
    if (app.assignedDoctorId) return 50;
    if (app.paymentCompleted) return 25;
    return 0;
  };

  const formatAmount = (app: Application): string => {
    const payment = app.payments?.[0];
    if (payment?.amount) {
      return `₹${payment.amount.toFixed(2)}`;
    }
    return "₹699.00";
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy, hh:mm a");
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Completed Applications</h2>
          <p className="text-muted-foreground">
            Manage paid applications and doctor assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/applications">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Applications
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or application ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <select
            value={filters.certificateType}
            onChange={(e) => handleFilterChange("certificateType", e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {certTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {data?.total || 0} applications found
        </p>
      </div>

      {/* Application Cards */}
      {loading ? (
        <PageLoader />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No completed applications found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="space-y-4">
          {data.items.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-base">
                      {app.user?.fullName || "Unknown"}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {app.certificateType.replace(/_/g, "-")}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600">
                    {app.user?.email || "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {app.user?.phoneNumber || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(app)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(app.id)}
                  >
                    <Eye className="mr-1.5 h-4 w-4" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInvoice(app)}
                  >
                    <Receipt className="mr-1.5 h-4 w-4" />
                    Invoice
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => handleAssignDoctor(app)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign Doctor
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Send Consultation Reminder
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <div>
                          <span>WhatsApp Update</span>
                          <p className="text-xs text-muted-foreground">
                            Includes invoice link
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Add Remark
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Request Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Application
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {formatAmount(app)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDateTime(app.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-mono">
                    {app.certificateNumber || app.applicationId}
                  </span>
                </div>
                {app.assignedDoctor && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Dr. {app.assignedDoctor.fullName}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${getProgressPercentage(app)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {getProgressPercentage(app)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Doctor Modal */}
      <AssignDoctorModal
        open={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedApp(null);
        }}
        application={selectedApp}
        onSuccess={() => {
          refetch();
          setAssignModalOpen(false);
          setSelectedApp(null);
        }}
      />

      {/* Application Details Modal */}
      <ApplicationDetailsDialog
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedAppId(null);
        }}
        applicationId={selectedAppId}
        onAssignDoctor={(app) => {
          setSelectedApp(app);
          setAssignModalOpen(true);
        }}
      />
    </div>
  );
}
