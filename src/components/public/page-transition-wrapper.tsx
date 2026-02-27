"use client";

import { PageTransition } from "@/components/ui/page-transition";
import { ReactNode } from "react";

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
