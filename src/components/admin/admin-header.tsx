"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getInitials } from "@/lib/utils";
import { Menu, Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/applications": "Applications",
  "/admin/doctors": "Doctors",
  "/admin/doctors/performance": "Doctor Performance",
  "/admin/doctors/registrations": "Doctor Registrations",
  "/admin/users": "Users",
  "/admin/certificates": "Certificates",
  "/admin/payments": "Payments",
  "/admin/transactions": "Transactions",
  "/admin/coupons": "Coupons",
  "/admin/whatsapp-chat": "WhatsApp Chat",
  "/admin/support-dashboard": "Support Dashboard",
  "/admin/notifications": "Notifications",
  "/admin/payment-fix": "Payment Fix",
  "/admin/settings": "Settings",
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getPageTitle = () => {
    // Check exact match first
    if (breadcrumbMap[pathname]) return breadcrumbMap[pathname];
    // Check partial match
    const match = Object.entries(breadcrumbMap).find(([path]) =>
      pathname.startsWith(path) && path !== "/admin"
    );
    return match ? match[1] : "Dashboard";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          <p className="text-xs text-muted-foreground">
            Admin &gt; {getPageTitle()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search - triggers Ctrl+K */}
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
          className="hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted md:flex"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User avatar */}
        {user && user.type === "admin" && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {getInitials(user.fullName)}
            </div>
            <span className="hidden text-sm font-medium md:block">
              {user.fullName}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
