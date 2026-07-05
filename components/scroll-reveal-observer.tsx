"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".scroll-reveal";

function scrollOffsetPx(): number {
  const raw =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--scroll-offset")
      .trim() || "5.5rem";
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  if (raw.endsWith("px")) {
    return parseFloat(raw);
  }
  if (raw.endsWith("rem")) {
    return parseFloat(raw) * rootFontSize;
  }

  return 5.5 * rootFontSize;
}

function isInRevealZone(el: Element, headerOffset: number): boolean {
  const rect = el.getBoundingClientRect();
  const viewHeight = window.innerHeight;
  return rect.top < viewHeight * 0.94 && rect.bottom > headerOffset;
}

export function ScrollRevealObserver() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealed = new WeakSet<Element>();

    const reveal = (el: Element) => {
      if (revealed.has(el)) return;
      revealed.add(el);
      el.classList.add("is-visible");
    };

    const revealFromHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (target?.classList.contains("scroll-reveal")) {
        reveal(target);
      }
    };

    const setup = () => {
      const elements = document.querySelectorAll(REVEAL_SELECTOR);
      if (!elements.length) return () => {};

      if (media.matches) {
        elements.forEach(reveal);
        return () => {};
      }

      const headerOffset = Math.round(scrollOffsetPx());

      elements.forEach((el) => {
        if (isInRevealZone(el, headerOffset)) {
          reveal(el);
        }
      });

      revealFromHash();

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal(entry.target);
              observer.unobserve(entry.target);
            }
          }
        },
        {
          threshold: 0,
          rootMargin: `0px 0px -5% 0px`,
        }
      );

      elements.forEach((el) => {
        if (!revealed.has(el)) {
          observer.observe(el);
        }
      });

      const onAnchorClick = (event: MouseEvent) => {
        const anchor = (event.target as Element).closest('a[href^="#"]');
        if (!anchor) return;

        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;

        const target = document.querySelector(id);
        if (target?.classList.contains("scroll-reveal")) {
          reveal(target);
        }
      };

      const onScrollEnd = () => {
        elements.forEach((el) => {
          if (!revealed.has(el) && isInRevealZone(el, headerOffset)) {
            reveal(el);
          }
        });
      };

      document.addEventListener("click", onAnchorClick, true);
      window.addEventListener("hashchange", revealFromHash);
      window.addEventListener("scrollend", onScrollEnd, { passive: true });

      return () => {
        observer.disconnect();
        document.removeEventListener("click", onAnchorClick, true);
        window.removeEventListener("hashchange", revealFromHash);
        window.removeEventListener("scrollend", onScrollEnd);
      };
    };

    let cleanup = setup();

    const onMotionChange = () => {
      cleanup();
      cleanup = setup();
    };
    media.addEventListener("change", onMotionChange);

    return () => {
      cleanup();
      media.removeEventListener("change", onMotionChange);
    };
  }, []);

  return null;
}
