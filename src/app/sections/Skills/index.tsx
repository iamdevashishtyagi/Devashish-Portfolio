// src/app/sections/Skills/index.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillGroups, projects } from "@/src/app/data/profile";
import { LAYERS, CATEGORY_TO_LAYER, relatedSkills, relatedProjects, useReducedMotion, SkillGroup } from "./layers";
import SkillNode from "./SkillNode";
import SkillConnectors from "./SkillConnectors";
import SkillDetail from "./SkillDetail";
import SkillMarquee from "./SkillMarquee";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const activeSkill = useMemo(
    () => skillGroups.find((s) => s.name === activeId) ?? null,
    [activeId]
  );

  const related = useMemo(
    () => (activeSkill ? relatedSkills(activeSkill, skillGroups as SkillGroup[]) : []),
    [activeSkill]
  );
  const relatedIds = useMemo(() => related.map((s) => s.name), [related]);
  const shipped = useMemo(
    () => (activeSkill ? relatedProjects(activeSkill, projects) : []),
    [activeSkill]
  );

  const accent = activeSkill
    ? LAYERS.find((l) => l.key === CATEGORY_TO_LAYER[activeSkill.category])!.accent
    : "#94A3B8";

  const select = (name: string) => setActiveId((current) => (current === name ? null : name));

  // Section entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skills-band",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Detail dock crossfade on selection change
  useEffect(() => {
    if (reduced || !detailRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        detailRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, [activeId, reduced]);

  return (
    <section ref={sectionRef} id="skills" className="section-padding border-t border-current/10">
      <div className="container-narrow">
        <div className="skills-band mb-4">
          <span className="text-sm uppercase tracking-widest text-current/50">The Signal Path</span>
          <h2 className="heading-2 mt-2 text-current">
            How it actually <span className="text-current/60">gets built</span>
          </h2>
          <p className="body-large max-w-2xl mt-3 text-current/55">
            Not a list of technologies — the four layers a request moves through, and what I
            reach for at each one. Select anything to see what it's connected to.
          </p>
        </div>

        <div ref={graphRef} className="relative mt-10 space-y-8">
          <SkillConnectors
            containerRef={graphRef}
            nodeRefs={nodeRefs}
            activeId={activeId}
            relatedIds={relatedIds}
            accent={accent}
            enabled={isDesktop && !reduced && !!activeId}
          />

          {LAYERS.map((layer) => {
            const nodes = skillGroups.filter((s) => CATEGORY_TO_LAYER[s.category] === layer.key);
            return (
              <div key={layer.key} className="skills-band relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8">
                <div>
                  <p className="text-[11px] uppercase tracking-wider" style={{ color: layer.accent }}>
                    {layer.eyebrow}
                  </p>
                  <p className="text-current/40 text-xs mt-1 max-w-[180px] leading-relaxed hidden md:block">
                    {layer.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 content-start">
                  {nodes.map((skill) => {
                    const state: "idle" | "related" | "active" =
                      skill.name === activeId ? "active" : relatedIds.includes(skill.name) ? "related" : "idle";
                    return (
                      <SkillNode
                        key={skill.name}
                        skill={skill}
                        accent={layer.accent}
                        state={activeId ? state : "idle"}
                        registerRef={(el) => {
                          if (el) nodeRefs.current.set(skill.name, el);
                          else nodeRefs.current.delete(skill.name);
                        }}
                        onSelect={() => select(skill.name)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="skills-band mt-10">
          <SkillDetail
            ref={detailRef}
            skill={activeSkill}
            accent={accent}
            projects={shipped}
            related={related}
            onSelectRelated={select}
          />
        </div>
        <div className="mt-16">
          <SkillMarquee />
        </div>
      </div>
    </section>
  );
}
