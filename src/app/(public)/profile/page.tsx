"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useUserNotifications } from "@/hooks/use-user-notifications";
import {
  User,
  FileText,
  Award,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  LogOut,
  Edit2,
  Check,
  X,
  Bell,
  CheckCheck,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { CERT_TYPE_LABELS } from "@/lib/certificate-types";
import { PdfDownloadButton } from "@/components/shared/pdf-download-button";

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  pending_review: "bg-yellow-100 text-yellow-700",
  assigned: "bg-indigo-100 text-indigo-700",
  doctor_assigned: "bg-indigo-100 text-indigo-700",
  consultation_scheduled: "bg-purple-100 text-purple-700",
  under_review: "bg-orange-100 text-orange-700",
  processing: "bg-orange-100 text-orange-700",
  approved: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  certificate_delivered: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default function UserProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout, user: authUser } = useAuth();
  const { profile, applications, certificates, loading, appPage, appTotalPages, fetchApplications, updateProfile } = useUserProfile();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useUserNotifications();
  const [activeTab, setActiveTab] = useState<"applications" | "certificates">("applications");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close bell dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neubg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || authUser?.type !== "user") {
    router.push("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neubg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditName(profile?.fullName || "");
    setEditEmail(profile?.email || "");
    setEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    await updateProfile({ fullName: editName, email: editEmail });
    setEditingProfile(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {/* Profile Action Bar */}
        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
          <h1 className="text-lg font-bold tracking-tight text-primary">My Profile</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/certificates/apply"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Apply for Certificate
            </Link>

            {/* Notifications Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative rounded-lg border p-2 text-muted-foreground hover:bg-muted"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border bg-card shadow-lg">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <CheckCheck className="h-3 w-3" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            if (!n.isRead) markAsRead(n.id);
                          }}
                          className={`block w-full border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/50 ${
                            !n.isRead ? "bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.isRead && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                {n.message}
                              </p>
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
        {/* Profile Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              {editingProfile ? (
                <div className="space-y-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rounded-lg border px-3 py-1.5 text-sm"
                    placeholder="Full Name"
                  />
                  <input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="rounded-lg border px-3 py-1.5 text-sm"
                    placeholder="Email (optional)"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} className="rounded bg-primary p-1 text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingProfile(false)} className="rounded border p-1">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold">{profile?.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{profile?.phoneNumber}</p>
                  {profile?.email && (
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  )}
                </div>
              )}
            </div>
            {!editingProfile && (
              <button onClick={handleStartEdit} className="rounded-lg border p-2 hover:bg-muted">
                <Edit2 className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <FileText className="mx-auto h-5 w-5 text-blue-500" />
              <p className="mt-1 text-2xl font-bold">{profile?.stats.totalApplications || 0}</p>
              <p className="text-xs text-muted-foreground">Applications</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <Award className="mx-auto h-5 w-5 text-green-500" />
              <p className="mt-1 text-2xl font-bold">{profile?.stats.completedCertificates || 0}</p>
              <p className="text-xs text-muted-foreground">Certificates</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <IndianRupee className="mx-auto h-5 w-5 text-amber-500" />
              <p className="mt-1 text-2xl font-bold">₹{profile?.stats.totalSpent?.toLocaleString() || 0}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <Calendar className="mx-auto h-5 w-5 text-purple-500" />
              <p className="mt-1 text-2xl font-bold">{profile?.stats.totalPayments || 0}</p>
              <p className="text-xs text-muted-foreground">Payments</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border bg-card p-1">
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "applications" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            My Applications ({profile?.stats.totalApplications || 0})
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "certificates" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            My Certificates ({profile?.stats.completedCertificates || 0})
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No Applications Yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Apply for your first medical certificate to get started.
                </p>
                <Link
                  href="/certificates/apply"
                  className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Apply Now
                </Link>
              </div>
            ) : (
              <>
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Application ID</th>
                        <th className="px-4 py-3 text-left font-medium">Type</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Doctor</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b last:border-0 hover:bg-muted/30 cursor-pointer"
                          onClick={() => router.push(`/profile/applications/${app.id}`)}
                        >
                          <td className="px-4 py-3 font-mono text-xs">{app.applicationId}</td>
                          <td className="px-4 py-3">{CERT_TYPE_LABELS[app.certificateType] || app.certificateType}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-700"}`}>
                              {app.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {app.assignedDoctor?.fullName || "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {format(new Date(app.createdAt), "dd MMM yyyy")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {appTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => fetchApplications(appPage - 1)}
                      disabled={appPage <= 1}
                      className="rounded-lg border p-2 hover:bg-muted disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {appPage} of {appTotalPages}
                    </span>
                    <button
                      onClick={() => fetchApplications(appPage + 1)}
                      disabled={appPage >= appTotalPages}
                      className="rounded-lg border p-2 hover:bg-muted disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <div className="space-y-4">
            {certificates.length === 0 ? (
              <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
                <Award className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No Certificates Yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your completed certificates will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {CERT_TYPE_LABELS[cert.certificateType] || cert.certificateType} Certificate
                        </h3>
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {cert.certificateNumber}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Issued
                      </span>
                    </div>

                    {cert.assignedDoctor && (
                      <div className="mt-3 text-sm">
                        <p className="text-muted-foreground">
                          Issued by: <span className="text-foreground">{cert.assignedDoctor.fullName}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reg: {cert.assignedDoctor.registrationNumber}
                        </p>
                      </div>
                    )}

                    {cert.medicalAssessment && (
                      <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm">
                        <p className="text-muted-foreground">
                          Rest Period: {format(new Date(cert.medicalAssessment.restPeriodFrom), "dd MMM")} –{" "}
                          {format(new Date(cert.medicalAssessment.restPeriodTo), "dd MMM yyyy")}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Issued: {format(new Date(cert.updatedAt), "dd MMM yyyy")}</span>
                      <div className="flex items-center gap-2">
                        {cert.medicalAssessment && cert.assignedDoctor && cert.certificateNumber && (
                          <PdfDownloadButton
                            certificateNumber={cert.certificateNumber}
                            certificateType={cert.certificateType}
                            patientName={(cert.formData?.fullName as string) || `${cert.formData?.firstName || ""} ${cert.formData?.lastName || ""}`.trim() || "Patient"}
                            patientAge={cert.formData?.age as string}
                            patientGender={cert.formData?.gender as string}
                            patientPhone={cert.formData?.phoneNumber as string}
                            doctorName={cert.assignedDoctor.fullName}
                            doctorRegistrationNumber={cert.assignedDoctor.registrationNumber}
                            doctorSpecialization={cert.assignedDoctor.specialization}
                            diagnosis={cert.medicalAssessment.fullDiagnosisOfIllness}
                            restPeriodFrom={cert.medicalAssessment.restPeriodFrom}
                            restPeriodTo={cert.medicalAssessment.restPeriodTo}
                            restDuration={cert.medicalAssessment.restDuration}
                            issuedDate={cert.updatedAt}
                            variant="link"
                            size="sm"
                          />
                        )}
                        <Link
                          href={`/verify-certificate?number=${cert.certificateNumber}`}
                          className="text-primary hover:underline"
                        >
                          Verify →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
