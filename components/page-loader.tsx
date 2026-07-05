"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import loaderAnimation from "@/public/ChasquidoQik.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface PageLoaderProps {
  children: React.ReactNode;
}

export function PageLoader({ children }: PageLoaderProps) {
  const t = useTranslations("loader");
  const [isLoading, setIsLoading] = useState(true);
  const [animDone, setAnimDone] = useState(false);

  const lottieFilter = useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    const saturate = (1.1 + Math.random() * 0.6).toFixed(2);
    const brightness = (0.95 + Math.random() * 0.15).toFixed(2);
    return `hue-rotate(${hue}deg) saturate(${saturate}) brightness(${brightness})`;
  }, []);

  useEffect(() => {
    if (animDone) {
      const fade = setTimeout(() => setIsLoading(false), 350);
      return () => clearTimeout(fade);
    }
  }, [animDone]);

  useEffect(() => {
    const fallback = setTimeout(() => setAnimDone(true), 2500);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500",
          isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex flex-col items-center gap-5 px-6 text-center">
          <Lottie
            animationData={loaderAnimation}
            loop={false}
            onComplete={() => setAnimDone(true)}
            className="h-32 w-32 sm:h-40 sm:w-40 [&_path]:fill-primary [&_ellipse]:fill-primary"
            style={{ filter: lottieFilter }}
          />

          <div className="space-y-1.5 animate-fade-in">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("name")}
            </h2>
            <p className="text-sm font-medium text-primary sm:text-base">
              {t("role")}
            </p>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
