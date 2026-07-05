"use client";

/**
 * @author: @dorianbaffier
 * @description: Carousel Cards
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CarouselProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  badge?: string;
  tags?: string[];
  href?: string;
  linkLabel?: string;
}

interface ProjectCarouselProps {
  title: string;
  items: CarouselProjectItem[];
}

function ProjectCard({ project }: { project: CarouselProjectItem }) {
  const gallery = project.images?.length ? project.images : [project.image];
  const [activeImage, setActiveImage] = useState(0);

  return (
    <article className="group relative flex h-[360px] w-full flex-col overflow-hidden rounded-xl border border-primary/25 bg-card/50 glass shadow-[0_0_40px_-12px_hsl(var(--primary)/0.35)] transition-all duration-300 hover:border-primary/45 hover:shadow-[0_0_48px_-10px_hsl(var(--primary)/0.45)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {gallery.map((src, index) => (
          <Image
            key={src}
            alt={project.title}
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-[1.03]",
              index === activeImage ? "opacity-100" : "opacity-0"
            )}
            fill
            src={src}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        {project.badge && (
          <span className="absolute bottom-3 start-3 z-10 font-mono text-[10px] uppercase text-primary">
            {project.badge}
          </span>
        )}
        {gallery.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {gallery.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === activeImage
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-primary/40 hover:bg-primary/70"
                )}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground line-clamp-2">
            {project.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          {project.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border/80 bg-secondary/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-auto flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              {project.linkLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectCarousel({ title, items }: ProjectCarouselProps) {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollContainer.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative w-full rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/30 to-transparent p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-primary md:text-base">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            className="h-8 w-8 rounded-full border-primary/30 bg-card/60"
            onClick={() => scroll("left")}
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 rounded-full border-primary/30 bg-card/60"
            onClick={() => scroll("right")}
            size="icon"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollContainer}
        className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[280px] flex-none snap-start md:w-[300px]"
          >
            <ProjectCard project={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
