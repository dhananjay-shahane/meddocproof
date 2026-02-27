"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, User, Stethoscope, ArrowRight, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "application" | "doctor" | "user" | "page";
  href: string;
}

const ADMIN_PAGES: SearchResult[] = [
  { id: "p-dashboard", title: "Dashboard", subtitle: "Admin overview", type: "page", href: "/admin" },
  { id: "p-applications", title: "Applications", subtitle: "Manage applications", type: "page", href: "/admin/applications" },
  { id: "p-doctors", title: "Doctors", subtitle: "Manage doctors", type: "page", href: "/admin/doctors" },
  { id: "p-users", title: "Users", subtitle: "Manage users", type: "page", href: "/admin/users" },
  { id: "p-certificates", title: "Certificates", subtitle: "View certificates", type: "page", href: "/admin/certificates" },
  { id: "p-payments", title: "Payments", subtitle: "Payment overview", type: "page", href: "/admin/payments" },
  { id: "p-transactions", title: "Transactions", subtitle: "Transaction history", type: "page", href: "/admin/transactions" },
  { id: "p-coupons", title: "Coupons", subtitle: "Manage coupons", type: "page", href: "/admin/coupons" },
  { id: "p-whatsapp", title: "WhatsApp Chat", subtitle: "Chat messages", type: "page", href: "/admin/whatsapp-chat" },
  { id: "p-settings", title: "Settings", subtitle: "Platform settings", type: "page", href: "/admin/settings" },
  { id: "p-notifications", title: "Notifications", subtitle: "All notifications", type: "page", href: "/admin/notifications" },
  { id: "p-support", title: "Support Dashboard", subtitle: "Support tickets", type: "page", href: "/admin/support-dashboard" },
  { id: "p-payment-fix", title: "Payment Fix", subtitle: "Fix payment issues", type: "page", href: "/admin/payment-fix" },
];

const DOCTOR_PAGES: SearchResult[] = [
  { id: "p-dashboard", title: "Dashboard", subtitle: "Doctor overview", type: "page", href: "/doctor" },
  { id: "p-applications", title: "Applications", subtitle: "Patient applications", type: "page", href: "/doctor/applications" },
  { id: "p-financials", title: "Financials", subtitle: "Earnings & withdrawals", type: "page", href: "/doctor/financials" },
  { id: "p-settings", title: "Settings", subtitle: "Account settings", type: "page", href: "/doctor/settings" },
];

const ICON_MAP = {
  application: FileText,
  doctor: Stethoscope,
  user: User,
  page: ArrowRight,
};

export function CommandPalette() {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isAdmin = user?.type === "admin";
  const isDoctor = user?.type === "doctor";

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSelected(0);
    }
  }, [open]);

  // Search debounce
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        // Show page results only
        const pages = isAdmin ? ADMIN_PAGES : isDoctor ? DOCTOR_PAGES : [];
        setResults(pages);
        return;
      }

      const q = searchQuery.toLowerCase();

      // Filter page results
      const pages = (isAdmin ? ADMIN_PAGES : isDoctor ? DOCTOR_PAGES : []).filter(
        (p) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)
      );

      // API search for applications, doctors, users
      if (isAdmin && searchQuery.length >= 2) {
        setLoading(true);
        try {
          const [appsRes, doctorsRes, usersRes] = await Promise.all([
            api.get(`/admin/applications?search=${encodeURIComponent(searchQuery)}&limit=5`).catch(() => null),
            api.get(`/admin/doctors?search=${encodeURIComponent(searchQuery)}&limit=5`).catch(() => null),
            api.get(`/admin/users?search=${encodeURIComponent(searchQuery)}&limit=5`).catch(() => null),
          ]);

          const appResults: SearchResult[] = (appsRes?.data?.data?.applications || []).map(
            (app: { id: string; applicationId: string; certificateType: string; status: string }) => ({
              id: `app-${app.id}`,
              title: `Application ${app.applicationId}`,
              subtitle: `${app.certificateType} — ${app.status}`,
              type: "application" as const,
              href: `/admin/applications`,
            })
          );

          const doctorResults: SearchResult[] = (doctorsRes?.data?.data?.doctors || []).map(
            (doc: { id: string; fullName: string; specialization: string }) => ({
              id: `doc-${doc.id}`,
              title: doc.fullName,
              subtitle: doc.specialization,
              type: "doctor" as const,
              href: `/admin/doctors`,
            })
          );

          const userResults: SearchResult[] = (usersRes?.data?.data?.users || []).map(
            (u: { id: string; fullName: string; phoneNumber: string }) => ({
              id: `user-${u.id}`,
              title: u.fullName,
              subtitle: u.phoneNumber,
              type: "user" as const,
              href: `/admin/users`,
            })
          );

          setResults([...pages, ...appResults, ...doctorResults, ...userResults]);
        } catch {
          setResults(pages);
        } finally {
          setLoading(false);
        }
      } else {
        setResults(pages);
      }
    },
    [isAdmin, isDoctor]
  );

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => performSearch(query), 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, performSearch]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    router.push(result.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      handleSelect(results[selected]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2 rounded-xl border bg-card shadow-xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, applications, doctors, users..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && query && !loading ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </p>
          ) : (
            results.map((result, idx) => {
              const Icon = ICON_MAP[result.type];
              return (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    idx === selected ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 truncate">
                    <span className="font-medium">{result.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{result.subtitle}</span>
                  </div>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground capitalize">
                    {result.type}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t px-4 py-2 text-center text-[11px] text-muted-foreground">
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd> navigate
          <span className="mx-2">·</span>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↵</kbd> select
          <span className="mx-2">·</span>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">esc</kbd> close
        </div>
      </div>
    </div>
  );
}
