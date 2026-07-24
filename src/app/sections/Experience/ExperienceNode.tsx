// src/app/sections/Experience/ExperienceNode.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { stageOf, growthOf } from "./stages";

type ExperienceItem = {
  id: string;
  period: string;
  role: string;
  org: string;
  summary: string;
  details: string[];
  stack: string[];
};

interface ExperienceNodeProps {
  exp: ExperienceItem;
  index: number;
  total: number;
  next: ExperienceItem | null;
  markerRef: (el: HTMLDivElement | null) => void;
  accent: string;
  reduced: boolean;
}

export default function ExperienceNode({
  exp,
  index,
  total,
  next,
  markerRef,
  accent,
  reduced,
}: ExperienceNodeProps) {
  const [activated, setActivated] = useState(reduced);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const stage = stageOf(index, total);
  const growth = growthOf(index, total);
  const climb = Math.round(growth * 64); // horizontal "climb" — later chapters sit further up the staircase

  // The card lights up once it's scrolled into focus — the line "reaching" it.
  useEffect(() => {
    if (reduced || !cardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActivated(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-15% 0px -35% 0px", threshold: 0.1 }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !bodyRef.current) return;
    const ctx = gsap.context(() => {
      if (expanded) {
        gsap.fromTo(
          bodyRef.current!.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" }
        );
      }
    }, bodyRef);
    return () => ctx.revert();
  }, [expanded, reduced]);

  return (
    <div
      ref={cardRef}
      className="relative flex gap-4 md:gap-6 transition-transform duration-700"
      style={{
        marginLeft: `clamp(0px, ${climb}px, 15vw)`,
        opacity: activated ? 1 : 0.4,
        transform: activated ? "translateY(0)" : "translateY(14px)",
      }}
    >
      {/* Marker on the ascent line */}
      <div className="relative flex-shrink-0 pt-1.5">
        <div
          ref={markerRef}
          className="w-3 h-3 rounded-full border-2 transition-all duration-500"
          style={{
            borderColor: accent,
            backgroundColor: activated ? accent : "transparent",
            boxShadow: activated ? `0 0 0 4px ${accent}22` : "none",
          }}
        />
      </div>

      <div className="flex-1 min-w-0 pb-2">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full text-left group"
          aria-expanded={expanded}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className="text-[10px] uppercase tracking-widest font-medium"
              style={{ color: accent }}
            >
              {stage.label}
            </span>
            <span className="text-xs text-current/35">{exp.period}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-medium text-current mt-1.5 group-hover:text-current/80 transition-colors">
            {exp.role}
            <span className="text-current/40 font-normal"> — {exp.org}</span>
          </h3>

          <p className="text-current/55 mt-2 max-w-2xl leading-relaxed">{exp.summary}</p>

          <span className="inline-flex items-center gap-1.5 mt-3 text-xs text-current/35 group-hover:text-current/60 transition-colors">
            {expanded ? "Collapse the evidence" : "See how this actually played out"}
            <span
              className={`inline-block transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            >
              ↓
            </span>
          </span>
        </button>

        {expanded && (
          <div ref={bodyRef} className="mt-4 space-y-4">
            <ul className="space-y-2">
              {exp.details.map((detail, i) => (
                <li key={i} className="flex gap-3 text-sm text-current/65">
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                  {detail}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {exp.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs rounded-full border border-current/10 text-current/55"
                  style={{ backgroundColor: `${accent}0d` }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {next && (
              <p className="text-xs text-current/35 pt-1">
                This is what made the next chapter possible — {next.role} at {next.org}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
