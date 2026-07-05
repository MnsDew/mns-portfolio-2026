"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoFeature = any;

function interpolateProjection(raw0: any, raw1: any) {
  const mutate: any = d3.geoProjectionMutator((t: number) => (x: number, y: number) => {
    const [x0, y0] = raw0(x, y);
    const [x1, y1] = raw1(x, y);
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
  });
  let t = 0;
  return Object.assign((mutate as any)(t), {
    alpha(_: number) {
      return arguments.length ? (mutate as any)((t = +_)) : t;
    },
  });
}

export function GlobeContact({ className }: { className?: string }) {
  const t = useTranslations("contact.globe");
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [worldData, setWorldData] = useState<GeoFeature[]>([]);
  const [rotation, setRotation] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointer, setLastPointer] = useState([0, 0]);

  const width = 800;
  const height = 460;

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((world: any) => {
        const countries = feature(world, world.objects.countries).features;
        setWorldData(countries);
      })
      .catch(() => setWorldData([]));
  }, []);

  const updatePointer = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const current = [clientX - rect.left, clientY - rect.top];
    const dx = current[0] - lastPointer[0];
    const dy = current[1] - lastPointer[1];
    const prog = progress[0] / 100;
    const sensitivity = prog < 0.5 ? 0.5 : 0.25;
    setRotation((prev) => [
      prev[0] + dx * sensitivity,
      Math.max(-90, Math.min(90, prev[1] - dy * sensitivity)),
    ]);
    setLastPointer(current);
  };

  useEffect(() => {
    if (!svgRef.current || worldData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const alpha = Math.pow(progress[0] / 100, 0.5);
    const scale = d3.scaleLinear().domain([0, 1]).range([200, 120]);
    const radius = scale(alpha);
    const isGlobe = alpha < 0.45;

    const projection = interpolateProjection(
      d3.geoOrthographicRaw,
      d3.geoEquirectangularRaw
    )
      .scale(radius)
      .translate([width / 2, height / 2])
      .rotate([rotation[0], rotation[1]])
      .precision(isGlobe ? 0.05 : 0.1);

    projection.alpha(alpha);
    const path = d3.geoPath(projection);

    if (isGlobe) {
      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "globe-clip")
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", radius);
    }

    const mapLayer = isGlobe
      ? svg.append("g").attr("clip-path", "url(#globe-clip)")
      : svg;

    // Graticule only when unrolled — meridians cause a visible center seam on the globe
    if (!isGlobe) {
      try {
        const graticule = d3.geoGraticule();
        mapLayer
          .append("path")
          .datum(graticule())
          .attr("d", path(graticule()) ?? "")
          .attr("fill", "none")
          .attr("stroke", "currentColor")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.2)
          .attr("class", "text-border");
      } catch {
        /* ignore */
      }
    }

    mapLayer
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country text-muted-foreground")
      .attr("d", (d) => {
        try {
          return path(d) ?? "";
        } catch {
          return "";
        }
      })
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 0.8);

    if (isGlobe) {
      svg
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 1)
        .attr("class", "text-foreground/40");
    } else {
      try {
        const sphereOutline = path({ type: "Sphere" });
        if (sphereOutline) {
          svg
            .append("path")
            .datum({ type: "Sphere" })
            .attr("d", sphereOutline)
            .attr("fill", "none")
            .attr("stroke", "currentColor")
            .attr("stroke-width", 1)
            .attr("class", "text-foreground/40");
        }
      } catch {
        /* ignore */
      }
    }
  }, [worldData, progress, rotation]);

  const toggleGlobe = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const start = progress[0];
    const end = start === 0 ? 100 : 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setProgress([start + (end - start) * eased]);
      if (t < 1) requestAnimationFrame(animate);
      else setIsAnimating(false);
    };
    animate();
  };

  return (
    <div className={cn("relative w-full", className)}>
      <p className="mb-3 font-mono text-xs text-muted-foreground">{t("hint")}</p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none rounded-xl border border-border bg-card/30 cursor-grab active:cursor-grabbing"
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={(e) => {
          setIsDragging(true);
          const rect = svgRef.current?.getBoundingClientRect();
          if (rect) setLastPointer([e.clientX - rect.left, e.clientY - rect.top]);
        }}
        onMouseMove={(e) => {
          if (!isDragging) return;
          updatePointer(e.clientX, e.clientY);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (!touch) return;
          setIsDragging(true);
          const rect = svgRef.current?.getBoundingClientRect();
          if (rect) setLastPointer([touch.clientX - rect.left, touch.clientY - rect.top]);
        }}
        onTouchMove={(e) => {
          if (!isDragging) return;
          const touch = e.touches[0];
          if (touch) updatePointer(touch.clientX, touch.clientY);
        }}
        onTouchEnd={() => setIsDragging(false)}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={toggleGlobe}
          disabled={isAnimating}
          className="font-mono text-xs"
        >
          {isAnimating
            ? t("animating")
            : progress[0] === 0
              ? t("unroll")
              : t("roll")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="font-mono text-xs"
          onClick={() => setRotation([0, 0])}
        >
          {t("reset")}
        </Button>
      </div>
    </div>
  );
}
