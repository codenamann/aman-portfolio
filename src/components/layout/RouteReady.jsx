"use client";

import { useEffect, useRef } from "react";
import { usePageTransition } from "./PageTransition";

/**
 * RouteReady Component
 *
 * Deterministic route-readiness signaling component.
 * Placed within the actual critical content boundary of destination pages (e.g. /, /projects).
 *
 * Upon mounting in React 19's commit phase (after critical server data has resolved
 * and DOM elements are rendered), it immediately notifies the transition controller
 * that the destination route is ready to be revealed.
 */
export default function RouteReady({ routePath }) {
  const { signalRouteReady } = usePageTransition();
  const signaledRef = useRef(false);

  useEffect(() => {
    if (signaledRef.current) return;
    signaledRef.current = true;

    if (typeof signalRouteReady === "function") {
      signalRouteReady(routePath);
    }
  }, [signalRouteReady, routePath]);

  return null;
}
