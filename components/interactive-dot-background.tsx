"use client";

/**
 * Canvas dot field — KokonutUI-style: zinc dots, breathe, proximity glow, repulsion.
 */

import { useEffect, useRef } from "react";

const DOT_RADIUS = 1; // 2px diameter
const REPULSION_RADIUS = 80;
const REPULSION_STRENGTH = 20;
const PROXIMITY_RADIUS = 96;
const GLOW_RADIUS = 140;

interface Dot {
  baseX: number;
  baseY: number;
  opacity: number;
  phase: number;
}

function spacingForViewport(width: number, height: number): number {
  const area = width * height;
  if (area > 2_500_000) return 24;
  if (area > 1_400_000) return 20;
  return 16;
}

function generateDots(width: number, height: number, spacing: number): Dot[] {
  const dots: Dot[] = [];
  const baseOpacities = [0.4, 0.55, 0.7];

  for (let row = 0, y = 0; y <= height; row++, y += spacing) {
    for (let col = 0, x = 0; x <= width; col++, x += spacing) {
      const pattern = (row + col) % 3;
      dots.push({
        baseX: x,
        baseY: y,
        opacity: baseOpacities[pattern],
        phase: (x + y) * 0.02,
      });
    }
  }

  return dots;
}

export function InteractiveDotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const spacingRef = useRef(16);
  const pointerRef = useRef({
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
  });
  const rafRef = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spacingRef.current = spacingForViewport(w, h);
      dotsRef.current = generateDots(w, h, spacingRef.current);
    };

    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const isDark = document.documentElement.classList.contains("dark");
      // zinc-400 (light) / zinc-600 (dark) — matches KokonutUI
      const dotRgb = isDark ? "82, 82, 91" : "161, 161, 170";
      const hasPointer = Number.isFinite(px) && Number.isFinite(py);

      // Soft ambient light pool under cursor / finger
      if (hasPointer) {
        const glow = ctx.createRadialGradient(
          px,
          py,
          0,
          px,
          py,
          GLOW_RADIUS
        );
        glow.addColorStop(0, `rgba(${dotRgb}, ${isDark ? 0.14 : 0.22})`);
        glow.addColorStop(0.45, `rgba(${dotRgb}, ${isDark ? 0.05 : 0.08})`);
        glow.addColorStop(1, `rgba(${dotRgb}, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      for (const dot of dotsRef.current) {
        let ox = 0;
        let oy = 0;
        let opacity = dot.opacity;
        let radius = DOT_RADIUS;

        if (hasPointer) {
          const dx = dot.baseX - px;
          const dy = dot.baseY - py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPULSION_RADIUS) {
            const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
            const angle = Math.atan2(dy, dx);
            ox = Math.cos(angle) * force;
            oy = Math.sin(angle) * force;
          }

          if (dist < PROXIMITY_RADIUS) {
            const t = 1 - dist / PROXIMITY_RADIUS;
            opacity = Math.min(1, opacity + t * 0.85);
            radius = DOT_RADIUS * (1 + t * 0.6);
          }
        }

        if (!reducedMotion) {
          const breathe = 0.5 + 0.5 * Math.sin(time * 0.0015 + dot.phase);
          opacity *= 0.55 + 0.45 * breathe;
        }

        // Light mode needs a touch more punch on pale backgrounds
        if (!isDark) opacity = Math.min(1, opacity * 1.2);

        ctx.fillStyle = `rgba(${dotRgb}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(dot.baseX + ox, dot.baseY + oy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    rafRef.current = requestAnimationFrame(draw);

    const setPointer = (x: number, y: number) => {
      pointerRef.current = { x, y };
    };

    const onMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    };
    const onLeave = () => {
      pointerRef.current = {
        x: Number.POSITIVE_INFINITY,
        y: Number.POSITIVE_INFINITY,
      };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-1"
    />
  );
}
