import { getTranslations } from "next-intl/server";
import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { contactLinks, siteConfig } from "@/data/contacts";

export async function Footer() {
  const t = await getTranslations("footer");
  const tContact = await getTranslations("contact");

  return (
    <footer className="border-t border-border/30 px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>{t("crafted")}</span>
            <Heart className="h-3.5 w-3.5 text-destructive animate-pulse" />
            <span>{t("and")}</span>
          </div>

          <div className="flex items-center gap-4">
            {contactLinks.map((link) => {
              const Icon =
                link.icon === "github"
                  ? Github
                  : link.icon === "linkedin"
                    ? Linkedin
                    : Mail;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.icon !== "email" ? "_blank" : undefined}
                  rel={link.icon !== "email" ? "noopener noreferrer" : undefined}
                  aria-label={tContact(link.labelKey)}
                  className="text-muted-foreground/50 transition-all hover:text-primary hover:scale-110"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          <p className="font-mono text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} {siteConfig.fullName} — {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
