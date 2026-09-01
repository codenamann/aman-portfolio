"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { featuredShorts, featuredLongForm } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectVideoModal from "./ProjectVideoModal";

export default function Projects({ initialType = "shorts" }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(initialType); // "shorts" | "long-form"

  const displayProjects =
    activeTab === "shorts" ? featuredShorts : featuredLongForm;
  const isShorts = activeTab === "shorts";

  return (
    <section
      id="projects"
      className="w-full flex justify-center bg-background border-t border-border section-py section-px"
    >
      <div className="section-container flex-1">
        {/* ── Section Heading & Format Switcher ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
          <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight">
            Latest <span className="text-accent">Projects</span>
          </h2>

          {/* Format Toggle Switcher with Sliding Active Pill */}
          <div className="inline-flex p-1 rounded-full bg-white/[0.05] border border-white/10 w-fit relative z-0">
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

        {/* ── Responsive Projects Grid with Smooth Cinematic Transition ── */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={
                isShorts
                  ? "grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                  : "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 md:gap-y-12"
              }
            >
              {displayProjects.map((project) => (
                <ProjectCard
                  key={project.id || project.title}
                  project={project}
                  aspectRatio={isShorts ? "aspect-[9/16]" : "aspect-[16/9.5]"}
                  onSelect={setSelectedProject}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

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
