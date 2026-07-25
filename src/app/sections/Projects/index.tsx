// src/app/sections/Projects/index.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/src/app/data/profile";
import ProjectShowcase from "./ProjectShowcase";
import ProjectRail from "./ProjectRail";
import { useReducedMotion } from "./atmosphere";

gsap.registerPlugin(ScrollTrigger);

const AUTO_ADVANCE_MS = 9000;

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
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
      ref={sectionRef}
      id="projects"
      className="relative section-layout overflow-hidden border-t border-current/10"
      onPointerEnter={() => setPaused(true)}
    >
      <div className="projects-content relative container-narrow">
        <div className="mb-10">
          <span className="text-sm uppercase tracking-widest text-current/50">Archive</span>
          <h2 className="heading-2 mt-2 text-current">
            Engineering Exhibits
          </h2>
          <p className="mt-3 text-current/50 max-w-lg">
            Five systems, five different sets of constraints. Step through each case
            file — problem, approach, evidence, outcome.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-8">
          <ProjectRail projects={projects} activeIndex={activeIndex} onSelect={setActiveIndex} />
          <ProjectShowcase projects={projects} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
      </div>
    </section>
  );
}
