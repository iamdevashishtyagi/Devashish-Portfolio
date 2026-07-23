// src/app/sections/Projects/ProjectShowcase.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Project } from "@/src/app/data/profile";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ATMOSPHERES, ACCENT_HEX, useReducedMotion } from "./atmosphere";
import ProjectSchematic from "./ProjectSchematic";
import ProjectArtifacts from "./ProjectArtifacts";

interface ProjectShowcaseProps {
  projects: Project[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const STEPS = [
  { key: "overview", label: "Overview", verb: "Seeing the product" },
  { key: "problem", label: "Problem", verb: "Understanding the context" },
  { key: "solution", label: "Approach", verb: "Seeing the engineering" },
  { key: "evidence", label: "Evidence", verb: "Examining the artifacts" },
  { key: "outcome", label: "Outcome", verb: "Seeing the consequence" },
] as const;

export default function ProjectShowcase({
  projects,
  activeIndex,
  setActiveIndex,
}: ProjectShowcaseProps) {
  const [activeStep, setActiveStep] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepBodyRef = useRef<HTMLDivElement>(null);
  const schematicRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const project = projects[activeIndex];
  const atmosphere = ATMOSPHERES[project.filter];
  const accent = ACCENT_HEX[project.accent];
  const nextProject = projects[(activeIndex + 1) % projects.length];

  // Reset to the overview whenever the visitor moves to a different project.
  useEffect(() => {
    setActiveStep(0);
  }, [activeIndex]);

  // Project change: the whole canvas transitions to a new world —
  // atmosphere crosses over, the number morphs, header staggers in.
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        atmosphereRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: "power2.out" }
      );
      gsap.fromTo(
        numberRef.current,
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
      );
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power2.out", delay: 0.05 }
        );
      }
    }, canvasRef);
    return () => ctx.revert();
  }, [activeIndex, reduced]);

  // Step change: only the case-file body crossfades, everything
  // else (identity, atmosphere, artifacts frame) stays put.
  useEffect(() => {
    if (!stepBodyRef.current) return;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepBodyRef.current!.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" }
      );
    }, stepBodyRef);
    return () => ctx.revert();
  }, [activeStep, activeIndex, reduced]);

  // Idle breathing on the schematic — a quiet ambient signal that the
  // canvas is alive, paused on hover/focus and under reduced motion.
  useEffect(() => {
    if (reduced || !schematicRef.current) return;
    const tween = gsap.to(schematicRef.current, {
      scale: 1.03,
      duration: 3.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    return () => {
      tween.kill();
    };
  }, [activeIndex, reduced]);

  return (
    <div
      ref={canvasRef}
      className="relative rounded-3xl border border-current/10 overflow-hidden"
      style={{ ["--accent" as string]: accent }}
    >
      {/* BACKGROUND ATMOSPHERE — the layer that gives each project type its own weather */}
      <div ref={atmosphereRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.06]" style={{ background: `linear-gradient(135deg, ${accent}, transparent 65%)` }} />
        <AtmospherePattern pattern={atmosphere.pattern} accent={accent} reduced={reduced} />
      </div>

      <div className="relative p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12">
        {/* IDENTITY COLUMN — the anchored, morphing case number */}
        <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-6 lg:w-28 shrink-0">
          <div ref={numberRef} className="font-mono text-5xl md:text-6xl font-semibold leading-none" style={{ color: accent, opacity: 0.9 }}>
            {String(activeIndex + 1).padStart(2, "0")}
          </div>
          <div
            ref={schematicRef}
            className="hidden lg:block w-24 rounded-xl border border-current/10 bg-current/[0.03] p-2"
          >
            <ProjectSchematic mockup={project.mockup} accent={accent} className="w-full h-auto" />
          </div>
          <span className="hidden lg:block text-[10px] uppercase tracking-widest text-current/30 leading-relaxed">
            {atmosphere.classification}
          </span>
        </div>

        {/* MAIN COLUMN */}
        <div className="min-w-0">
          <div ref={headerRef} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full border border-current/15 text-current/60">
                {project.category}
              </span>
              <span className="px-2.5 py-1 text-[10px] rounded-full text-current/35">{project.year}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-medium text-current leading-tight">{project.title}</h3>
            <p className="text-current/60 text-base md:text-lg max-w-xl">{project.oneLiner}</p>
          </div>

          {/* STEP NAVIGATION — the case file the visitor steps through */}
          <div role="tablist" aria-label="Case file sections" className="flex flex-wrap gap-1 mt-6 mb-5 border-b border-current/10 pb-1">
            {STEPS.map((step, i) => (
              <button
                key={step.key}
                role="tab"
                aria-selected={activeStep === i}
                onClick={() => setActiveStep(i)}
                className={`relative px-3 py-1.5 text-xs uppercase tracking-wider rounded-t-md transition-colors ${
                  activeStep === i ? "text-current" : "text-current/35 hover:text-current/60"
                }`}
              >
                {step.label}
                {activeStep === i && (
                  <span
                    className="absolute left-2 right-2 -bottom-[5px] h-[2px] rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* STEP BODY */}
          <div ref={stepBodyRef} className="min-h-[220px] space-y-5">
            <StepContent step={STEPS[activeStep].key} project={project} accent={accent} />
          </div>

          {/* FOOTER — stack, links, and a quiet preview of what's next */}
          <div className="mt-8 pt-5 border-t border-current/10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap gap-2 max-w-md">
              {project.stack.map((tech) => (
                <span key={tech} className="px-2.5 py-1 text-xs rounded-full bg-current/5 border border-current/10 text-current/60">
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
                  className="p-2 rounded-full border border-current/15 text-current/60 hover:text-current hover:border-current/40 transition-all"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all hover:scale-[1.03]"
                  style={{ borderColor: `${accent}55`, color: accent }}
                >
                  View system <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* NEXT — the collection continues, glimpsed, not spoiled */}
          <button
            onClick={() => setActiveIndex((activeIndex + 1) % projects.length)}
            className="group mt-6 w-full flex items-center justify-between text-left px-4 py-3 rounded-xl bg-current/[0.02] hover:bg-current/[0.05] border border-current/5 transition-colors"
          >
            <span className="text-[11px] uppercase tracking-wider text-current/30">Next in the archive</span>
            <span className="text-sm text-current/60 group-hover:text-current transition-colors flex items-center gap-1.5">
              {nextProject.title}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StepContent({
  step,
  project,
  accent,
}: {
  step: (typeof STEPS)[number]["key"];
  project: Project;
  accent: string;
}) {
  switch (step) {
    case "overview":
      return (
        <>
          <div className="flex flex-wrap gap-2">
            {project.features.map((feature) => (
              <span key={feature} className="px-3 py-1 text-xs rounded-full border border-current/15 text-current/60">
                {feature}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-xl font-semibold text-current">{metric.value}</p>
                <p className="text-[11px] text-current/40 uppercase tracking-wider">{metric.label}</p>
              </div>
            ))}
          </div>
        </>
      );

    case "problem":
      return (
        <>
          <p className="text-current/80 leading-relaxed">{project.problem}</p>
          <ul className="space-y-2">
            {project.challenges.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-current/60">
                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                {c}
              </li>
            ))}
          </ul>
        </>
      );

    case "solution":
      return (
        <>
          <p className="text-current/80 leading-relaxed">{project.solution}</p>
          <div className="p-4 rounded-xl bg-current/[0.03] border-l-2" style={{ borderColor: accent }}>
            <p className="text-xs uppercase tracking-wider text-current/40 mb-1">Field note</p>
            <p className="text-sm text-current/70 italic">{project.lessons}</p>
          </div>
        </>
      );

    case "evidence":
      return <ProjectArtifacts images={project.images} accent={accent} />;

    case "outcome":
      return (
        <>
          <ul className="space-y-2">
            {project.results.map((r) => (
              <li key={r} className="flex gap-3 text-sm text-current/70">
                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                {r}
              </li>
            ))}
          </ul>
        </>
      );

    default:
      return null;
  }
}

function AtmospherePattern({
  pattern,
  accent,
  reduced,
}: {
  pattern: (typeof ATMOSPHERES)[Project["filter"]]["pattern"];
  accent: string;
  reduced: boolean;
}) {
  const spin = reduced ? "" : "animate-[spin_60s_linear_infinite]";
  const pulse = reduced ? "" : "animate-[pulse_4s_ease-in-out_infinite]";

  switch (pattern) {
    case "grid":
      return (
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      );
    case "ledger":
      return (
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${accent} 0, ${accent} 1px, transparent 1px, transparent 34px)`,
          }}
        />
      );
    case "pulse":
      return (
        <div className={`absolute -right-24 -top-24 w-96 h-96 rounded-full blur-3xl opacity-[0.12] ${pulse}`} style={{ backgroundColor: accent }} />
      );
    case "network":
      return (
        <div className={`absolute inset-0 opacity-[0.1] ${spin}`} style={{ transformOrigin: "80% 20%" }}>
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {[
              [40, 40, 160, 90],
              [160, 90, 300, 50],
              [160, 90, 220, 220],
              [220, 220, 340, 200],
              [40, 40, 90, 200],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1" />
            ))}
          </svg>
        </div>
      );
    case "editorial":
    default:
      return (
        <div
          className="absolute inset-y-0 right-0 w-1/3 opacity-[0.06]"
          style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }}
        />
      );
  }
}
