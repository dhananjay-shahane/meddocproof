"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  Users,
  CalendarDays,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Stethoscope,
} from "lucide-react";
import { useDoctorDashboard } from "@/hooks/use-doctor-dashboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

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
  const { data } = useDoctorDashboard(0); // No auto-refresh for sidebar

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/doctor", icon: LayoutDashboard },
    {
      label: "Applications",
      href: "/doctor/applications",
      icon: FileText,
      badge: data?.pendingReview,
    },
    { label: "Financials", href: "/doctor/financials", icon: Wallet },
    { label: "Patients", href: "/doctor/patients", icon: Users },
    { label: "Availability", href: "/doctor/availability", icon: CalendarDays },
    { label: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/doctor") return pathname === "/doctor";
    return pathname.startsWith(href);
  };

  const NavItemContent = ({ item, active }: { item: NavItem; active: boolean }) => {
    const Icon = item.icon;
    
    const content = (
      <Link
        href={item.href}
        onClick={onMobileClose}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="relative">
          <Icon className={cn("h-5 w-5 shrink-0", collapsed && "h-5 w-5")} />
          {/* Badge on icon when collapsed */}
          {collapsed && item.badge !== undefined && item.badge > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          )}
        </div>
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && item.badge !== undefined && item.badge > 0 && (
          <span
            className={cn(
              "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold transition-colors",
              active
                ? "bg-white/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  const sidebarContent = (isMobile: boolean = false) => (
    <>
      {/* Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b bg-card/50 backdrop-blur-sm",
          collapsed && !isMobile ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {(!collapsed || isMobile) && (
          <Link
            href="/doctor"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Doctor Portal
            </span>
          </Link>
        )}
        {collapsed && !isMobile && (
          <Link href="/doctor" className="flex items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors hover:bg-primary/20">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={onToggle}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border bg-background shadow-sm transition-all hover:bg-muted",
              collapsed && "absolute -right-3 top-5 z-10"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Doctor profile info */}
      {user && user.type === "doctor" && (
        <div
          className={cn(
            "shrink-0 border-b p-4 transition-all duration-200",
            collapsed && !isMobile && "flex flex-col items-center p-3"
          )}
        >
          {collapsed && !isMobile ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex h-10 w-10 cursor-default items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-md ring-2 ring-primary/20">
                  {getInitials(user.fullName)}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.specialization}</p>
                <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Approved
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-md ring-2 ring-primary/20">
                  {getInitials(user.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{user.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.specialization}
                  </p>
                </div>
              </div>
              <span className="mt-3 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Approved
              </span>
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <TooltipProvider>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <NavItemContent item={item} active={active} />
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>

      {/* Logout */}
      <div className={cn("shrink-0 border-t p-3", collapsed && !isMobile && "px-2")}>
        {collapsed && !isMobile ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <TooltipProvider>
        <aside
          className={cn(
            "relative hidden h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out lg:flex",
            collapsed ? "w-[70px]" : "w-64"
          )}
        >
          {sidebarContent(false)}
        </aside>
      </TooltipProvider>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={onMobileClose}
          className="absolute right-3 top-4 z-10 rounded-lg p-2 hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent(true)}
      </aside>
    </>
  );
}
