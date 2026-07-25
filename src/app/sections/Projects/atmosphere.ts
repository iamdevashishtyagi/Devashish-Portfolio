// src/app/sections/Projects/atmosphere.ts
"use client";

import { useEffect, useState } from "react";
import { Project } from "@/src/app/data/profile";

/**
 * Every project "filter" gets a distinct atmosphere: a background rhythm,
 * a density, and a case-file classification word. This is the axis that
 * makes an ERP feel structured and an AI/RAG system feel layered, without
 * forking the layout into five unrelated designs.
 */
export type Atmosphere = {
  classification: string;
  rhythm: "systematic" | "precise" | "fluid" | "layered" | "editorial";
  pattern: "grid" | "ledger" | "pulse" | "network" | "editorial";
  description: string;
};

export const ATMOSPHERES: Record<Project["filter"], Atmosphere> = {
  enterprise: {
    classification: "SYSTEM OF RECORD",
    rhythm: "systematic",
    pattern: "grid",
    description: "Structured, dense, load-bearing.",
  },
  compliance: {
    classification: "REGULATED PIPELINE",
    rhythm: "precise",
    pattern: "ledger",
    description: "Precise, controlled, zero tolerance.",
  },
  saas: {
    classification: "OPERATIONAL PRODUCT",
    rhythm: "fluid",
    pattern: "pulse",
    description: "Fluid, live, front-desk fast.",
  },
  ai: {
    classification: "RETRIEVAL SYSTEM",
    rhythm: "layered",
    pattern: "network",
    description: "Layered, connected, grounded.",
  },
  marketing: {
    classification: "PUBLIC SURFACE",
    rhythm: "editorial",
    pattern: "editorial",
    description: "Editorial, visual, expressive.",
  },
};

export const ACCENT_HEX: Record<Project["accent"], string> = {
  blue: "#3B82F6",
  royalBlue: "#4F46E5",
  emerald: "#10B981",
  amber: "#F59E0B",
  violet: "#18014e",
  red: "#5b0202",
};

/** Respects the OS-level reduced-motion preference and updates live. */
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
