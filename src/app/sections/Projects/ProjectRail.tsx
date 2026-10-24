// src/app/sections/Projects/ProjectRail.tsx
"use client";

import { motion } from "framer-motion";
import { Project } from "@/src/app/data/profile";
import { ATMOSPHERES } from "./atmosphere";

interface ProjectRailProps {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ProjectRail({ projects, activeIndex, onSelect }: ProjectRailProps) {
  return (
    <nav aria-label="Project archive" className="relative">
      <div className="relative flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0 scrollbar-none">
        {projects.map((project, i) => {
          const isActive = i === activeIndex;
          const atmosphere = ATMOSPHERES[project.filter];

          return (
            <button
              key={project.id}
              onClick={() => onSelect(i)}
              aria-current={isActive}
              className={`group relative flex items-center gap-3 text-left shrink-0 md:shrink md:w-full rounded-2xl px-4 py-3.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60"
              }`}
            >
              {/* Framer Motion Gliding Glassmorphic Active Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeRailGlassPill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-2xl bg-white border border-zinc-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.05)] pointer-events-none"
                />
              )}

              {/* Indicator Dot & Monospace Number */}
              <div className="relative z-10 flex items-center gap-2.5 shrink-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? "bg-blue-600" : "bg-zinc-300 group-hover:bg-zinc-400"
                  }`}
                />
                <span
                  className={`font-mono text-xs tabular-nums font-semibold transition-colors duration-200 ${
                    isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title & Classification */}
              <span className="relative z-10 flex flex-col min-w-0 pr-1">
                <span
                  className={`text-sm truncate transition-colors duration-200 ${
                    isActive ? "text-zinc-900 font-semibold" : "text-zinc-600 group-hover:text-zinc-900 font-medium"
                  }`}
                >
                  {project.title}
                </span>
                <span className="hidden md:block text-[10px] uppercase tracking-wider text-zinc-400 truncate font-mono mt-0.5">
                  {atmosphere.classification}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
