"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");
  const roles = t.raw("roles") as string[];
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetText = roles[currentRole] ?? "";
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < targetText.length) {
            setDisplayText(targetText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole, roles]);

  return (
    <section id="home" className="relative px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center lg:min-h-[70vh]">
          <div className="space-y-8 sm:space-y-10">
            <div className="space-y-3 animate-fade-in-up">
              <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
                {t("greeting")}
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
                {t("name")}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-medium">
                {t("role")}
              </p>
              <p className="text-base sm:text-lg">
                <span className="bg-gradient-to-l from-primary/50 to-accent text-transparent bg-clip-text typing-cursor font-semibold">
                  {displayText}
                </span>
              </p>
            </div>

            <p className="max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
              {t("tagline")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-3">
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-lg border border-primary bg-primary/10 px-7 py-4 sm:py-3.5 font-mono text-sm text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
              >
                <span className="relative z-10">{t("discoverMore")}</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-3 rounded-lg border border-border px-7 py-4 sm:py-3.5 font-mono text-sm text-muted-foreground transition-all duration-300 hover:border-foreground hover:text-foreground hover:bg-secondary/50"
              >
                <span>#contact</span>
              </a>
            </div>
          </div>

          <div
            dir="ltr"
            className="relative animate-scale-in stagger-4 mx-auto w-full max-w-lg lg:max-w-none lg:ms-auto"
          >
            <div className="relative rounded-xl border border-border bg-card/60 glass p-5 sm:p-8 hover-lift text-left">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-primary/60" />
              </div>
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 rounded-md bg-background/50 px-3 py-1 font-mono text-xs text-muted-foreground">
                terminal://mns70
              </div>

              <pre className="mt-6 overflow-x-auto font-mono text-[10px] leading-relaxed text-primary/80 sm:text-xs md:text-sm text-left [unicode-bidi:plaintext]">
                <span className="sm:hidden">{`┌───────────────────────┐
│  ███╗   ███╗███╗   ██╗███████╗
│  ████╗ ████║████╗  ██║██╔════╝
│  ██╔████╔██║██╔██╗ ██║███████╗
│  ██║╚██╔╝██║██║╚██╗██║╚════██║
│  ██║ ╚═╝ ██║██║ ╚████║███████║
│  ╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝
│  > status: online
│  > stack: full-stack
└───────────────────────┘`}</span>
                <span className="hidden sm:block">{`┌─────────────────────────────────────┐
│                                     │
│  ███╗   ███╗███╗   ██╗███████╗      │
│  ████╗ ████║████╗  ██║██╔════╝      │
│  ██╔████╔██║██╔██╗ ██║███████╗      │
│  ██║╚██╔╝██║██║╚██╗██║╚════██║      │
│  ██║ ╚═╝ ██║██║ ╚████║███████║      │
│  ╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝      │
│           MNS70                       │
│                                     │
│   > projects loaded: 12             │
│   > status: building                │
│   > locale: i18n ready              │
│                                     │
└─────────────────────────────────────┘`}</span>
              </pre>
            </div>

            <div className="absolute -right-2 sm:-right-6 -top-2 sm:-top-6 rounded-lg border border-primary/40 bg-primary/15 glass px-3 sm:px-4 py-1.5 font-mono text-[11px] sm:text-xs text-primary animate-float">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                v1.0.0
              </span>
            </div>
            <div
              className="absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-6 rounded-lg border border-border bg-card glass px-3 sm:px-4 py-1.5 font-mono text-[11px] sm:text-xs text-muted-foreground animate-float"
              style={{ animationDelay: "1s" }}
            >
              2026
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-primary/5 blur-3xl" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-fade-in stagger-6">
        <span className="font-mono text-xs text-muted-foreground">scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
