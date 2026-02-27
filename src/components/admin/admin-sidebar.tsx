"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { usePermissions } from "@/hooks/use-permissions";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Stethoscope,
  Users,
  Award,
  CreditCard,
  ArrowLeftRight,
  Ticket,
  MessageCircle,
  Bell,
  Wrench,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  X,
  Star,
  Mail,
  FileImage,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  module?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: FileText,
    module: "applications",
  },
  {
    label: "Doctors",
    href: "/admin/doctors",
    icon: Stethoscope,
    module: "doctors",
    children: [
      { label: "Overview", href: "/admin/doctors" },
      { label: "Performance", href: "/admin/doctors/performance" },
      { label: "Registrations", href: "/admin/doctors/registrations" },
    ],
  },
  { label: "Users", href: "/admin/users", icon: Users, module: "users" },
  {
    label: "Certificates",
    href: "/admin/certificates",
    icon: Award,
    module: "certificates",
  },
  {
    label: "Sample Certificates",
    href: "/admin/sample-certificates",
    icon: FileImage,
    module: "certificates",
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    module: "payments",
  },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: ArrowLeftRight,
    module: "transactions",
  },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, module: "coupons" },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
    module: "reviews",
  },
  {
    label: "Contact Messages",
    href: "/admin/contact-messages",
    icon: Mail,
    module: "support",
  },
  {
    label: "WhatsApp Chat",
    href: "/admin/whatsapp-chat",
    icon: MessageCircle,
    module: "whatsapp",
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    module: "notifications",
  },
  {
    label: "Payment Fix",
    href: "/admin/payment-fix",
    icon: Wrench,
    module: "payments",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    module: "settings",
  },
];

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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const canAccess = (module?: string) => {
    if (!module || isSuperAdmin) return true;
    return hasPermission(module as never, "read");
  };

  const filteredItems = navItems.filter((item) => canAccess(item.module));

  const sidebarContent = (
    <>
      {/* Logo / Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            MediProofDocs
          </Link>
        )}
        <button
          onClick={collapsed ? onToggle : onToggle}
          className="rounded-lg p-1.5 hover:bg-muted"
        >
          <ChevronLeft
            className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const expanded = expandedItems.includes(item.label);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.label}>
                <div className="flex items-center">
                  <Link
                    href={hasChildren ? "#" : item.href}
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault();
                        toggleExpanded(item.label);
                      }
                      onMobileClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {hasChildren && (
                          <span>
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
                {/* Sub-items */}
                {hasChildren && expanded && !collapsed && (
                  <ul className="ml-6 mt-1 space-y-1 border-l pl-3">
                    {item.children!.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onMobileClose}
                          className={cn(
                            "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                            pathname === child.href
                              ? "font-medium text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
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
                {user.type === "admin" ? user.role.replace("_", " ") : ""}
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
