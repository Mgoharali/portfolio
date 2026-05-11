// src/hooks/useScrollReveal.js
//
// TWO separate systems — chosen based on content type:
//
// 1. useReveal(dep)
//    For STATIC content (hero, about, services, contact).
//    Uses IntersectionObserver — safe because these elements exist immediately.
//    dep: optional value; when it changes the hook re-observes.
//
// 2. useDataReveal(isReady)
//    For ASYNC content (skills, projects from Firebase).
//    Does NOT use IntersectionObserver at all.
//    When isReady flips true, adds "data-loaded" to the container.
//    CSS @keyframes then animates each child via animation-delay.
//    This is 100% reliable regardless of navigation timing.

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// useReveal — for static, always-present elements
// ─────────────────────────────────────────────────────────────
export function useReveal(dep = null) {
  const containerRef = useRef(null);
  const observersRef = useRef([]);

  useEffect(() => {
    // Disconnect any previous observers
    observersRef.current.forEach(o => o.disconnect());
    observersRef.current = [];

    const container = containerRef.current;
    if (!container) return;

    const raf = requestAnimationFrame(() => {
      const items = Array.from(
        container.classList.contains("reveal-item")
          ? [container]
          : container.querySelectorAll(".reveal-item")
      );
      if (items.length === 0) return;

      items.forEach((item, i) => {
        item.classList.remove("is-revealed");
        item.style.transitionDelay = `${i * 70}ms`;

        const { top, bottom } = item.getBoundingClientRect();
        if (top < window.innerHeight && bottom > 0) {
          // Already visible — add class in next frame so CSS transition fires
          requestAnimationFrame(() => item.classList.add("is-revealed"));
          return;
        }

        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              obs.unobserve(entry.target);
            }
          },
          { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
        );
        obs.observe(item);
        observersRef.current.push(obs);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      observersRef.current.forEach(o => o.disconnect());
      observersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Array.isArray(dep) ? dep.length : dep]);

  return containerRef;
}

// ─────────────────────────────────────────────────────────────
// useDataReveal — for async content (Firebase data)
//
// Usage:
//   const ref = useDataReveal(!loading && data.length > 0);
//   <div ref={ref}>
//     {data.map((item, i) => (
//       <div key={item.id} className="data-item" style={{ "--i": i }}>
//         ...
//       </div>
//     ))}
//   </div>
//
// CSS (.data-loaded .data-item) handles the animation — no JS timing issues.
// ─────────────────────────────────────────────────────────────
export function useDataReveal(isReady) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isReady) {
      // Small rAF to ensure React has painted the children first
      const raf = requestAnimationFrame(() => {
        container.classList.add("data-loaded");
      });
      return () => cancelAnimationFrame(raf);
    } else {
      container.classList.remove("data-loaded");
    }
  }, [isReady]);

  return containerRef;
}