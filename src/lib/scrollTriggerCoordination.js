import { ScrollTrigger } from "gsap/ScrollTrigger";

let scheduledRaf = null;

/**
 * Safely schedules a single ScrollTrigger.refresh() on the next animation frame.
 * Debounces rapid or duplicate calls across route transitions, resize events, and
 * dynamic mounts to prevent synchronous forced reflows.
 */
export function scheduleScrollTriggerRefresh() {
  if (typeof window === "undefined") return;

  if (scheduledRaf !== null) {
    cancelAnimationFrame(scheduledRaf);
  }

  scheduledRaf = requestAnimationFrame(() => {
    scheduledRaf = null;
    ScrollTrigger.refresh();
  });
}
