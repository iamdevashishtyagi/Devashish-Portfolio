"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/src/app/data/profile";
import ProjectShowcase from "./ProjectShowcase";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background effect
      gsap.to(".projects-bg", {
        y: 100,
        scale: 1.05,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Fade in section
      gsap.fromTo(
        ".projects-content",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative section-padding overflow-hidden"
    >
      {/* Animated background */}
      <div className="projects-bg absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-current via-transparent to-current" />
      </div>

      <div className="projects-content relative container-narrow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm uppercase tracking-widest text-current/50">
              Portfolio
            </span>
            <h2 className="heading-2 mt-2 text-current">
              Featured <span className="text-current/60">Work</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              className="p-3 rounded-full border border-current/20 hover:border-current/60 transition-all hover:scale-110"
              disabled={activeIndex === 0}
            >
              ←
            </button>
            <button
              onClick={() => setActiveIndex(Math.min(projects.length - 1, activeIndex + 1))}
              className="p-3 rounded-full border border-current/20 hover:border-current/60 transition-all hover:scale-110"
              disabled={activeIndex === projects.length - 1}
            >
              →
            </button>
          </div>
        </div>

        <ProjectShowcase
          projects={projects}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </section>
  );
}