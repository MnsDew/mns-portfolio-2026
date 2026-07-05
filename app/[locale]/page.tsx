import { PortfolioShell } from "@/components/portfolio-shell";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { QualificationsSection } from "@/components/qualifications-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { CursorGlow } from "@/components/cursor-glow";
import { generateStructuredDataGraph } from "@/lib/structured-data";
import type { Locale } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "meta" });
  const structuredData = generateStructuredDataGraph({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <PortfolioShell>
        <main className="relative min-h-screen overflow-hidden scanlines">
          <CursorGlow />
          <div className="relative z-10">
            <Header />
            <HeroSection />
            <QualificationsSection />
            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
            <Footer />
          </div>
        </main>
      </PortfolioShell>
    </>
  );
}
