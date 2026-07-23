"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollBackground() {
  const sections = [
    { id: "#about", bg: "#FFFFFF", textColor: "#1A1A1A", theme: "light" },
    { id: "#experience", bg: "#FFFFFF", textColor: "#1A1A1A", theme: "light" },
    { id: "#projects", bg: "#FBF9EF", textColor: "#1A1A1A", theme: "light" },
    { id: "#wins", bg: "#FFFFFF", textColor: "#1A1A1A", theme: "light" },
    { id: "#skills", bg: "#FBF9EF", textColor: "#1A1A1A", theme: "light" },
    { id: "#architecture", bg: "#000000", textColor: "#ad9f90", theme: "dark" },
    { id: "#achievements", bg: "#FFFFFF", textColor: "#1A1A1A", theme: "light" },
    { id: "#contact", bg: "#000000", textColor: "#FBF9EF", theme: "dark" },
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
        document.body.dataset.theme = section.theme;
      },
      onEnterBack: () => {
        document.body.style.backgroundColor = section.bg;
        document.body.style.color = section.textColor;
        document.body.dataset.theme = section.theme;
      },
    });
  });
}