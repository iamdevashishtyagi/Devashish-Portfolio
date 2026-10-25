// src/app/sections/Projects/ProjectShowcase.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/src/app/data/profile";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { CLASSIFICATIONS } from "./atmosphere";
import ProjectSchematic from "./ProjectSchematic";
import ProjectArtifacts from "./ProjectArtifacts";

interface ProjectShowcaseProps {
  projects: Project[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const STEPS = [
  { key: "overview", label: "Overview" },
  { key: "problem", label: "Problem" },
  { key: "solution", label: "Approach" },
  { key: "evidence", label: "Snapshots" },
  { key: "outcome", label: "Outcome" },
] as const;

// Unified signature blue for refined, clean light accents across all cards
const UNIFIED_ACCENT = "#2563EB";

export default function ProjectShowcase({
  projects,
  activeIndex,
  setActiveIndex,
}: ProjectShowcaseProps) {
  const [activeStep, setActiveStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const project = projects[activeIndex];
  const classification = CLASSIFICATIONS[project.filter];
  const nextProject = projects[(activeIndex + 1) % projects.length];

  // Reset to overview tab whenever active project changes
  useEffect(() => {
    setActiveStep(0);
  }, [activeIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/80 border-t-white shadow-[0_20px_50px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.02)] ring-1 ring-inset ring-white/90 transition-all duration-300"
    >
      {/* Light Glass Sheen — Pure subtle gradient reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 via-white/30 to-transparent" />

      {/* Interactive Light Specular Spotlight that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.85), transparent 60%)`,
        }}
      />

      {/* Smooth Project Transition with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12"
        >
          {/* IDENTITY COLUMN — Clean Exhibit Number and Blueprint */}
          <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-6 lg:w-28 shrink-0">
            <div className="relative overflow-hidden">
              <motion.span
                key={activeIndex}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="block font-mono text-5xl md:text-6xl font-bold leading-none tracking-tight text-zinc-900"
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </motion.span>
            </div>

            <div className="hidden lg:block w-24 rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-md p-2.5 shadow-xs">
              <ProjectSchematic mockup={project.mockup} accent={UNIFIED_ACCENT} className="w-full h-auto" />
            </div>

            <span className="hidden lg:block text-[10px] uppercase tracking-widest text-zinc-400 leading-relaxed font-mono">
              {classification}
            </span>
          </div>

          {/* MAIN SHOWCASE COLUMN */}
          <div className="min-w-0">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider rounded-full border border-zinc-200/80 bg-zinc-100/90 text-zinc-700 font-medium shadow-xs">
                  {project.category}
                </span>
                <span className="px-2 py-0.5 text-xs text-zinc-400 ml-auto font-mono">
                  {project.year}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight leading-tight">
                {project.title}
              </h3>
              <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-xl">
                {project.oneLiner}
              </p>
            </div>

            {/* STEP NAVIGATION — Clean Light Glass Segmented Tabs */}
            <div className="mt-6 mb-5">
              <div
                role="tablist"
                aria-label="Case file sections"
                className="inline-flex flex-wrap gap-1 p-1 rounded-2xl bg-zinc-100/80 border border-zinc-200/80 backdrop-blur-md"
              >
                {STEPS.map((step, i) => {
                  const isSelected = activeStep === i;
                  return (
                    <button
                      key={step.key}
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveStep(i)}
                      className={`relative px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "text-zinc-900 font-semibold"
                          : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeExhibitGlassTab"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          className="absolute inset-0 rounded-xl bg-white shadow-xs border border-zinc-200/70"
                        />
                      )}
                      <span className="relative z-10">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP BODY with Animated Transitions */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${project.id}-${activeStep}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <StepContent step={STEPS[activeStep].key} project={project} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* FOOTER — Stack, links, and next project shortcut */}
            <div className="mt-8 pt-5 border-t border-zinc-200/80 flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-wrap gap-1.5 max-w-md">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-mono rounded-full bg-white/80 border border-zinc-200/80 text-zinc-600 shadow-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View source on GitHub"
                    className="p-2.5 rounded-xl border border-zinc-200/80 bg-white/80 text-zinc-700 hover:text-zinc-950 hover:bg-white shadow-xs transition-all cursor-pointer"
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs hover:shadow-sm transition-all cursor-pointer"
                  >
                    View system <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* NEXT — The collection continues smoothly */}
            <button
              onClick={() => setActiveIndex((activeIndex + 1) % projects.length)}
              className="group mt-6 w-full flex items-center justify-between text-left px-4 py-3.5 rounded-2xl bg-zinc-50/80 hover:bg-white border border-zinc-200/80 transition-all cursor-pointer shadow-xs hover:shadow-sm"
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Next in the archive
              </span>
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-950 transition-colors flex items-center gap-1.5">
                {nextProject.title}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepContent({
  step,
  project,
}: {
  step: (typeof STEPS)[number]["key"];
  project: Project;
}) {
  switch (step) {
    case "overview":
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.features.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1.5 text-xs rounded-full border border-zinc-200/80 bg-white/80 text-zinc-700 shadow-xs font-medium"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-sm text-center shadow-xs transition-all hover:bg-white hover:shadow-sm"
              >
                <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-zinc-900">
                  {metric.value}
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider font-mono mt-1">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case "problem":
      return (
        <div className="space-y-3">
          <p className="text-zinc-700 leading-relaxed text-sm sm:text-base">
            {project.problem}
          </p>
          <ul className="space-y-2 pt-1">
            {project.challenges.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 p-3.5 rounded-2xl bg-white/70 border border-zinc-200/80 shadow-xs"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "solution":
      return (
        <div className="space-y-3">
          <p className="text-zinc-700 leading-relaxed text-sm sm:text-base">
            {project.solution}
          </p>
          {project.lessons && (
            <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/90 shadow-xs border-l-4 border-l-blue-600">
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Engineering Field Note
              </p>
              <p className="text-sm text-zinc-700 italic leading-relaxed">
                &quot;{project.lessons}&quot;
              </p>
            </div>
          )}
        </div>
      );

    case "evidence":
      return <ProjectArtifacts images={project.images} />;

    case "outcome":
      return (
        <ul className="space-y-2">
          {project.results.map((r) => (
            <li
              key={r}
              className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 p-3.5 rounded-2xl bg-white/70 border border-zinc-200/80 shadow-xs"
            >
              <CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0" />
              <span className="leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}
