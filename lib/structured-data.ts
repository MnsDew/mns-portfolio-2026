import type { Locale } from "@/i18n/routing";
import { siteConfig } from "@/data/contacts";
import { getOgImageUrl } from "@/lib/seo";

interface StructuredDataInput {
  locale: Locale;
  title: string;
  description: string;
}

export function generateStructuredDataGraph({
  locale,
  title,
  description,
}: StructuredDataInput) {
  const pageUrl = `${siteConfig.url}/${locale}`;
  const websiteId = `${siteConfig.url}/#website`;
  const personId = `${siteConfig.url}/#person`;
  const webpageId = `${pageUrl}#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.handle,
        description,
        url: siteConfig.url,
        inLanguage: [locale, "en", "ar", "tr"],
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.fullName,
        alternateName: siteConfig.handle,
        url: siteConfig.url,
        image: getOgImageUrl(),
        email: siteConfig.email,
        jobTitle: "Software Engineer & Full-Stack Developer",
        knowsLanguage: ["en", "ar", "tr"],
        sameAs: [
          "https://github.com/MnsDew",
          "https://www.linkedin.com/in/mg-mns-coding/",
        ],
        worksFor: {
          "@type": "Organization",
          name: siteConfig.handle,
        },
        workLocation: {
          "@type": "Place",
          name: locale === "ar" ? "إسطنبول، تركيا" : "Istanbul, Turkey",
        },
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: pageUrl,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: getOgImageUrl(),
          width: 1500,
          height: 1500,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profile`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: locale,
        mainEntity: { "@id": personId },
      },
    ],
  };
}
