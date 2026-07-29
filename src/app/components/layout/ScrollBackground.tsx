"use client";

import { useEffect } from "react";
import { initScrollBackground } from "@/src/app/lib/gsap";

export default function ScrollBackground() {
  useEffect(() => {
    initScrollBackground();
  }, []);

  return null;
}
