"use client";

import { PageLoader } from "@/components/page-loader";
import { InteractiveDotBackground } from "@/components/interactive-dot-background";
import { ScrollRevealObserver } from "@/components/scroll-reveal-observer";

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  return (
    <PageLoader>
      <ScrollRevealObserver />
      <InteractiveDotBackground />
      {children}
    </PageLoader>
  );
}
