// src/app/sections/Skills/SkillNode.tsx
"use client";

import { SkillGroup } from "./layers";

interface SkillNodeProps {
  skill: SkillGroup;
  accent: string;
  state: "idle" | "related" | "active";
  registerRef: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
}

const SIZE_CLASSES: Record<SkillGroup["size"], string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5 font-medium",
};

export default function SkillNode({ skill, accent, state, registerRef, onSelect }: SkillNodeProps) {
  return (
    <button
      ref={registerRef}
      onClick={onSelect}
      aria-pressed={state === "active"}
      className={`relative rounded-full border transition-all duration-300 ${SIZE_CLASSES[skill.size]} ${
        state === "active"
          ? "text-white shadow-sm"
          : state === "related"
          ? "text-current border-current/30"
          : "text-current/55 border-current/12 hover:text-current/85 hover:border-current/30"
      }`}
      style={
        state === "active"
          ? { backgroundColor: accent, borderColor: accent }
          : state === "related"
          ? { borderColor: `${accent}66`, backgroundColor: `${accent}14` }
          : undefined
      }
    >
      {skill.name}
      {state === "active" && (
        <span
          className="absolute -inset-1 rounded-full -z-10 blur-md opacity-40"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
      )}
    </button>
  );
}
