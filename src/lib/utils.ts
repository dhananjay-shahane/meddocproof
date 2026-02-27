import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in INR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format date in a standard format
 */
export function formatDate(date: Date | string, fmt: string = "dd MMM yyyy"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, fmt);
}

/**
 * Get initials from a name (e.g., "John Doe" → "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Sleep for given milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random color from a string (for avatars)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Status color mapping
 */
export const statusColors: Record<string, string> = {
  submitted: "bg-status-submitted text-white",
  pending: "bg-status-pending text-white",
  pending_review: "bg-status-pending text-white",
  pending_doctor_review: "bg-status-pending text-white",
  assigned: "bg-status-assigned text-white",
  doctor_assigned: "bg-status-assigned text-white",
  in_progress: "bg-status-in-progress text-white",
  certificate_in_progress: "bg-status-in-progress text-white",
  consultation_scheduled: "bg-status-assigned text-white",
  under_review: "bg-status-under-review text-white",
  processing: "bg-status-under-review text-white",
  approved: "bg-status-approved text-white",
  completed: "bg-status-completed text-white",
  consultation_completed: "bg-status-completed text-white",
  certificate_delivered: "bg-status-completed text-white",
  delivered: "bg-status-completed text-white",
  rejected: "bg-status-rejected text-white",
  cancelled: "bg-status-cancelled text-white",
  refunded: "bg-status-cancelled text-white",
  incomplete: "bg-gray-400 text-white",
  dormant: "bg-gray-400 text-white",
  active: "bg-green-500 text-white",
  inactive: "bg-gray-400 text-white",
  blocked: "bg-red-500 text-white",
  suspended: "bg-red-400 text-white",
};

/**
 * Format status label (snake_case → Title Case)
 */
export function formatStatusLabel(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
