"use client";

import { useTranslations } from "next-intl";
import { qualifications } from "@/data/qualifications";
import SpotlightCards from "@/components/kokonutui/spotlight-cards";

export function QualificationsSection() {
  const t = useTranslations("qualifications");

  const items = qualifications.map((q) => ({
    icon: q.icon,
    title: t(q.titleKey),
    description: `${t(q.roleKey)} · ${t(q.organizationKey)} · ${t(q.locationKey)}`,
    color: q.color,
  }));

  return (
    <section id="qualifications" className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-7xl">
        <SpotlightCards
          items={items}
          eyebrow={t("eyebrow")}
          heading={t("heading")}
        />
      </div>
    </section>
  );
}
