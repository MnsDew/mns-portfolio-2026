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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <Card className="group relative flex h-[340px] w-full flex-col overflow-hidden rounded-xl border-0 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
        {gallery.map((src, index) => (
          <Image
            key={src}
            alt={project.title}
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-105",
              index === activeImage ? "opacity-100" : "opacity-0"
            )}
            fill
            src={src}
          />
        ))}
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
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        )}
        {project.badge && (
          <Badge className="absolute top-2 start-2 rounded-md bg-white/90 px-1.5 py-0.5 font-medium text-black text-xs">
            {project.badge}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <CardContent className="p-3 pt-3 pb-0">
          <h3 className="font-medium text-sm tracking-tight line-clamp-2">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-xs tracking-tight line-clamp-2 mt-1">
            {project.description}
          </p>
        </CardContent>
        <CardFooter className="mt-auto flex flex-wrap items-center gap-1 p-3 pt-2 text-xs">
          {project.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border/80 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px]"
            >
              {tag}
            </span>
          ))}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-auto flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              {project.linkLabel}
            </a>
          )}
        </CardFooter>
      </div>
    </Card>
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
    <div className="w-full py-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-medium text-lg tracking-tight md:text-xl">{title}</h2>
        <div className="flex items-center gap-1">
          <Button
            className="h-7 w-7 rounded-full"
            onClick={() => scroll("left")}
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            className="h-7 w-7 rounded-full"
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
        className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[260px] flex-none snap-start md:w-[280px]"
          >
            <ProjectCard project={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
