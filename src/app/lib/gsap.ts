"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const legacyBackgroundSectionIds = new Set([
  "about",
  "experience",
  "projects",
  "wins",
  "skills",
  "architecture",
  "achievements",
  "faq",
  "contact",
]);

export function initScrollBackground() {
  const lightTheme = { bg: "#FFFFFF", textColor: "#000000", theme: "light" };
  const architectureTheme = { bg: "#000000", textColor: "#FFFFFF", theme: "dark" };
  const contactTheme = { bg: "#000000", textColor: "#FFFFFF", theme: "dark" };
  const architectureHeading = document.querySelector<HTMLElement>(
    "[data-scroll-theme-trigger='architecture']"
  );
  const architecture = document.querySelector<HTMLElement>("#architecture");
  const contact = document.querySelector<HTMLElement>("#contact");
  let activeTheme = "";

  const applyTheme = (theme: typeof lightTheme) => {
    const themeKey = `${theme.theme}-${theme.textColor}`;
    if (activeTheme === themeKey) return;

    activeTheme = themeKey;
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.textColor;
    document.body.dataset.theme = theme.theme;
  };

  // Remove all older versions of this controller. Pinned sections change
  // document scroll positions, so theme changes must not use ScrollTrigger.
  ScrollTrigger.getAll().forEach((scrollTrigger) => {
    const trigger = scrollTrigger.vars.trigger;
    const id = scrollTrigger.vars.id;
    if (
      (typeof id === "string" && id.startsWith("scroll-background-")) ||
      (trigger instanceof HTMLElement &&
        legacyBackgroundSectionIds.has(trigger.id) &&
        scrollTrigger.vars.start === "top center" &&
        scrollTrigger.vars.end === "bottom center")
    ) {
      scrollTrigger.kill();
    }
  });

  const updateTheme = () => {
    const viewportMiddle = window.innerHeight / 2;
    const architectureIsActive =
      Boolean(architectureHeading && architecture) &&
      architectureHeading!.getBoundingClientRect().top <= viewportMiddle &&
      architecture!.getBoundingClientRect().bottom > 0;
    const contactBounds = contact?.getBoundingClientRect();
    const contactIsActive =
      Boolean(contactBounds) && contactBounds!.top < window.innerHeight && contactBounds!.bottom > 0;

    applyTheme(contactIsActive ? contactTheme : architectureIsActive ? architectureTheme : lightTheme);
  };

  let animationFrame: number | null = null;
  const requestThemeUpdate = () => {
    if (animationFrame !== null) return;
    animationFrame = requestAnimationFrame(() => {
      animationFrame = null;
      updateTheme();
    });
  };

  updateTheme();
  window.addEventListener("scroll", requestThemeUpdate, { passive: true });
  window.addEventListener("resize", requestThemeUpdate);

  return () => {
    window.removeEventListener("scroll", requestThemeUpdate);
    window.removeEventListener("resize", requestThemeUpdate);
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    applyTheme(lightTheme);
  };
}
