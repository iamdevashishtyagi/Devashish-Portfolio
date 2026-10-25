// src/app/sections/Projects/atmosphere.ts
"use client";

import { useEffect, useState } from "react";
import { Project } from "@/src/app/data/profile";

/**
 * Project archive classifications displayed in the rail and showcase header.
 */
export const CLASSIFICATIONS: Record<Project["filter"], string> = {
  enterprise: "SYSTEM OF RECORD",
  compliance: "REGULATED PIPELINE",
  saas: "OPERATIONAL PRODUCT",
  ai: "RETRIEVAL SYSTEM",
  marketing: "PUBLIC SURFACE",
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
