"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { contactLinks } from "@/data/contacts";
import { GlobeContact } from "@/components/globe-contact";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactSchema } from "@/lib/contact-schema";
import { getPublicEmailJsConfig, isEmailJsConfigured } from "@/lib/emailjs-config";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
};

const CLIENT_COOLDOWN_MS = 60_000;
const LAST_SENT_KEY = "mns70_contact_last_sent";

export function ContactSection() {
  const t = useTranslations("contact");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const lastSent = sessionStorage.getItem(LAST_SENT_KEY);
    if (lastSent && Date.now() - Number(lastSent) < CLIENT_COOLDOWN_MS) {
      toast.error(t("form.tooFast"));
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const website = String(formData.get("website") ?? "");
    if (website) {
      toast.success(t("form.success"));
      form.reset();
      return;
    }

    if (!isEmailJsConfigured()) {
      toast.error(t("form.notConfigured"));
      return;
    }

    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    });

    if (!parsed.success) {
      toast.error(t("form.error"));
      return;
    }

    const { serviceId, templateId, publicKey } = getPublicEmailJsConfig();

    setLoading(true);

    try {
      await emailjs.sendForm(serviceId, templateId, form, { publicKey });

      sessionStorage.setItem(LAST_SENT_KEY, String(Date.now()));
      toast.success(t("form.success"));
      form.reset();
    } catch {
      toast.error(t("form.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="scroll-reveal px-4 sm:px-6 py-20 sm:py-28 border-t border-border/30"
    >
      <div className="mx-auto max-w-7xl">
        <div className="scroll-reveal-stagger mb-8 space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            className="scroll-reveal-stagger space-y-6"
            style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
          >
            <div className="rounded-xl border border-border bg-card/40 glass p-4 sm:p-6">
              <GlobeContact />
            </div>

            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("findMe")}
            </p>
            <div className="space-y-2">
              {contactLinks.map((link) => {
                const Icon = iconMap[link.icon];
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target={link.icon !== "email" ? "_blank" : undefined}
                    rel={link.icon !== "email" ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-xl border border-transparent p-4 transition-all hover:border-border/50 hover:bg-card/50 glass"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    <span className="font-mono text-sm font-medium">
                      {t(link.labelKey)}
                    </span>
                    {link.icon !== "email" && (
                      <ExternalLink className="ms-auto h-3 w-3 opacity-0 group-hover:opacity-100" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <div
            id="contact-form"
            className="scroll-reveal-stagger rounded-xl border border-border bg-card/40 glass p-6 sm:p-8"
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            <form ref={formRef} onSubmit={sendEmail} className="relative space-y-4">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <Input
                name="name"
                placeholder={t("form.name")}
                required
                minLength={2}
                maxLength={80}
                className="font-mono"
              />
              <Input
                name="email"
                type="email"
                placeholder={t("form.email")}
                required
                maxLength={120}
                className="font-mono"
              />
              <textarea
                name="message"
                placeholder={t("form.message")}
                required
                minLength={10}
                maxLength={2000}
                rows={8}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full font-mono"
                size="lg"
              >
                {loading ? t("form.sending") : t("form.send")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
