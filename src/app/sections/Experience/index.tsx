// src/app/sections/Experience/index.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/src/app/data/profile";
import ExperienceNode from "./ExperienceNode";
import AscentPath from "./AscentPath";
import { useReducedMotion } from "./stages";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#3B82F6";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const reduced = useReducedMotion();

  // The data is stored newest-first; the ascent reads oldest-first —
  // a beginning, not a headline.
  const chronological = useMemo(() => [...experience].reverse(), []);
  const order = useMemo(() => chronological.map((e) => e.id), [chronological]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ascent-intro",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="section-padding border-t border-current/10">
      <div className="container-narrow">
        <div className="ascent-intro">
          <span className="text-sm uppercase tracking-widest text-current/50">The Ascent</span>
          <h2 className="heading-2 mt-2 text-current">
            Not years — <span className="text-current/60">responsibility earned</span>
          </h2>
          <p className="body-large max-w-2xl mt-3 text-current/55">
            Every chapter changed what I could be trusted with next. Scroll to watch
            the line climb — tap a chapter to see the evidence behind it.
          </p>
        </div>

        <div ref={trackRef} className="relative mt-14 space-y-14 md:space-y-16">
          <AscentPath
            containerRef={trackRef}
            markerRefs={markerRefs}
            order={order}
            accent={ACCENT}
            reduced={reduced}
          />

          {chronological.map((exp, i) => (
            <ExperienceNode
              key={exp.id}
              exp={exp}
              index={i}
              total={chronological.length}
              next={chronological[i + 1] ?? null}
              accent={ACCENT}
              reduced={reduced}
              markerRef={(el) => {
                if (el) markerRefs.current.set(exp.id, el);
                else markerRefs.current.delete(exp.id);
              }}
            />
          ))}

          <div className="relative flex gap-4 md:gap-6" style={{ marginLeft: "clamp(0px, 64px, 15vw)" }}>
            <div className="flex-shrink-0 pt-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACCENT }} />
            </div>
            <p className="text-sm text-current/45 pt-0.5">
              Still climbing — the next chapter is whatever gets built next.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
