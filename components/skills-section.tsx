"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { skills, type Skill } from "@/data/skills";

export function SkillsSection() {
  const t = useTranslations("skills");
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  return (
    <section id="skills" className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 sm:mb-10 space-y-3 text-center animate-fade-in-up">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div
          className={cn(
            "mx-auto mb-8 max-w-xl rounded-xl border p-5 text-center transition-all duration-300",
            activeSkill
              ? "border-primary/40 bg-primary/5 glass"
              : "border-dashed border-border/60 bg-card/20"
          )}
        >
          {activeSkill ? (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-card/60">
                <Image
                  src={activeSkill.image}
                  alt={activeSkill.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">{activeSkill.name}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-primary">
                  {t(`categories.${activeSkill.category}`)}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`categoryDesc.${activeSkill.category}`)}
              </p>
            </div>
          ) : (
            <p className="font-mono text-sm text-muted-foreground">
              {t("selectHint")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {skills.map((skill, index) => {
            const isActive = activeSkill?.id === skill.id;
            return (
              <button
                key={skill.id}
                type="button"
                aria-pressed={isActive}
                aria-label={skill.name}
                onClick={() =>
                  setActiveSkill(isActive ? null : skill)
                }
                className={cn(
                  "group flex flex-col items-center gap-2 transition-all duration-300 animate-fade-in-up",
                  isActive && "scale-105"
                )}
                style={{ animationDelay: `${(index % 12) * 50}ms` }}
              >
                <div
                  className={cn(
                    "relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 transition-all duration-300",
                    "bg-card/60 glass",
                    isActive
                      ? "border-primary shadow-lg shadow-primary/30"
                      : "border-primary/30 hover:border-primary hover:shadow-md hover:shadow-primary/20"
                  )}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={skill.image}
                    alt=""
                    width={36}
                    height={36}
                    className="relative z-10 object-contain"
                  />
                </div>
                <span
                  className={cn(
                    "max-w-[5rem] truncate rounded-md px-2 py-0.5 font-mono text-[10px] sm:text-xs",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary/60 text-muted-foreground"
                  )}
                >
                  {skill.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
