"use client";

import { useEffect } from "react";
import { initScrollBackground } from "@/src/app/lib/gsap";

export default function ScrollBackground() {
  useEffect(() => {
    // Re-run this effect after Fast Refresh so any stale global triggers are
    // removed before the two current theme triggers are registered.
    return initScrollBackground();
  }, []);

  return null;
}
