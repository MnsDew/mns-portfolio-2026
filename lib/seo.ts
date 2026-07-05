import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/data/contacts";

const OG_IMAGE_PATH = "/logo-black.png";
const OG_IMAGE_WIDTH = 1500;
const OG_IMAGE_HEIGHT = 1500;

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_SA",
  tr: "tr_TR",
};

export function getOgLocale(locale: Locale): string {
  return OG_LOCALE_MAP[locale] ?? "en_US";
}

export function getAlternateOgLocales(locale: Locale): string[] {
  return routing.locales
    .filter((loc) => loc !== locale)
    .map((loc) => getOgLocale(loc));
}

export function buildLanguageAlternates(): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${siteConfig.url}/${loc}`])
  ) as Record<string, string>;

  languages["x-default"] = `${siteConfig.url}/${routing.defaultLocale}`;

  return languages;
}

export function getOgImageUrl(): string {
  return new URL(OG_IMAGE_PATH, siteConfig.url).toString();
}

interface PageMetaInput {
  locale: Locale;
  title: string;
  description: string;
  keywords?: string[];
}

export function buildPageMetadata({
  locale,
  title,
  description,
  keywords = [],
}: PageMetaInput): Metadata {
  const canonical = `${siteConfig.url}/${locale}`;
  const ogImageUrl = getOgImageUrl();
  const languages = buildLanguageAlternates();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.handle}`,
    },
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    applicationName: siteConfig.handle,
    authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
    creator: siteConfig.fullName,
    publisher: siteConfig.fullName,
    category: "technology",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      locale: getOgLocale(locale),
      alternateLocale: getAlternateOgLocales(locale),
      url: canonical,
      title,
      description,
      siteName: siteConfig.handle,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
    other: {
      "og:site_name": siteConfig.handle,
    },
  };
}
