"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import {
  projects,
  projectCategories,
  type ProjectCategory,
} from "@/data/projects";
import { ProjectCarousel } from "@/components/kokonutui/carousel-cards";

export function ProjectsSection() {
  const t = useTranslations("projects");
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">(
    "all"
  );

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(activeFilter));

  const featuredProjects = projects.filter((p) => p.featured);
  const carouselItems = featuredProjects.map((p) => ({
    id: p.id,
    title: t(p.titleKey),
    description: t(p.descriptionKey),
    image: p.image,
    images: p.images,
    badge: t("featured"),
    tags: p.tags,
    href: p.links[0]?.url,
    linkLabel: p.links[0] ? t(`links.${p.links[0].labelKey}`) : undefined,
  }));

  return (
    <section
      id="projects"
      className="scroll-reveal px-4 sm:px-6 py-20 sm:py-28 border-t border-border/30"
    >
      <div className="mx-auto max-w-7xl">
        <div className="scroll-reveal-stagger mb-10 sm:mb-14 space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div
          className="scroll-reveal-stagger"
          style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
        >
          <ProjectCarousel title={t("featured")} items={carouselItems} />
        </div>

        <div
          className="scroll-reveal-stagger mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-wrap"
          style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
        >
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "shrink-0 rounded-lg border px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all",
              activeFilter === "all"
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/50"
            )}
          >
            {t("filters.all")}
          </button>
          {projectCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "shrink-0 rounded-lg border px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all",
                activeFilter === cat
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/50"
              )}
            >
              {t(`filters.${cat}`)}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <article
              key={project.id}
              className={cn(
                "scroll-reveal-stagger group relative overflow-hidden rounded-xl border bg-card/40 p-6 glass transition-all duration-400 hover-lift hover:border-primary/40",
                project.featured &&
                  "sm:col-span-2 lg:col-span-2 border-primary/30 bg-gradient-to-br from-primary/8 via-card/50 to-primary/8"
              )}
              style={
                {
                  "--reveal-delay": `${(index % 6) * 50 + 140}ms`,
                } as React.CSSProperties
              }
            >
              <div className="relative mb-4 aspect-video overflow-hidden rounded-lg border border-border/50">
                <Image
                  src={project.image}
                  alt={t(project.titleKey)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {project.featured && (
                  <span className="absolute bottom-3 start-3 z-10 font-mono text-[10px] uppercase text-primary">
                    {t("featured")}
                  </span>
                )}
              </div>

              <h3
                className={cn(
                  "mb-2 font-bold tracking-tight transition-colors group-hover:text-primary",
                  project.featured ? "text-xl" : "text-lg"
                )}
              >
                {t(project.titleKey)}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                {t(project.descriptionKey)}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border/80 bg-secondary/60 px-2 py-1 font-mono text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t(`links.${link.labelKey}`)}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-xs text-muted-foreground">
          {t("showing", { count: filtered.length, total: projects.length })}
        </p>
      </div>
    </section>
  );
}
