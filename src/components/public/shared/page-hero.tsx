import { BadgeCheck, MessageSquare, Scale, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const heroIcons = {
  "badge-check": BadgeCheck,
  "message-square": MessageSquare,
  scale: Scale,
  shield: Shield,
} as const;

export type HeroIconName = keyof typeof heroIcons;

export interface HeroSummaryItem {
  label: string;
  value: string;
  description?: string;
  href?: string;
}

interface PageHeroProps {
  iconName: HeroIconName;
  eyebrow: string;
  title: string;
  description: string;
  chips?: string[];
  summaryTitle?: string;
  summaryItems?: HeroSummaryItem[];
  className?: string;
}

export function PageHero({
  iconName,
  eyebrow,
  title,
  description,
  chips = [],
  summaryTitle = "Quick overview",
  summaryItems = [],
  className,
}: PageHeroProps) {
  const Icon = heroIcons[iconName];

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-primary/10 bg-[radial-gradient(circle_at_top_left,rgba(13,47,133,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(31,184,201,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,247,250,0.94))]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(circle_at_center,white,transparent_78%)] opacity-35" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-linear-to-b from-white/70 via-white/15 to-transparent" />
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-16 h-48 w-48 rounded-full bg-emerald-400/12 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/10 bg-white/80 px-4 py-2 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                {eyebrow}
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {description}
            </p>

            {chips.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_12px_24px_-22px_rgba(15,23,42,0.5)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {summaryItems.length > 0 ? (
            <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-6 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.42)] backdrop-blur">
              <p className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
                {summaryTitle}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {summaryItems.map((item) => {
                  const content = (
                    <>
                      <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {item.value}
                      </p>
                      {item.description ? (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      ) : null}
                    </>
                  );

                  return item.href ? (
                    <a
                      key={`${item.label}-${item.value}`}
                      href={item.href}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-primary/30 hover:bg-white"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
