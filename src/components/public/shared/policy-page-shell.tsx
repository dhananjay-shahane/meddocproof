import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  PageHero,
  type HeroIconName,
  type HeroSummaryItem,
} from "@/components/public/shared/page-hero";

export interface PolicySection {
  id: string;
  title: string;
  intro?: string;
  content: React.ReactNode;
}

interface SidebarCard {
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
}

interface FooterLink {
  href: string;
  label: string;
}

interface PolicyPageShellProps {
  iconName: HeroIconName;
  eyebrow: string;
  title: string;
  description: string;
  chips?: string[];
  summaryTitle?: string;
  summaryItems?: HeroSummaryItem[];
  sections: PolicySection[];
  sidebarTitle?: string;
  sidebarDescription?: string;
  sidebarCards?: SidebarCard[];
  footerLinks?: FooterLink[];
}

export function PolicyPageShell({
  iconName,
  eyebrow,
  title,
  description,
  chips = [],
  summaryTitle,
  summaryItems = [],
  sections,
  sidebarTitle = "On this page",
  sidebarDescription = "Jump to each section or reach out if you need clarification about our policies.",
  sidebarCards = [],
  footerLinks = [],
}: PolicyPageShellProps) {
  return (
    <>
      <PageHero
        iconName={iconName}
        eyebrow={eyebrow}
        title={title}
        description={description}
        chips={chips}
        summaryTitle={summaryTitle}
        summaryItems={summaryItems}
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.5)]">
              <p className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
                {sidebarTitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {sidebarDescription}
              </p>
              <nav className="mt-5 space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-2xl border border-transparent bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-primary/15 hover:bg-primary/5 hover:text-primary"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {sidebarCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 shadow-[0_18px_60px_-52px_rgba(15,23,42,0.5)]"
              >
                <p className="text-base font-semibold text-slate-900">
                  {card.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>
                {card.href && card.hrefLabel ? (
                  <a
                    href={card.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                  >
                    {card.hrefLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            ))}
          </aside>

          <div className="space-y-5">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.5)] sm:p-8"
              >
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Section
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                    {section.title}
                  </h2>
                  {section.intro ? (
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {section.intro}
                    </p>
                  ) : null}
                </div>
                <div className="mt-6 space-y-4">{section.content}</div>
              </section>
            ))}

            {footerLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
