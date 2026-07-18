"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollBackground() {
  // Background color transitions between sections
  const sections = [
    { id: "#about", bg: "#FFFFFF", textColor: "#1A1A1A" },
    { id: "#experience", bg: "#FFFFFF", textColor: "#1A1A1A" },
    { id: "#projects", bg: "#FBF9EF", textColor: "#1A1A1A" },
    { id: "#wins", bg: "#FFFFFF", textColor: "#1A1A1A" },
    { id: "#skills", bg: "#FBF9EF", textColor: "#1A1A1A" },
    { id: "#architecture", bg: "#000000", textColor: "#FBF9EF" },
    { id: "#achievements", bg: "#FFFFFF", textColor: "#1A1A1A" },
    { id: "#contact", bg: "#000000", textColor: "#FBF9EF" },
  ];

  sections.forEach((section) => {
    const el = document.querySelector(section.id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        document.body.style.backgroundColor = section.bg;
        document.body.style.color = section.textColor;
      },
      onEnterBack: () => {
        document.body.style.backgroundColor = section.bg;
        document.body.style.color = section.textColor;
      },
    });
  });
}