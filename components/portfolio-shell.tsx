"use client";

import { PageLoader } from "@/components/page-loader";
import { InteractiveDotBackground } from "@/components/interactive-dot-background";

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  return (
    <PageLoader>
      <InteractiveDotBackground />
      {children}
    </PageLoader>
  );
}
