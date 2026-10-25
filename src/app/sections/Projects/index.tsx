// src/app/sections/Projects/index.tsx
"use client";

import { useEffect, useState } from "react";
import { projects } from "@/src/app/data/profile";
import ProjectShowcase from "./ProjectShowcase";
import ProjectRail from "./ProjectRail";
import { useReducedMotion } from "./atmosphere";
import SystemTopologyBackground from "./SystemTopologyBackground";

const AUTO_ADVANCE_MS = 9000;

export default function Projects() {
  const [activeIndex, setActiveIndexState] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  // Any deliberate interaction pauses the ambient rotation — the system
  // should never fight a visitor who is actively exploring.
  const setActiveIndex = (index: number) => {
    setPaused(true);
    setActiveIndexState(index);
  };

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => {
      setActiveIndexState((i) => (i + 1) % projects.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, reduced]);

  return (
    <section
      id="projects"
      className="relative section-layout overflow-hidden"
      onPointerEnter={() => setPaused(true)}
    >
      {/* Living System Topology & Circuit Mesh (Data pulses diffuse beneath the glassmorphism showcase) */}
      <SystemTopologyBackground activeIndex={activeIndex} />

      {/* Foreground Project Showcase */}
      <div className="projects-content relative z-10 container-narrow">
        <div className="mb-10">
          <span className="text-sm uppercase tracking-widest text-slate-600/70 font-semibold">
            Archive
          </span>
          <h2 className="heading-2 mt-1 text-slate-900 drop-shadow-xs">
            ENGINEERING EXHIBITS
          </h2>
          <p className="mt-3 text-slate-600/80 max-w-lg">
            Five systems, five different sets of constraints. Step through each case
            file — problem, approach, evidence, outcome.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-8 pointer-events-auto">
          <ProjectRail projects={projects} activeIndex={activeIndex} onSelect={setActiveIndex} />
          <ProjectShowcase projects={projects} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
      </div>
    </section>
  );
}
