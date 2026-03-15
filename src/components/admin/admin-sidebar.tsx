"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { usePermissions } from "@/hooks/use-permissions";
import { useSidebarCounts, type SidebarCounts } from "@/hooks/use-sidebar-counts";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Stethoscope,
  Users,
  Award,
  CreditCard,
  Ticket,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  X,
  Star,
  Mail,
  FileImage,
  HelpCircle,
  ListChecks,
  Clock,
  CheckCircle,
  FileCheck,
  FileClock,
  Layout,
  Eye,
  UserPlus,
  UserCheck,
  BarChart3,
  Receipt,
  Wallet,
  BadgeDollarSign,
  LineChart,
  FileBarChart,
} from "lucide-react";

interface NavChild {
  label: string;
  href: string;
  icon?: React.ElementType;
  countKey?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  module?: string;
  countKey?: string;
  children?: NavChild[];
  section?: "main" | "admin";
}

const getNavItems = (counts: SidebarCounts): NavItem[] => [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: FileText,
    module: "applications",
    countKey: "applications.temporary",
    children: [
      { label: "All Applications", href: "/admin/applications", icon: ListChecks },
      { label: "Temporary", href: "/admin/applications/temporary", icon: Clock },
      { label: "Completed", href: "/admin/applications/completed", icon: CheckCircle },
    ],
  },
  {
    label: "Certificates",
    href: "/admin/certificates",
    icon: Award,
    module: "certificates",
    countKey: "certificates.incomplete",
    children: [
      { label: "All Certificates", href: "/admin/certificates", icon: Award },
      { label: "Incomplete Certificates", href: "/admin/certificates/incomplete", icon: FileClock },
      { label: "Completed Certificates", href: "/admin/certificates/completed", icon: FileCheck },
      { label: "Templates", href: "/admin/certificates/templates", icon: Layout },
      { label: "Demo Templates", href: "/admin/certificates/demo-templates", icon: Eye },
    ],
  },
  { label: "Users", href: "/admin/users", icon: Users, module: "users" },
  {
    label: "Doctors",
    href: "/admin/doctors",
    icon: Stethoscope,
    module: "doctors",
    countKey: "doctors.newRegistrations",
    children: [
      { label: "New Registrations", href: "/admin/doctors/registrations", icon: UserPlus },
      { label: "Approved Doctors", href: "/admin/doctors/approved", icon: UserCheck },
      { label: "All Doctors", href: "/admin/doctors", icon: Stethoscope },
      { label: "Performance", href: "/admin/doctors/performance", icon: BarChart3 },
    ],
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    module: "payments",
    children: [
      { label: "Overview", href: "/admin/payments", icon: CreditCard },
      { label: "Transactions", href: "/admin/payments/transactions", icon: Receipt },
      { label: "Withdrawals", href: "/admin/payments/withdrawals", icon: Wallet },
      { label: "Doctor Payouts", href: "/admin/payments/doctor-payouts", icon: BadgeDollarSign },
      { label: "Analytics", href: "/admin/payments/analytics", icon: LineChart },
      { label: "Reports", href: "/admin/payments/reports", icon: FileBarChart },
      { label: "Settings", href: "/admin/payments/settings", icon: Settings },
    ],
  },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, module: "coupons" },
  // Administration section
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    module: "settings",
    section: "admin",
  },
  {
    label: "Help",
    href: "/admin/help",
    icon: HelpCircle,
    section: "admin",
  },
];

