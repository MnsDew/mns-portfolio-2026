"use client";

/**
 * @author: @dorianbaffier
 * @description: Feature grid with aurora ambient, magnetic 3D tilt, and focus-dim siblings.
 * @version: 2.0.0
 * @date: 2025-02-20
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import type { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TILT_MAX = 9;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

export interface SpotlightItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface CardProps {
  item: SpotlightItem;
  dimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function Card({ item, dimmed, onHoverStart, onHoverEnd }: CardProps) {
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);
  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width);
    normY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={cardRef}
      animate={{ scale: dimmed ? 0.96 : 1, opacity: dimmed ? 0.5 : 1 }}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6",
        "border-border/60 bg-card/40 glass shadow-sm",
        "dark:border-white/8 dark:bg-card/30",
        "transition-[border-color] duration-300 hover:border-border dark:hover:border-white/14"
      )}
      onMouseEnter={() => {
        glowOpacity.set(1);
        onHoverStart();
      }}
      onMouseLeave={() => {
        normX.set(0.5);
        normY.set(0.5);
        glowOpacity.set(0);
        onHoverEnd();
      }}
      onMouseMove={handleMouseMove}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}14, transparent 65%)`,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}2e, transparent 65%)`,
        }}
      />
      <div
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: `${item.color}18`,
          boxShadow: `inset 0 0 0 1px ${item.color}30`,
        }}
      >
        <Icon size={17} strokeWidth={1.9} style={{ color: item.color }} />
      </div>
      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="font-semibold text-[14px] text-foreground tracking-tight">
          {item.title}
        </h3>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}80, transparent)`,
        }}
      />
    </motion.div>
  );
}

export interface SpotlightCardsProps {
  items: SpotlightItem[];
  eyebrow?: string;
  heading?: string;
  className?: string;
}

export default function SpotlightCards({
  items,
  eyebrow = "Experience",
  heading = "Qualifications",
  className,
}: SpotlightCardsProps) {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative mb-8 flex flex-col gap-1.5">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          {heading}
        </h2>
      </div>
      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.title}
            item={item}
            dimmed={hoveredTitle !== null && hoveredTitle !== item.title}
            onHoverStart={() => setHoveredTitle(item.title)}
            onHoverEnd={() => setHoveredTitle(null)}
          />
        ))}
      </div>
    </div>
  );
}
