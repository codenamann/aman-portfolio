"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Register signature jelly / liquid ease curve
try {
  if (!gsap.parseEase("jelly")) {
    CustomEase.create("jelly", "0.76, 0, 0.24, 1");
  }
} catch {
  // Fallback if already registered
}

const PageTransitionContext = createContext({
  navigate: () => {},
  signalRouteReady: () => {},
  transitionState: "idle",
});

export const usePageTransition = () => useContext(PageTransitionContext);

/**
 * Builds dynamic SVG cubic Bézier path for clipping the outgoing page layer:
 * Top anchored at (0,0); lower boundary deforms elastically.
 * Edges lead upward, center lags behind into a deep liquid belly (300px+ lag),
 * then snaps, overshoots, and settles flat as it clears above y = 0.
 *
 * M 0 0 L w 0 L w edgeY C ... centerY ... w/2 centerY C ... edgeY 0 edgeY Z
 */
function buildJellyRevealPath(w, edgeY, centerY) {
  const ey = Math.round(edgeY);
  const cy = Math.round(centerY);
  const cp1X = Math.round(w * 0.22);
  const cp2X = Math.round(w * 0.35);
  const cp3X = Math.round(w * 0.65);
  const cp4X = Math.round(w * 0.78);
  return `M 0 0 L ${w} 0 L ${w} ${ey} C ${cp4X} ${ey} ${cp3X} ${cy} ${Math.round(w / 2)} ${cy} C ${cp2X} ${cy} ${cp1X} ${ey} 0 ${ey} Z`;
}

/**
 * Captures an isolated, frozen visual snapshot of the outgoing page (#page-main)
 * with production safeguards:
 * - Omits fixed headers, navbars, and cursor followers to prevent visual duplication.
 * - Compensates exact scroll position via translate3d(0, -scrollY, 0).
 * - Copies video currentTime and canvas buffers.
 * - Strips duplicate IDs and marks non-interactive (pointer-events: none, aria-hidden: true).
 * - Measures capture duration via performance.now().
 */
