"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Headphones,
  TicketCheck,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import type { SupportStats as SupportStatsType, SupportTicket } from "@/types";

interface SupportDashboardProps {
  stats: SupportStatsType | null;
  tickets: SupportTicket[];
  loading: boolean;
}

export function SupportDashboard({ stats, tickets, loading }: SupportDashboardProps) {
  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Tickets",
              value: stats.totalTickets.toLocaleString(),
              icon: Headphones,
              color: "text-blue-500 bg-blue-500/10",
            },
            {
              label: "Open Tickets",
              value: stats.openTickets.toLocaleString(),
              icon: Clock,
              color: "text-orange-500 bg-orange-500/10",
            },
            {
              label: "Resolved",
              value: stats.resolvedTickets.toLocaleString(),
              icon: CheckCircle,
              color: "text-green-500 bg-green-500/10",
            },
            {
              label: "Avg Response Time",
              value: stats.avgResponseTime,
              icon: TicketCheck,
              color: "text-purple-500 bg-purple-500/10",
            },
          ].map((card) => (
            <Card key={card.label} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{card.value}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      )}

      {/* Tickets list */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Recent Tickets</h3>
        {tickets.length === 0 ? (
          <EmptyState
            icon={Headphones}
            title="No support tickets"
            description="Support tickets will appear here when users submit them."
          />
        ) : (
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-lg p-2 ${
                        ticket.priority === "high"
                          ? "bg-red-500/10 text-red-500"
                          : ticket.priority === "medium"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                        {ticket.message}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{ticket.userName}</span>
                        <span>·</span>
                        <span>{ticket.userPhone}</span>
                        <span>·</span>
                        <span>{formatRelativeDate(ticket.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      variant={
                        ticket.status === "resolved"
                          ? "default"
                          : ticket.status === "open"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline">{ticket.priority}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
