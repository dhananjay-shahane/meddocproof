"use client";

import { useRouter } from "next/navigation";
import { useDoctorApplications } from "@/hooks/use-doctor-applications";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  pending_review: "bg-yellow-100 text-yellow-800",
  pending_doctor_review: "bg-orange-100 text-orange-800",
  assigned: "bg-indigo-100 text-indigo-800",
  doctor_assigned: "bg-indigo-100 text-indigo-800",
  under_review: "bg-purple-100 text-purple-800",
  processing: "bg-purple-100 text-purple-800",
  consultation_scheduled: "bg-cyan-100 text-cyan-800",
  consultation_completed: "bg-teal-100 text-teal-800",
  completed: "bg-green-100 text-green-800",
  delivered: "bg-green-100 text-green-800",
  certificate_delivered: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const certTypeLabels: Record<string, string> = {
  sick_leave: "Sick Leave",
  fitness: "Fitness",
  work_from_home: "Work From Home",
  caretaker: "Caretaker",
  recovery: "Recovery",
  fit_to_fly: "Fit-to-Fly",
  unfit_to_work: "Unfit To Work",
  unfit_to_travel: "Unfit To Travel",
  medical_diagnosis: "Medical Diagnosis",
};

export default function DoctorApplicationsPage() {
  const router = useRouter();
  const { data, loading, error, filters, setFilters, page, setPage, refetch } =
    useDoctorApplications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            My Applications
          </h2>
          <p className="text-muted-foreground">
            View and manage your assigned applications.
          </p>
        </div>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, patient name, or phone..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full rounded-lg border bg-background py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="assigned">Assigned</option>
          <option value="under_review">Under Review</option>
          <option value="consultation_scheduled">Consultation Scheduled</option>
          <option value="consultation_completed">Consultation Completed</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filters.certificateType}
          onChange={(e) => setFilters({ certificateType: e.target.value })}
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="sick_leave">Sick Leave</option>
          <option value="fitness">Fitness</option>
          <option value="work_from_home">Work From Home</option>
          <option value="caretaker">Caretaker</option>
          <option value="recovery">Recovery</option>
          <option value="fit_to_fly">Fit-to-Fly</option>
          <option value="unfit_to_work">Unfit To Work</option>
          <option value="unfit_to_travel">Unfit To Travel</option>
          <option value="medical_diagnosis">Medical Diagnosis</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border bg-card">
          <FileText className="h-10 w-10 text-muted-foreground opacity-40" />
          <p className="text-sm text-muted-foreground">
            No applications found
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Application ID</th>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Assessment</th>
                    <th className="px-4 py-3 font-medium">Assigned</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {app.applicationDisplayId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{app.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {app.userPhone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {certTypeLabels[app.certificateType] ??
                          app.certificateType}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            statusColors[app.status] ??
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            app.hasMedicalAssessment
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {app.hasMedicalAssessment ? "Done" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {app.assignedAt
                          ? format(new Date(app.assignedAt), "dd MMM yyyy")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/doctor/applications/${app.id}`)
                          }
                          className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * data.limit + 1}–
                {Math.min(page * data.limit, data.total)} of {data.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm">
                  Page {page} of {data.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
