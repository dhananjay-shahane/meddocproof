"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  bestFor: string;
  href: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  className?: string;
}

export function CertificateCard({
  title,
  description,
  icon,
  category,
  bestFor,
  href,
  borderColor,
  iconBgColor,
  iconColor,
  badgeBgColor,
  badgeTextColor,
  buttonBgColor,
  buttonTextColor,
  className,
}: CertificateCardProps) {
  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <article
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
        style={{ borderColor: borderColor }}
      >
        {/* Top Decorative Line */}
        <div
          className="absolute inset-x-0 top-0 h-1 transition-transform duration-300 group-hover:scale-x-110"
          style={{ backgroundColor: borderColor }}
        />

        {/* Icon & Category */}
        <div className="flex items-start justify-between">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full shadow-md transition-transform duration-300 group-hover:scale-110 border-4"
            style={{ backgroundColor: iconBgColor, color: iconColor, borderColor: borderColor }}
          >
            <div className="h-12 w-12">{icon}</div>
          </div>
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
          >
            {category}
          </span>
        </div>

        {/* Content */}
        <div className="mt-8 flex grow flex-col">
          <h3 className="text-xl font-bold tracking-tight text-black group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-semibold text-gray-700">
              Ideal for {bestFor}
            </span>
          </div>

          <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-gray-700">
            {description}
          </p>

          {/* Action Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Doctor Verified
            </div>

            <button
              className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-3 px-4 py-2 rounded-lg border border-primary bg-primary text-white hover:bg-primary/90"
              type="button"
              style={{ borderColor: borderColor, backgroundColor: borderColor }}
            >
              Get Certificate
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
