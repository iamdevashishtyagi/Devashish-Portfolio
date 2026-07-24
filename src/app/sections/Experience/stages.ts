// src/app/sections/Experience/stages.ts
"use client";

import { useEffect, useState } from "react";

/**
 * Generic, ascending vocabulary for "what kind of trust this chapter
 * represents" — mapped by relative position in the journey, not by
 * hardcoding anything about a specific company. Works whether the
 * journey has 3 chapters or 8.
 */
const STAGE_VOCABULARY = [
  { label: "Entry Point", note: "Learning to read a system before touching it." },
  { label: "First Ownership", note: "Shipping something real, independently." },
  { label: "Client Trust", note: "Turning ambiguity into deterministic decisions." },
  { label: "System Owner", note: "Trusted with production, and with people." },
];

export function stageOf(index: number, total: number) {
  const bucket = Math.min(
    STAGE_VOCABULARY.length - 1,
    Math.floor((index / Math.max(total - 1, 1)) * (STAGE_VOCABULARY.length - 1))
  );
  return STAGE_VOCABULARY[bucket];
}

/** 0 -> 1 growth factor used to scale visual weight and horizontal climb. */
export function growthOf(index: number, total: number) {
  return total <= 1 ? 1 : index / (total - 1);
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
