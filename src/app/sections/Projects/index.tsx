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

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     gsap.to(".projects-bg", {
  //       y: 100,
  //       scale: 1.05,
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top bottom",
  //         end: "bottom top",
  //         scrub: 1.5,
  //       },
  //     });

  //     gsap.fromTo(
  //       ".projects-content",
  //       { opacity: 0, y: 60 },
  //       {
  //         opacity: 1,
  //         y: 0,
  //         duration: 1.2,
  //         scrollTrigger: {
  //           trigger: sectionRef.current,
  //           start: "top 80%",
  //           once: true,
  //         },
  //       }
  //     );
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative section-padding overflow-hidden"
      onPointerEnter={() => setPaused(true)}
    >
      <div className="projects-bg absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-current via-transparent to-current" />
      </div>

      <div className="projects-content relative container-narrow">
        <div className="mb-10">
          <span className="text-sm uppercase tracking-widest text-current/50">Archive</span>
          <h2 className="heading-2 mt-2 text-current">
            Engineering <span className="text-current/60">Exhibits</span>
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
