// src/app/sections/Skills/SkillDetail.tsx
"use client";

import { forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/src/app/data/profile";
import { SkillGroup } from "./layers";

interface SkillDetailProps {
  skill: SkillGroup | null;
  accent: string;
  projects: Project[];
  related: SkillGroup[];
  onSelectRelated: (name: string) => void;
}

const SkillDetail = forwardRef<HTMLDivElement, SkillDetailProps>(function SkillDetail(
  { skill, accent, projects, related, onSelectRelated },
  ref
) {
  if (!skill) {
    return (
      <div
        ref={ref}
        className="rounded-2xl border border-dashed border-current/15 p-6 text-current/40 text-sm"
      >
        Select a capability above — watch what it connects to.
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-current/10 p-6 md:p-7"
      style={{ background: `linear-gradient(135deg, ${accent}12, transparent 70%)` }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-xl font-medium text-current">{skill.name}</h3>
          <p className="text-current/65 mt-1.5 max-w-xl leading-relaxed">{skill.detail}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-[11px] rounded-full border border-current/10 text-current/50"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-current/10">
        <p className="text-[11px] uppercase tracking-wider text-current/35 mb-2">
          {projects.length ? "Shipped inside" : "Not yet tied to a shipped system"}
        </p>
        {projects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {projects.map((p) => (
              <a
                key={p.id}
                href="#projects"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors"
                style={{ borderColor: `${accent}40` }}
              >
                <span className="text-current/75 group-hover:text-current">{p.title}</span>
                <ArrowUpRight className="w-3 h-3 text-current/30 group-hover:text-current/60 transition-colors" />
              </a>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-4 pt-4 border-t border-current/10">
          <p className="text-[11px] uppercase tracking-wider text-current/35 mb-2">Also connects to</p>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <button
                key={r.name}
                onClick={() => onSelectRelated(r.name)}
                className="px-3 py-1.5 text-xs rounded-full border border-current/10 text-current/60 hover:text-current hover:border-current/30 transition-colors"
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default SkillDetail;
