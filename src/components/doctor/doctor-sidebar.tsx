"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/doctor", icon: LayoutDashboard },
  { label: "Applications", href: "/doctor/applications", icon: FileText },
  { label: "Financials", href: "/doctor/financials", icon: Wallet },
  { label: "Availability", href: "/doctor/availability", icon: CalendarDays },
  { label: "Notifications", href: "/doctor/notifications", icon: Bell },
  { label: "Settings", href: "/doctor/settings", icon: Settings },
];

interface DoctorSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DoctorSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: DoctorSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/doctor") return pathname === "/doctor";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/doctor" className="text-lg font-bold tracking-tight">
            Doctor Portal
          </Link>
        )}
        <button
          onClick={onToggle}
          className="rounded-lg p-1.5 hover:bg-muted"
        >
          <ChevronLeft
            className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Doctor profile info */}
      {!collapsed && user && user.type === "doctor" && (
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {getInitials(user.fullName)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold">{user.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.specialization}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden h-screen flex-col border-r bg-card transition-all duration-300 lg:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={onMobileClose}
          className="absolute right-3 top-4 rounded-lg p-1.5 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
