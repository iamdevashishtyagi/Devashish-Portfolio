// src/app/sections/Projects/ProjectRail.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Project } from "@/src/app/data/profile";
import { ATMOSPHERES, ACCENT_HEX } from "./atmosphere";

interface ProjectRailProps {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ProjectRail({ projects, activeIndex, onSelect }: ProjectRailProps) {
  const trailRef = useRef<HTMLDivElement>(null);
  const railWrapRef = useRef<HTMLDivElement>(null);

  // The trail marker glides to the active entry rather than jumping —
  // one continuous element persisting across project changes.
  useEffect(() => {
    const wrap = railWrapRef.current;
    const trail = trailRef.current;
    if (!wrap || !trail) return;
    const active = wrap.querySelectorAll<HTMLElement>("[data-rail-item]")[activeIndex];
    if (!active) return;

    gsap.to(trail, {
      top: active.offsetTop + active.offsetHeight / 2,
      duration: 0.6,
      ease: "power3.out",
    });
  }, [activeIndex]);

  return (
    <nav aria-label="Project archive" className="relative">
      <div ref={railWrapRef} className="relative flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
        {/* Continuous vertical spine (desktop only) with the gliding marker */}
        <div className="hidden md:block absolute left-[15px] top-0 bottom-0 w-px bg-current/10" />
        <div
          ref={trailRef}
          className="hidden md:block absolute left-[11px] w-2 h-2 rounded-full -translate-y-1/2"
          style={{ backgroundColor: ACCENT_HEX[projects[activeIndex].accent], top: 0 }}
        />

        {projects.map((project, i) => {
          const isActive = i === activeIndex;
          const atmosphere = ATMOSPHERES[project.filter];
          const accent = ACCENT_HEX[project.accent];
          return (
            <button
              key={project.id}
              data-rail-item
              onClick={() => onSelect(i)}
              aria-current={isActive}
              className={`group relative flex md:pl-8 items-center gap-3 text-left shrink-0 md:shrink md:w-full rounded-xl px-3 py-2.5 md:px-3 transition-colors duration-300 ${
                isActive ? "bg-current/[0.06]" : "hover:bg-current/[0.03]"
              }`}
            >
              <span
                className="font-mono text-xs tabular-nums transition-colors duration-300"
                style={{ color: isActive ? accent : undefined }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col min-w-0">
                <span
                  className={`text-sm truncate transition-colors duration-300 ${
                    isActive ? "text-current" : "text-current/60 group-hover:text-current/80"
                  }`}
                >
                  {project.title}
                </span>
                <span className="hidden md:block text-[10px] uppercase tracking-wider text-current/30 truncate">
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
