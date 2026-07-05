"use client";

import { useState, useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ThemeChanger } from "./theme-changer";
import { Link } from "@/i18n/navigation";
import { contactLinks } from "@/data/contacts";
import { locales, type Locale } from "@/i18n/routing";
import Image from "next/image";

const navItems = [
  { labelKey: "home", href: "#home" },
  { labelKey: "qualifications", href: "#qualifications" },
  { labelKey: "projects", href: "#projects" },
  { labelKey: "skills", href: "#skills" },
  { labelKey: "contact", href: "#contact" },
] as const;

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
};

export function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tLang = useTranslations("language");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const switchLocale = (newLocale: Locale) => {
    window.location.href = `/${newLocale}${pathname === "/" ? "" : pathname}`;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isMobileMenuOpen &&
          "max-md:rounded-b-3xl max-md:border-b max-md:border-border/20 max-md:bg-background/95 max-md:backdrop-blur-2xl max-md:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.55)]",
        isScrolled && !isMobileMenuOpen
          ? "border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm"
          : !isMobileMenuOpen && "bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6 py-4",
          isMobileMenuOpen && "max-md:pb-6"
        )}
      >
        <nav className="flex items-center justify-between">
          <a href="#home" className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-primary/50 bg-primary/10 transition-all duration-400 group-hover:border-primary group-hover:scale-105">
              <Image
                src="/logo-black.png"
                alt={tBrand("name")}
                width={36}
                height={36}
                className="object-contain dark:invert"
              />
            </div>
            <span className="font-mono text-sm tracking-tight">
              {tBrand("prefix") ? (
                <span className="text-muted-foreground me-1 text-xs">
                  {tBrand("prefix")}
                </span>
              ) : null}
              {tBrand("name")}
              <span className="text-primary font-semibold ms-1">
                {tBrand("surname")}
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item, index) => (
              <a
                key={item.labelKey}
                href={item.href}
                className={cn(
                  "relative px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-300 rounded-lg",
                  "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  hoveredIndex === index && "text-foreground"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className={cn(
                    "absolute start-1.5 text-primary transition-all duration-200",
                    hoveredIndex === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 rtl:translate-x-2"
                  )}
                >
                  {">"}
                </span>
                <span
                  className={cn(
                    "transition-transform duration-200",
                    hoveredIndex === index && "translate-x-2 rtl:-translate-x-2"
                  )}
                >
                  {t(item.labelKey)}
                </span>
              </a>
            ))}
            <div className="ms-2 flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex h-9 items-center gap-1 rounded-lg px-2 font-mono text-xs uppercase text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label="Change language"
                >
                  {locale}
                </button>
                {langOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLangOpen(false)}
                    />
                    <div className="absolute end-0 top-12 z-50 min-w-32 rounded-lg border border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl">
                      {locales.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            switchLocale(loc);
                            setLangOpen(false);
                          }}
                          className={cn(
                            "w-full rounded-md px-3 py-2 text-start font-mono text-xs transition-colors hover:bg-secondary",
                            locale === loc && "bg-primary/10 text-primary"
                          )}
                        >
                          {tLang(loc)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <ThemeChanger />
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1 sm:flex">
              {contactLinks
                .filter((l) => l.icon !== "email")
                .map((link) => {
                  const Icon = socialIcons[link.icon as "github" | "linkedin"];
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.id}
                      className="group relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:text-primary hover:bg-primary/10"
                    >
                      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 md:hidden"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-5">
                <span
                  className={cn(
                    "h-0.5 bg-foreground transition-all duration-300 origin-center",
                    isMobileMenuOpen ? "w-5 translate-y-2 rotate-45" : "w-5"
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 w-3.5 bg-foreground transition-all duration-300",
                    isMobileMenuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 bg-foreground transition-all duration-300 origin-center",
                    isMobileMenuOpen ? "w-5 -translate-y-2 -rotate-45" : "w-5"
                  )}
                />
              </div>
            </button>
          </div>
        </nav>

        <div
          className={cn(
            "transition-all duration-400 ease-in-out md:hidden",
            isMobileMenuOpen
              ? "max-h-[32rem] opacity-100 pt-3"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="mx-2 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

          <div className="flex flex-col gap-1.5 px-1 pt-4">
            {navItems.map((item) => (
              <a
                key={item.labelKey}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              >
                <span className="text-primary">{">"}</span>
                {t(item.labelKey)}
              </a>
            ))}

            <div className="mx-3 my-3 h-px bg-gradient-to-r from-transparent via-border/35 to-transparent" />

            <div className="flex flex-wrap items-center gap-2 px-3 pb-1">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    "rounded-full border px-3 py-2 font-mono text-xs transition-colors",
                    locale === loc
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/40 text-muted-foreground hover:border-border/70"
                  )}
                >
                  {tLang(loc)}
                </button>
              ))}
              <ThemeChanger />
              <ThemeToggle />
            </div>
          </div>

          <div className="pointer-events-none mx-4 mt-4 h-8 rounded-b-2xl bg-gradient-to-b from-transparent to-primary/5" />
        </div>
      </div>
    </header>
  );
}
