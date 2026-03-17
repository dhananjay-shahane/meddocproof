"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface EarningsTickerProps {
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

const periods = [
  { key: "today", label: "Today" },
  { key: "thisWeek", label: "This Week" },
  { key: "thisMonth", label: "This Month" },
] as const;

export function EarningsTicker({ earnings }: EarningsTickerProps) {
  const [activePeriod, setActivePeriod] = useState<keyof typeof earnings>("thisMonth");

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-green-50 p-2">
            <IndianRupee className="h-4 w-4 text-green-600" />
          </div>
          <h3 className="font-semibold">Earnings</h3>
        </div>
        <div className="flex rounded-lg bg-muted p-0.5">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setActivePeriod(period.key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activePeriod === period.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activePeriod}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-3xl font-bold">{formatCurrency(earnings[activePeriod])}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {periods.find((p) => p.key === activePeriod)?.label} earnings
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
