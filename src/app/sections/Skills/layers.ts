// src/app/sections/Skills/layers.ts
"use client";

import { useEffect, useState } from "react";
import { Project, SkillCategory } from "@/src/app/data/profile";

export type SkillGroup = {
  name: string;
  detail: string;
  tags: string[];
  category: Exclude<SkillCategory, "All">;
  size: "sm" | "md" | "lg";
};

/**
 * The four categories in the data are re-read as the four layers a request
 * actually passes through — interface, service, intelligence, foundation.
 * Same data, reframed as a system instead of a taxonomy.
 */
export type LayerKey = "interface" | "service" | "intelligence" | "foundation";

export const LAYERS: {
  key: LayerKey;
  label: string;
  eyebrow: string;
  description: string;
  accent: string;
}[] = [
  {
    key: "interface",
    label: "Interface",
    eyebrow: "01 — What people touch",
    description: "The surface a person actually sees, clicks, and trusts.",
    accent: "#3B82F6",
  },
  {
    key: "service",
    label: "Service",
    eyebrow: "02 — What connects it",
    description: "The layer that turns a click into a decision the system can act on.",
    accent: "#10B981",
  },
  {
    key: "intelligence",
    label: "Intelligence",
    eyebrow: "03 — What makes it smart",
    description: "Retrieval, embeddings, and reasoning grounded in real data.",
    accent: "#8B5CF6",
  },
  {
    key: "foundation",
    label: "Foundation",
    eyebrow: "04 — What keeps it running",
    description: "The tooling that lets any of the above ship without fear.",
    accent: "#F59E0B",
  },
];

export const CATEGORY_TO_LAYER: Record<Exclude<SkillCategory, "All">, LayerKey> = {
  Frontend: "interface",
  Backend: "service",
  "AI & Data": "intelligence",
  Tooling: "foundation",
};

export function layerOf(skill: SkillGroup) {
  return LAYERS.find((l) => l.key === CATEGORY_TO_LAYER[skill.category])!;
}

/** Lowercase, alnum-only word tokens of length >= 3 — the unit of comparison. */
function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3);
}

export function skillTokens(skill: SkillGroup): Set<string> {
  return new Set([...tokenize(skill.name), ...tokenize(skill.tags.join(" "))]);
}

/** Other capabilities that share real vocabulary with this one — the graph of instincts, not a manual list. */
export function relatedSkills(skill: SkillGroup, all: SkillGroup[], limit = 4) {
  const tokens = skillTokens(skill);
  return all
    .filter((s) => s.name !== skill.name)
    .map((s) => ({ skill: s, overlap: [...skillTokens(s)].filter((t) => tokens.has(t)).length }))
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((r) => r.skill);
}

/** Real systems this capability actually shipped in, derived from each project's stack list. */
export function relatedProjects(skill: SkillGroup, projects: Project[]) {
  const tokens = skillTokens(skill);
  return projects.filter((p) => p.stack.some((item) => tokenize(item).some((t) => tokens.has(t))));
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
