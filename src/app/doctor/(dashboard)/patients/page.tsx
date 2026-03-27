"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Video,
  Clock,
  CheckCircle,
  Search,
  SlidersHorizontal,
  CheckSquare,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay } from "date-fns";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface Consultation {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  certificateType: string;
  status: string;
  consultationDate: string | null;
  createdAt: string;
}

interface ConsultationStats {
  todaysConsultations: number;
  upcoming: number;
  completedThisMonth: number;
}

type TabType = "all" | "upcoming" | "today" | "completed" | "calendar";

export default function DoctorPatientsPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [stats, setStats] = useState<ConsultationStats>({
    todaysConsultations: 0,
    upcoming: 0,
    completedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [calendarFilter, setCalendarFilter] = useState("all");

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/doctor/patients?tab=${activeTab}`);
      setConsultations(res.data.data?.consultations || []);
      setStats(res.data.data?.stats || {
        todaysConsultations: 0,
        upcoming: 0,
        completedThisMonth: 0,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load consultations");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const filteredConsultations = (consultations || []).filter(
    (c) =>
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.patientPhone.includes(search) ||
      c.certificateType.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All", icon: <Users className="h-4 w-4" /> },
    { id: "upcoming", label: "Upcoming", icon: <Clock className="h-4 w-4" /> },
    { id: "today", label: "Today", icon: <Calendar className="h-4 w-4" /> },
    { id: "completed", label: "Completed", icon: <CheckCircle className="h-4 w-4" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
  ];

  const getTabCount = (tabId: TabType) => {
    switch (tabId) {
      case "all":
        return consultations.length;
      case "upcoming":
        return stats.upcoming;
      case "today":
        return stats.todaysConsultations;
      case "completed":
        return stats.completedThisMonth;
      default:
        return 0;
    }
  };

  // Calendar week days
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeekStart, i));
    }
    return days;
  }, [currentWeekStart]);

  const today = new Date();
  const weekEnd = addDays(currentWeekStart, 6);

  const goToPreviousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goToNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Get consultations for a specific day
  const getConsultationsForDay = (day: Date) => {
    return consultations.filter((c) => {
      if (!c.consultationDate) return false;
      return isSameDay(new Date(c.consultationDate), day);
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => router.push("/doctor")}
          className="mb-4 inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold tracking-tight">
          Online Consultations
        </h1>
        <p className="text-muted-foreground">
          Manage your video consultations and patient appointments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Today's Consultations */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Today&apos;s Consultations
              </p>
              <p className="mt-1 text-3xl font-bold">
                {stats.todaysConsultations}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Video & audio calls
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-900/20">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Upcoming
              </p>
              <p className="mt-1 text-3xl font-bold">{stats.upcoming}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scheduled appointments
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-900/20">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="mt-1 text-3xl font-bold">
                {stats.completedThisMonth}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">This month</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2.5 dark:bg-emerald-900/20">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients, phone number, or symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-3 pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted">
            <CheckSquare className="h-4 w-4" />
            Bulk Mode
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border bg-muted/30 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              activeTab === tab.id
                ? tab.id === "calendar"
                  ? "border-2 border-primary bg-card text-foreground shadow-sm"
                  : "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label} {tab.id !== "calendar" && `(${getTabCount(tab.id)})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-60 items-center justify-center rounded-xl border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 rounded-xl border bg-card">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : activeTab === "calendar" ? (
        /* Calendar View */
        <div className="space-y-4">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousWeek}
                className="rounded-lg border bg-card p-2 transition-colors hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goToToday}
                className="rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Today
              </button>
              <button
                onClick={goToNextWeek}
                className="rounded-lg border bg-card p-2 transition-colors hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="ml-2 text-sm font-medium">
                {format(currentWeekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <select
                value={calendarFilter}
                onChange={(e) => setCalendarFilter(e.target.value)}
                className="rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Consultations</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Week Calendar Grid */}
          <div className="rounded-xl border bg-card overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7">
              {weekDays.map((day, index) => {
                const isToday = isSameDay(day, today);
                const dayConsultations = getConsultationsForDay(day);

                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[120px] border-r last:border-r-0 p-2",
                      isToday && "ring-2 ring-primary ring-inset bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "mb-2 text-sm font-medium",
                        isToday ? "text-primary" : "text-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayConsultations.slice(0, 3).map((consultation) => (
                        <div
                          key={consultation.id}
                          className="truncate rounded bg-primary/10 px-2 py-1 text-xs text-primary"
                        >
                          {consultation.patientName}
                        </div>
                      ))}
                      {dayConsultations.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayConsultations.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-xl border bg-card">
          <Users className="h-12 w-12 text-muted-foreground/30" />
          <div className="text-center">
            <p className="font-medium text-foreground">
              No consultations found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {consultation.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{consultation.patientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {consultation.certificateType.replace(/_/g, " ")} •{" "}
                      {consultation.patientPhone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {consultation.consultationDate
                      ? format(new Date(consultation.consultationDate), "dd MMM yyyy, h:mm a")
                      : "Not scheduled"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {format(new Date(consultation.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
