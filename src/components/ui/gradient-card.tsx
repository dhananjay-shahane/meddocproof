"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-6 sm:p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg border",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-50 to-amber-100/50 dark:from-orange-950/30 dark:to-amber-900/20",
        gray: "bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/20",
        purple: "bg-gradient-to-br from-purple-50 to-indigo-100/50 dark:from-purple-950/30 dark:to-indigo-900/20",
        green: "bg-gradient-to-br from-emerald-50 to-teal-100/50 dark:from-emerald-950/30 dark:to-teal-900/20",
        blue: "bg-gradient-to-br from-blue-50 to-cyan-100/50 dark:from-blue-950/30 dark:to-cyan-900/20",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, imageUrl, ...props }, ref) => {
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.02, y: -4 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.1, rotate: 3 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          {...props}
        >
          <motion.img
            src={imageUrl}
            alt={`${title} background graphic`}
            variants={imageAnimation}
            transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
            className="pointer-events-none absolute -right-1/4 -bottom-1/4 w-3/4 opacity-60 dark:opacity-20"
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-sm font-medium text-foreground/80 backdrop-blur-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: badgeColor }}
              />
              {badgeText}
            </div>

            <div className="flex-grow">
              <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{title}</h3>
              <p className="max-w-xs text-sm text-muted-foreground sm:text-base">{description}</p>
            </div>

            <Link
              href={ctaHref}
              className="group mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
