"use client";
import { useEffect } from "react";
const MOBILE_WIDTH = 450;
const DEFAULT_VIEWPORT_WIDTH = 1440;

export default function useViewportUnits() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const docEl = document.documentElement;
    let rafId = 0 as number | 0;

    const calculateAndSet = () => {
      console.log("CalculateAndSet");
      // Use visualViewport when available to account for mobile UI chrome
      let vv = window.visualViewport;
      let width = window.innerWidth;
      let height = window.innerHeight;
      if (width < MOBILE_WIDTH) {
        width = DEFAULT_VIEWPORT_WIDTH;
      }

      const vw = width * 0.01;
      const vh = height * 0.01;
      docEl.style.setProperty("--vw", `${vw}px`);
      docEl.style.setProperty("--vh", `${vh}px`);
    };

    const schedule = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(calculateAndSet) as unknown as number;
    };

    // Initial set
    schedule();

    // Events to listen to
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule, { passive: true });
    window.addEventListener("pageshow", schedule, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", schedule, {
        passive: true,
      });
      window.visualViewport.addEventListener("scroll", schedule, {
        passive: true,
      });
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", schedule as EventListener);
      window.removeEventListener(
        "orientationchange",
        schedule as EventListener
      );
      window.removeEventListener("pageshow", schedule as EventListener);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          schedule as EventListener
        );
        window.visualViewport.removeEventListener(
          "scroll",
          schedule as EventListener
        );
      }
    };
  }, []);
}
