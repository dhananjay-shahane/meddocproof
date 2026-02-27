"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useDoctorNotifications } from "@/hooks/use-doctor-notifications";
import { getInitials } from "@/lib/utils";
import { Menu, Bell, Check, CheckCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { formatDistanceToNow } from "date-fns";

interface DoctorHeaderProps {
  onMenuClick: () => void;
}

const breadcrumbMap: Record<string, string> = {
  "/doctor": "Dashboard",
  "/doctor/applications": "Applications",
  "/doctor/financials": "Financials",
  "/doctor/availability": "Availability",
  "/doctor/settings": "Settings",
};

export default function DoctorHeader({ onMenuClick }: DoctorHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useDoctorNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    if (breadcrumbMap[pathname]) return breadcrumbMap[pathname];
    const match = Object.entries(breadcrumbMap).find(
      ([path]) => pathname.startsWith(path) && path !== "/doctor"
    );
    return match ? match[1] : "Dashboard";
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            Doctor &gt; {getPageTitle()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notification bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="relative rounded-lg p-2 hover:bg-muted"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border bg-card shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (!n.isRead) markAsRead(n.id);
                      }}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 ${
                        !n.isRead ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {n.message}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(n.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!n.isRead && (
                        <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {user && user.type === "doctor" && (
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