function captureOutgoingSnapshot(sourceEl, scrollY) {
  const t0 = performance.now();
  if (!sourceEl) return null;

  // 1. Fixed outer wrapper with physical drop-shadow following the jelly boundary
  const snapshotWrapper = document.createElement("div");
  snapshotWrapper.id = "page-transition-outgoing-snapshot";
  snapshotWrapper.setAttribute("aria-hidden", "true");
  snapshotWrapper.className =
    "fixed inset-0 w-screen h-screen pointer-events-none select-none z-[99990] overflow-hidden will-change-transform";
  snapshotWrapper.style.filter = "drop-shadow(0 25px 40px rgba(0, 0, 0, 0.85))";

  // 2. Clipped stage layer driven by the dynamic SVG clip-path
  const stage = document.createElement("div");
  stage.className = "w-full h-full overflow-hidden will-change-transform";
  stage.style.backgroundColor = "#111113";
  stage.style.clipPath = "url(#outgoing-jelly-clip)";
  stage.style.webkitClipPath = "url(#outgoing-jelly-clip)";

  // 3. Scroll-compensated inner content container
  const inner = document.createElement("div");
  inner.className = "w-full relative will-change-transform";
  inner.style.transform = `translate3d(0, -${scrollY}px, 0)`;

  // 4. Clone DOM tree of the outgoing page
  const clone = sourceEl.cloneNode(true);

  // 5. Sanitize clone:
  // (a) Remove duplicate IDs to prevent DOM conflicts with incoming page
  const allWithId = clone.querySelectorAll("[id]");
  allWithId.forEach((el) => {
    el.removeAttribute("id");
  });

  // (b) Remove fixed navigation, cursor ball, and floating overlays so they do not lift away
  const fixedElements = clone.querySelectorAll(
    "header, nav, #cursor-ball, [data-cursor-ball], .fixed"
  );
  fixedElements.forEach((el) => {
    el.remove();
  });

  // (c) Preserve video currentTime & pause cloned video to conserve GPU resources
  const origVideos = sourceEl.querySelectorAll("video");
  const clonedVideos = clone.querySelectorAll("video");
  clonedVideos.forEach((cv, idx) => {
    if (origVideos[idx]) {
      try {
        cv.currentTime = origVideos[idx].currentTime;
      } catch (e) {}
    }
    cv.pause();
    cv.removeAttribute("autoplay");
  });

  // (d) Copy canvas contents if any canvas exists
  const origCanvases = sourceEl.querySelectorAll("canvas");
  const clonedCanvases = clone.querySelectorAll("canvas");
  clonedCanvases.forEach((cc, idx) => {
    const oc = origCanvases[idx];
    if (oc && oc.width > 0 && oc.height > 0) {
      try {
        const ctx = cc.getContext("2d");
        if (ctx) ctx.drawImage(oc, 0, 0);
      } catch (e) {}
    }
  });

  // (e) Ensure pointer-events: none on entire clone
  clone.style.pointerEvents = "none";
  clone.style.userSelect = "none";

  inner.appendChild(clone);
  stage.appendChild(inner);
  snapshotWrapper.appendChild(stage);

  const duration = performance.now() - t0;
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[PageTransition] Outgoing snapshot captured in ${duration.toFixed(2)}ms`);
  }

  return { snapshotWrapper, duration };
}

/**
 * Global Jelly Curtain Page Transition Controller
 *
 * State Machine:
 * IDLE -> COVERED (outgoing snapshot active, awaiting RouteReady) -> REVEALING -> IDLE
 *      -> RECOVERING (watchdog recovery on failure) -> IDLE
 */
export default function PageTransition({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [transitionState, setTransitionState] = useState("idle");

  // DOM Refs
  const containerRef = useRef(null);
  const clipPathRef = useRef(null);
  const activeSnapshotRef = useRef(null);

  // Transition Coordination Refs
  const stateRef = useRef("idle");
  const pendingTargetRef = useRef(null);
  const watchdogTimeoutRef = useRef(null);
  const isHistoryNavRef = useRef(false);
  const activeTimelineRef = useRef(null);

  // Viewport dimensions cache
  const dimsRef = useRef({ width: 1920, height: 1080 });

  // Update cached dimensions on resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateDims = () => {
      dimsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      if (clipPathRef.current && stateRef.current === "idle") {
        clipPathRef.current.setAttribute(
          "d",
          buildJellyRevealPath(window.innerWidth, window.innerHeight, window.innerHeight)
        );
      }
    };
    updateDims();
    window.addEventListener("resize", updateDims, { passive: true });
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  /**
   * Helper to safely unlock body and resume Lenis scroll
   */
  const resumeScrollAndUnlock = useCallback(() => {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    if (typeof window !== "undefined" && window.__lenis) {
      try {
        window.__lenis.start();
      } catch (err) {}
    }
  }, []);

  /**
   * Helper to safely stop Lenis and lock body scroll
   */
  const pauseScrollAndLock = useCallback(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    if (typeof window !== "undefined" && window.__lenis) {
      try {
        window.__lenis.stop();
      } catch (err) {}
    }
  }, []);

  /**
   * Safe cleanup of any active snapshot DOM element
   */
  const removeActiveSnapshot = useCallback(() => {
    if (activeSnapshotRef.current) {
      try {
        activeSnapshotRef.current.remove();
      } catch (e) {}
      activeSnapshotRef.current = null;
    }
  }, []);

  /**
   * Controlled Watchdog Recovery Mechanism:
   * Invoked if the destination route stalls or fails to signal readiness within 5 seconds.
   * Cleans up the snapshot gracefully and restores the outgoing page view.
   */
  const triggerWatchdogRecovery = useCallback(() => {
    if (stateRef.current !== "covered") return;

    console.warn(
      `[PageTransition] Navigation to "${pendingTargetRef.current}" stalled. Initiating controlled watchdog recovery.`
    );

    stateRef.current = "recovering";
    setTransitionState("recovering");

    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
    }

    if (activeSnapshotRef.current) {
      gsap.to(activeSnapshotRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          removeActiveSnapshot();
          resumeScrollAndUnlock();
          stateRef.current = "idle";
          setTransitionState("idle");
          pendingTargetRef.current = null;
        },
      });
    } else {
      resumeScrollAndUnlock();
      stateRef.current = "idle";
      setTransitionState("idle");
      pendingTargetRef.current = null;
    }
  }, [resumeScrollAndUnlock, removeActiveSnapshot]);

  /**
   * Phase 2: Elastic Jelly Lift Reveal
   * Fired deterministically once the destination route commits and signals RouteReady.
   */
  const executeReveal = useCallback(() => {
    if (stateRef.current !== "covered") return;

    // Clear watchdog timer immediately
    if (watchdogTimeoutRef.current) {
      clearTimeout(watchdogTimeoutRef.current);
      watchdogTimeoutRef.current = null;
    }

    stateRef.current = "revealing";
    setTransitionState("revealing");

    const snapshot = activeSnapshotRef.current;
    const clipPath = clipPathRef.current;

    if (!snapshot || !clipPath) {
      removeActiveSnapshot();
      resumeScrollAndUnlock();
      stateRef.current = "idle";
      setTransitionState("idle");
      pendingTargetRef.current = null;
      return;
    }

    const w = dimsRef.current.width;
    const h = dimsRef.current.height;

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Forward link navigation scroll reset: Atomic reset to top underneath the snapshot
    if (!isHistoryNavRef.current) {
      window.scrollTo(0, 0);
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
    }

    if (prefersReducedMotion) {
      // Simplified instantaneous fade for reduced motion
      gsap.to(snapshot, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.out",
        onComplete: () => {
          removeActiveSnapshot();
          resumeScrollAndUnlock();
          ScrollTrigger.refresh();
          stateRef.current = "idle";
          setTransitionState("idle");
          pendingTargetRef.current = null;
        },
      });
      return;
    }

    // Set initial solid reveal path covering the entire snapshot
    clipPath.setAttribute("d", buildJellyRevealPath(w, h, h));

    // Two independent physical motion coordinates:
    // edge: Left and right corners that pull upward first
    // center: Center with mass and inertia that lags behind dramatically (300px+), snaps, and overshoots
    const edge = { y: h };
    const center = { y: h };

    const updateClipPath = () => {
      if (clipPath) {
        clipPath.setAttribute("d", buildJellyRevealPath(w, edge.y, center.y));
      }
    };

    const tl = gsap.timeline({
      onComplete: () => {
        removeActiveSnapshot();
        clipPath.setAttribute("d", buildJellyRevealPath(w, h, h));
        resumeScrollAndUnlock();
        ScrollTrigger.refresh();
        stateRef.current = "idle";
        setTransitionState("idle");
        pendingTargetRef.current = null;
        activeTimelineRef.current = null;
      },
    });

    activeTimelineRef.current = tl;

    // 1. Left and right edges pull upward with swift acceleration
    tl.to(
      edge,
      {
        y: -120,
        duration: 0.82,
        ease: "power3.inOut",
        onUpdate: updateClipPath,
      },
      0
    );

    // 2. Center lags behind:
    // Starts with a brief inertia delay (0.07s), stretching the boundary into a deep liquid belly (>300px lag)
    // Then snaps upward rapidly and overshoots past -120px to -165px
    tl.to(
      center,
      {
        y: -165,
        duration: 0.84,
        ease: "power2.inOut",
        onUpdate: updateClipPath,
      },
      0.07
    );

    // 3. Elastic settling phase:
    // Center rebounds from overshoot (-165px) and settles flat at -120px
    tl.to(
      center,
      {
        y: -120,
        duration: 0.24,
        ease: "sine.out",
        onUpdate: updateClipPath,
      },
      0.88
    );
  }, [resumeScrollAndUnlock, removeActiveSnapshot]);

  /**
   * Deterministic route-readiness signal called by <RouteReady />
   */
  const signalRouteReady = useCallback(
    (signaledPath) => {
      if (stateRef.current === "covered") {
        executeReveal();
      }
    },
    [executeReveal]
  );

  /**
   * Phase 1: Initiate Navigation & Snapshot Outgoing Viewport
   */
  const navigate = useCallback(
    (href) => {
      if (typeof window === "undefined" || !href) return;
      if (stateRef.current !== "idle") return;

      const targetUrl = new URL(href, window.location.href);
      const targetPath = targetUrl.pathname;

      // Ignore same-page navigation
      if (
        targetPath === window.location.pathname &&
        targetUrl.search === window.location.search
      ) {
        return;
      }

      // Bypass public curtain for admin routes
      if (targetPath.startsWith("/admin") || pathname?.startsWith("/admin")) {
        router.push(targetUrl.pathname + targetUrl.search + targetUrl.hash);
        return;
      }

      const sourceEl = containerRef.current;
      const scrollY = window.scrollY;
      const w = dimsRef.current.width;
      const h = dimsRef.current.height;

      // Capture frozen visual snapshot of outgoing page
      const snapshotResult = captureOutgoingSnapshot(sourceEl, scrollY);
      if (!snapshotResult) {
        router.push(targetUrl.pathname + targetUrl.search + targetUrl.hash);
        return;
      }

      // Mount snapshot over the viewport
      const { snapshotWrapper } = snapshotResult;
      document.body.appendChild(snapshotWrapper);
      activeSnapshotRef.current = snapshotWrapper;

      // Ensure clipPath covers the entire snapshot at start
      if (clipPathRef.current) {
        clipPathRef.current.setAttribute("d", buildJellyRevealPath(w, h, h));
      }

      stateRef.current = "covered";
      setTransitionState("covered");
      pendingTargetRef.current = targetPath;
      isHistoryNavRef.current = false;

      pauseScrollAndLock();

      // Dispatch Next.js route change under the frozen outgoing snapshot
      router.push(targetUrl.pathname + targetUrl.search + targetUrl.hash);

      // Arm 5-second Watchdog Recovery Timer
      if (watchdogTimeoutRef.current) clearTimeout(watchdogTimeoutRef.current);
      watchdogTimeoutRef.current = setTimeout(() => {
        triggerWatchdogRecovery();
      }, 5000);
    },
    [router, pathname, pauseScrollAndLock, triggerWatchdogRecovery]
  );

  /**
   * Browser Back/Forward (popstate) Handler:
   * Next.js App Router restores historical scroll position automatically.
   */
  useEffect(() => {
    const handlePopState = () => {
      isHistoryNavRef.current = true;

      // If a transition was currently active, cancel it immediately
      if (stateRef.current !== "idle") {
        if (watchdogTimeoutRef.current) {
          clearTimeout(watchdogTimeoutRef.current);
          watchdogTimeoutRef.current = null;
        }
        if (activeTimelineRef.current) {
          activeTimelineRef.current.kill();
          activeTimelineRef.current = null;
        }

        removeActiveSnapshot();
        resumeScrollAndUnlock();
        stateRef.current = "idle";
        setTransitionState("idle");
        pendingTargetRef.current = null;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [resumeScrollAndUnlock, removeActiveSnapshot]);

  /**
   * Global Click Interceptor for Public Internal Anchor Links
   */
  useEffect(() => {
    if (isAdmin) return;

    const handleGlobalClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, protocol, or download links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel")?.includes("external")
      ) {
        return;
      }

      // Ignore hash anchors (on-page section jumps)
      if (href.startsWith("#")) return;

      // Ignore modifier clicks (Cmd, Ctrl, Shift, Alt)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      try {
        const targetUrl = new URL(href, window.location.href);

        // Ignore admin navigation
        if (
          targetUrl.pathname.startsWith("/admin") ||
          window.location.pathname.startsWith("/admin")
        ) {
          return;
        }

        // Ignore clicks to current active route
        if (
          targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search
        ) {
          if (!targetUrl.hash) {
            e.preventDefault();
          }
          return;
        }

        // Intercept and coordinate with jelly curtain
        e.preventDefault();
        navigate(targetUrl.pathname + targetUrl.search + targetUrl.hash);
      } catch {
        // Fallback to native navigation
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => document.removeEventListener("click", handleGlobalClick, { capture: true });
  }, [navigate, isAdmin]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchdogTimeoutRef.current) {
        clearTimeout(watchdogTimeoutRef.current);
      }
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }
      removeActiveSnapshot();
      resumeScrollAndUnlock();
    };
  }, [resumeScrollAndUnlock, removeActiveSnapshot]);

  if (isAdmin) {
    return children;
  }

  const { width, height } = dimsRef.current;
  const initialClipD = buildJellyRevealPath(width, height, height);

  return (
    <PageTransitionContext.Provider
      value={{
        navigate,
        signalRouteReady,
        transitionState,
      }}
    >
      {/* 
        Standalone SVG Clip-Path Definition for the Outgoing Page Snapshot
        - Pinned off-screen with zero layout influence
        - Dynamically manipulated frame-by-frame via GSAP
      */}
      <svg
        aria-hidden="true"
        className="fixed top-0 left-0 w-0 h-0 pointer-events-none -z-10"
        style={{ width: 0, height: 0, position: "fixed" }}
      >
        <defs>
          <clipPath id="outgoing-jelly-clip" clipPathUnits="userSpaceOnUse">
            <path
              ref={clipPathRef}
              d={initialClipD}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Main page content wrapper - serves as the clone source during navigation */}
      <div id="page-main" ref={containerRef} className="relative w-full">
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}
