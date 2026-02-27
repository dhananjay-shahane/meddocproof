"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
}

export function CertificateCard({
  title,
  description,
  icon,
  category,
  href,
  borderColor,
  iconBgColor,
  iconColor,
  badgeBgColor,
  badgeTextColor,
  buttonBgColor,
  buttonTextColor,
}: CertificateCardProps) {
  return (
    <Link href={href} className="block h-full group">
      <div
        className="relative bg-card rounded-2xl border border-border h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        style={{ borderTopWidth: "4px", borderTopColor: borderColor }}
      >
        {/* Category Badge - Top Right */}
        <div className="absolute top-4 right-4">
          <span
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
          >
            {category}
          </span>
        </div>

        {/* Icon */}
        <div className="p-6 pb-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: iconBgColor }}
          >
            <div style={{ color: iconColor, width: "24px", height: "24px" }}>
              {icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-4 flex flex-col grow">
          <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 grow whitespace-pre-line">
            {description}
          </p>

          {/* Apply Now Button */}
          <div className="mt-auto">
            <span
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 group-hover:gap-3"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              Get Certificate
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