// Helper to get count value from nested key like "applications.temporary"
const getCountValue = (counts: SidebarCounts, key?: string): number | undefined => {
  if (!key) return undefined;
  const keys = key.split(".");
  let value: unknown = counts;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  return typeof value === "number" ? value : undefined;
};

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const { counts, loading: countsLoading } = useSidebarCounts();
  
  // Track manually toggled items (user explicitly expanded/collapsed)
  const [manuallyExpandedItems, setManuallyExpandedItems] = useState<string[]>([]);
  const [manuallyCollapsedItems, setManuallyCollapsedItems] = useState<string[]>([]);

  // Compute auto-expanded parent based on current pathname
  const autoExpandedParent = useMemo(() => {
    const navItems = getNavItems(counts);
    const activeParent = navItems.find(
      (item) =>
        item.children?.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"))
    );
    return activeParent?.label;
  }, [pathname, counts]);

  // Effective expanded items: manually expanded + auto-expanded (unless manually collapsed)
  const expandedItems = useMemo(() => {
    const items = new Set(manuallyExpandedItems);
    if (autoExpandedParent && !manuallyCollapsedItems.includes(autoExpandedParent)) {
      items.add(autoExpandedParent);
    }
    return Array.from(items);
  }, [manuallyExpandedItems, manuallyCollapsedItems, autoExpandedParent]);

  const toggleExpanded = (label: string) => {
    if (expandedItems.includes(label)) {
      // Collapsing: remove from manually expanded, add to manually collapsed
      setManuallyExpandedItems((prev) => prev.filter((i) => i !== label));
      setManuallyCollapsedItems((prev) => 
        prev.includes(label) ? prev : [...prev, label]
      );
    } else {
      // Expanding: add to manually expanded, remove from manually collapsed
      setManuallyExpandedItems((prev) => 
        prev.includes(label) ? prev : [...prev, label]
      );
      setManuallyCollapsedItems((prev) => prev.filter((i) => i !== label));
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // For child items: exact match only, except for base child which checks if no other child matches
  const isExactChildActive = (childHref: string, siblings: NavChild[]) => {
    // First check exact match
    if (pathname === childHref) return true;
    
    // For base child (e.g. "/admin/applications"), check if pathname starts with it
    // BUT only if no other sibling matches more specifically
    if (pathname.startsWith(childHref + "/")) {
      // Check if any other sibling is a more specific match
      const moreSpecificMatch = siblings.some(
        (sibling) => sibling.href !== childHref && pathname.startsWith(sibling.href)
      );
      return !moreSpecificMatch;
    }
    
    return false;
  };

  const isChildActive = (item: NavItem) => {
    return item.children?.some((child) => isActive(child.href));
  };

  const canAccess = (module?: string) => {
    if (!module || isSuperAdmin) return true;
    return hasPermission(module as never, "read");
  };

  const navItems = getNavItems(counts);
  const mainItems = navItems.filter((item) => item.section !== "admin" && canAccess(item.module));
  const adminItems = navItems.filter((item) => item.section === "admin" && canAccess(item.module));

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href) || isChildActive(item);
    const expanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;
    const count = getCountValue(counts, item.countKey);

    return (
      <li key={item.label}>
        <div className="flex items-center">
          <Link
            href={hasChildren ? "#" : item.href}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                toggleExpanded(item.label);
              } else {
                onMobileClose();
              }
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {/* Count badge for collapsed state */}
            {collapsed && count !== undefined && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count > 9 ? "9+" : count}
              </span>
            )}
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {count !== undefined && count > 0 && (
                  <span className="ml-auto mr-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {count}
                  </span>
                )}
                {countsLoading && item.countKey && (
                  <span className="ml-auto mr-2 h-4 w-6 animate-pulse rounded-full bg-muted" />
                )}
                {hasChildren && (
                  <span className="ml-1">
                    {expanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </span>
                )}
              </>
            )}
          </Link>
        </div>
        {/* Sub-items with animation */}
        {hasChildren && !collapsed && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <ul className="ml-4 mt-1 space-y-0.5 border-l border-border/50 pl-4">
              {item.children!.map((child) => {
                const ChildIcon = child.icon;
                const childCount = getCountValue(counts, child.countKey);
                const childActive = isExactChildActive(child.href, item.children!);

                return (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                        childActive
                          ? "font-medium bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      {ChildIcon && <ChildIcon className="h-3.5 w-3.5 shrink-0" />}
                      <span className="flex-1 truncate">{child.label}</span>
                      {childCount !== undefined && childCount > 0 && (
                        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          {childCount}
                        </span>
                      )}
                      {countsLoading && child.countKey && (
                        <span className="ml-auto h-4 w-6 animate-pulse rounded-full bg-muted" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </li>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo / Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
        )}
        {collapsed && (
          <div className="flex w-full flex-col items-center gap-1">
            <Link href="/admin">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={44}
                height={44}
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={onToggle}
              className="rounded-lg p-1 hover:bg-muted"
              title="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 hover:bg-muted"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {mainItems.map(renderNavItem)}
        </ul>

        {/* Administration Section */}
        {adminItems.length > 0 && (
          <>
            <div className="mt-6 mb-2 px-3">
              {!collapsed && (
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Administration
                </span>
              )}
            </div>
            <ul className="space-y-1">
              {adminItems.map(renderNavItem)}
            </ul>
          </>
        )}
      </nav>

      {/* User info + Logout */}
      <div className="border-t p-3">
        {!collapsed && user && (
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user.type === "admin" ? getInitials(user.fullName) : "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">
                {user.type === "admin" ? user.fullName : "Admin"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.type === "admin" ? user.role.replace("_", " ") : "Administrator"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
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
