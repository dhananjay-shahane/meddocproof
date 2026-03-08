import * as React from "react";

interface HeroSectionLayoutProps {
  children: React.ReactNode;
  containerClassName?: string;
  gridClassName?: string;
}

export function HeroSectionLayout({
  children,
  containerClassName = "",
  gridClassName = "",
}: HeroSectionLayoutProps) {
  return (
    <div
      className={`container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${containerClassName}`}
    >
      <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${gridClassName}`}>
        {children}
      </div>
    </div>
  );
}
