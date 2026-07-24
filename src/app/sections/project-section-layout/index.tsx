"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/src/app/data/profile";
import ProjectShowcase from "./ProjectShowcase";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const atlasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    const atlas = atlasRef.current;

    if (!section || !intro || !atlas) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        gsap.set([intro, atlas], {
          opacity: 1,
          y: 0,
        });

        return;
      }

      gsap.fromTo(
        intro,
        {
          opacity: 0,
          y: 70,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        atlas,
        {
          opacity: 0,
          y: 90,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: atlas,
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.to(".projects-atmosphere", {
        yPercent: 18,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".projects-grid-line", {
        xPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden section-layout"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="projects-atmosphere absolute -inset-[20%] opacity-[0.055]">
          <div className="absolute left-[10%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-current blur-[140px]" />

          <div className="absolute bottom-[10%] right-[10%] h-[24rem] w-[24rem] rounded-full bg-current blur-[160px]" />
        </div>

        <div className="projects-grid-line absolute left-[-20%] top-[35%] h-px w-[140%] bg-current opacity-[0.06]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      <div className="relative container-narrow">
        {/* Section introduction */}
        <div
          ref={introRef}
          className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-10 bg-current opacity-40" />

              <span className="text-xs uppercase tracking-[0.3em] text-current/45">
                Selected Work
              </span>

              <span className="font-mono text-[10px] text-current/25">
                05 / COLLECTION
              </span>
            </div>

            <h2 className="heading-2 max-w-2xl text-current">
              Systems built to{" "}
              <span className="text-current/45">solve something.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-current/50 md:text-lg">
              A collection of production systems, compliance engines, SaaS
              products, and AI infrastructure — explored through the problems
              they were built to solve.
            </p>
          </div>

          <div className="hidden max-w-[180px] text-right md:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-current/30">
              Navigate the archive
            </p>

            <p className="mt-3 text-sm leading-relaxed text-current/45">
              Scroll, inspect, and move through the systems.
            </p>
          </div>
        </div>

        <div ref={atlasRef}>
          <ProjectShowcase projects={projects} />
        </div>
      </div>
    </section>
  );
}
