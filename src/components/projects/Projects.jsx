"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Film } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import ProjectCard from "./ProjectCard";

const ProjectVideoModal = dynamic(() => import("./ProjectVideoModal"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function Projects({
  initialType = "shorts",
  featuredShorts = [],
  featuredLongForm = [],
  error = null,
  isLoading = false,
}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(initialType); // "shorts" | "long-form"
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  const displayProjects =
    activeTab === "shorts" ? featuredShorts : featuredLongForm;
  const isShorts = activeTab === "shorts";

  useGSAP(
    () => {
      // 1. Heading masked reveal on scroll (runs ONCE on scroll into view)
      gsap.from(".projects-heading-text", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        yPercent: 120,
        duration: 0.9,
        ease: "power3.out",
      });

      // 2. Format tab toggle button scale-fade (runs ONCE on scroll into view)
      gsap.from(".projects-tab-switcher", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.65,
        delay: 0.15,
        ease: "back.out(1.5)",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="w-full flex justify-center bg-background border-t border-border section-py section-px"
    >
      <div className="section-container flex-1">
        {/* ── Section Heading & Format Switcher ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
          <h2
            ref={headingRef}
            className="font-display font-bold text-section-heading text-foreground tracking-tight overflow-hidden"
          >
            <span className="projects-heading-text inline-block">
              Latest <span className="text-accent">Projects</span>
            </span>
          </h2>

          {/* Format Toggle Switcher with Sliding Active Pill */}
          <div className="projects-tab-switcher inline-flex p-1 rounded-full bg-white/[0.05] border border-white/10 w-fit relative z-0">
            {/* Shorts & Reels Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("shorts")}
              className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${
                isShorts
                  ? "text-white font-bold"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {isShorts && (
                <motion.span
                  layoutId="projectTabPill"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-accent shadow-md shadow-accent/30 z-0"
                />
              )}
              <span className="relative z-10">Shorts & Reels</span>
            </button>

            {/* Long-Form Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("long-form")}
              className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${
                !isShorts
                  ? "text-white font-bold"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {!isShorts && (
                <motion.span
                  layoutId="projectTabPill"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-accent shadow-md shadow-accent/30 z-0"
                />
              )}
              <span className="relative z-10">Long-Form</span>
            </button>
          </div>
        </div>

        {/* ── Error State ─────────────────────────────────────────────────── */}
        {error ? (
          <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-center flex flex-col items-center justify-center gap-3">
            <AlertCircle size={24} className="text-red-400" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        ) : isLoading ? (
          /* ── Localized Projects-Only Skeleton ───────────────────────────── */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-6 animate-pulse py-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${
                  isShorts ? "aspect-[9/16]" : "aspect-[16/9.5]"
                } rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-end p-4 gap-2`}
              >
                <div className="w-3/4 h-4 rounded bg-white/10" />
                <div className="w-1/2 h-3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : (
          /* ── Content Viewport with Smooth Cross-Fade Transition ─────────── */
          <div className="projects-grid-wrapper min-h-[380px] relative">
            <AnimatePresence mode="wait" initial={false}>
              {displayProjects.length === 0 ? (
                /* ── Explicit Empty State Animated ───────────────────────── */
                <motion.div
                  key={`empty-${activeTab}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="py-20 px-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted">
                    <Film size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    No {isShorts ? "Shorts & Reels" : "Long-Form"} projects found
                  </h3>
                  <p className="text-xs text-muted max-w-sm">
                    Featured showcase slots have not been configured yet in the admin panel.
                  </p>
                </motion.div>
              ) : (
                /* ── Projects Grid with Smooth Stagger ──────────────────── */
                <motion.div
                  key={`grid-${activeTab}`}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        duration: 0.3,
                      },
                    },
                    exit: {
                      opacity: 0,
                      transition: { duration: 0.25, ease: "easeInOut" },
                    },
                  }}
                  className={
                    isShorts
                      ? "grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                      : "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 md:gap-y-12"
                  }
                >
                  {displayProjects.map((project, idx) => (
                    <motion.div
                      key={project.id || project.title}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                        },
                        exit: {
                          opacity: 0,
                          y: -10,
                          transition: { duration: 0.2 },
                        },
                      }}
                      className="will-change-transform"
                    >
                      <ProjectCard
                        project={project}
                        index={idx}
                        aspectRatio={isShorts ? "aspect-[9/16]" : "aspect-[16/9.5]"}
                        onSelect={setSelectedProject}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Bottom Link ───────────────────────────────────────────────── */}
        <div className="flex justify-center mt-12 lg:mt-15 xl:mt-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-base md:text-[1.2rem] font-medium text-muted hover:text-foreground transition-colors group"
          >
            View all my projects
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
        </div>
      </div>

      {/* ── Reusable Video Player Modal ─────────────────────────────────── */}
      <ProjectVideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

