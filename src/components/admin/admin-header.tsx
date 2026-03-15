"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/hooks/use-notifications";
import { getInitials } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  Menu,
  Bell,
  Search,
  RefreshCw,
  Check,
  CheckCheck,
  Trash2,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Stethoscope,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// Notification type icon mapping
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "message":
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case "consultation":
      return <Stethoscope className="h-4 w-4 text-purple-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Fetch notifications
  const {
    data: notificationsData,
    unreadCount,
    loading: notificationsLoading,
    refetch: refetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ filters: { filter: "all", type: "" }, page: 1, limit: 10 });

  const notifications = notificationsData?.items || [];

  const getPageTitle = () => {
    if (breadcrumbMap[pathname]) return breadcrumbMap[pathname];
    const match = Object.entries(breadcrumbMap).find(([path]) =>
      pathname.startsWith(path) && path !== "/admin"
    );
    return match ? match[1] : "Dashboard";
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(id);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
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

        {/* Notifications Dropdown */}
        <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-lg p-2 hover:bg-muted focus:outline-none">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            {/* Notification Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => refetchNotifications()}
                  className="rounded p-1 hover:bg-muted"
                  title="Refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${notificationsLoading ? "animate-spin" : ""}`} />
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark All Read
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {notificationsLoading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-sm">No notifications</span>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                    className={`flex items-start gap-3 px-3 py-3 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm truncate ${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: false })}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      {notification.type === "consultation" && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-700 rounded dark:bg-orange-900 dark:text-orange-300">
                          Action Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="rounded p-1 hover:bg-muted"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="rounded p-1 hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* View All Link */}
            <div className="border-t px-3 py-2">
              <Link
                href="/admin/notifications"
                onClick={() => setNotificationOpen(false)}
                className="block text-center text-sm text-primary hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        {user && user.type === "admin" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted focus:outline-none">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {getInitials(user.fullName)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-xs font-normal text-muted-foreground">Administrator</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Your Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
