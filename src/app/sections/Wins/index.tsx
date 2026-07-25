"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { engineeringWins } from "@/src/app/data/profile";
import { CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Wins() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const lastCardTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    const lastCardTrigger = lastCardTriggerRef.current;

    if (!stack || !lastCardTrigger) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".win-card");
      const transitions = Math.max(cards.length - 1, 1);

      // Check if mobile
      const isMobile = window.innerWidth < 768;
      const yOffset = isMobile ? 8 : 14;
      const scaleOffset = isMobile ? 0.01 : 0.02;

      gsap.set(cards, {
        transformOrigin: "center bottom",
        transformStyle: "preserve-3d",
      });

      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: cards.length - index,
          y: index * yOffset,
          scale: 1 - index * scaleOffset,
          width: isMobile ? "94%" : "90%",
          left: isMobile ? "3%" : "5%",
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: "top 80vh",
          end: () => `+=${transitions * 100}%`,
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
        },
      });

      cards.slice(0, -1).forEach((card, index) => {
        const nextCard = cards[index + 1];

        const rotateX = isMobile ? 90 : 110;
        const yPercent = isMobile ? -180 : -230;

        timeline.to(
          card,
          {
            rotateX: rotateX,
            yPercent: yPercent,
            duration: 1,
            ease: "power2.inOut",
          },
          index
        );

        timeline.to(
          nextCard,
          {
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.inOut",
          },
          index
        );
      });

      const lastCard = cards[cards.length - 1];

      const rotateX = isMobile ? 90 : 110;
      const yPercent = isMobile ? -180 : -230;

      gsap.to(lastCard, {
        rotateX: rotateX,
        yPercent: yPercent,
        ease: "power2.inOut",

        scrollTrigger: {
          trigger: lastCardTrigger,
          start: "top bottom",
          end: "top top",
          scrub: 0.8,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // const cardThemes = [
  //   { base: "#111c33", accent: "#60a5fa" },
  //   { base: "#35200f", accent: "#fbbf24" },
  //   { base: "#102b23", accent: "#5eead4" },
  //   { base: "#29143a", accent: "#d8b4fe" },
  //   { base: "#35131e", accent: "#fda4af" },
  //   { base: "#2c2b10", accent: "#fde68a" },
  // ];
const cardThemes = [
  { base: "#2a5ecf", accent: "#3B82F6" },
  { base: "#c82222", accent: "#F59E0B" },
  { base: "#ceb121", accent: "#F59E0B" },
  { base: "#c71f1f", accent: "#fda4af" },
  { base: "#e51d1d", accent: "#8B5CF6" },
  { base: "#9621c0", accent: "#8B5CF6" },
];

  return (
    <section
      ref={sectionRef}
      id="wins"
      className="relative isolate overflow-hidden section-layout"
    >
      <div className="hero-geometry wins-geometry" aria-hidden="true" />
      <div className="relative z-10 container-narrow">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          Wins
        </span>

        <h2 className="heading-2 mt-4 mb-6">ENGINEERING WINS</h2>

        <p className="body-large mb-12 max-w-2xl">
          Real problems, real fixes — the how, not just the what.
        </p>

        <div
          ref={stackRef}
          className="relative h-[72vh] min-h-[380px] md:min-h-[540px]"
          style={{
            perspective: "1800px",
          }}
        >
          {engineeringWins.map((win, index) => (
            <WinCard
              key={win.id}
              win={win}
              theme={cardThemes[index % cardThemes.length]}
            />
          ))}
        </div>
        <div
          ref={lastCardTriggerRef}
          className="pointer-events-none h-px"
        />
      </div>
    </section>
  );
}

function WinCard({
  win,
  theme,
}: {
  win: (typeof engineeringWins)[number];
  theme: { base: string; accent: string };
}) {
  return (
    <div
      className="win-card absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-7 lg:p-12 text-white shadow-[0_25px_70px_rgb(0_0_0_/_0.2)]"
      style={{
        background: `radial-gradient(circle at 82% 18%, ${theme.accent}2b, transparent 34%), linear-gradient(145deg, ${theme.base}, #0a0a0a)`,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="relative z-10 flex h-full max-w-4xl flex-col justify-between">
        <div>
          <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-widest">
            {win.tag}
          </span>

          <h3 className="mt-4 md:mt-6 max-w-3xl text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight">
            {win.title}
          </h3>

          <p className="mt-3 md:mt-6 max-w-3xl text-sm md:text-base lg:text-lg leading-relaxed text-white/80">
            {win.problem}
          </p>
        </div>

        <div className="border-t border-white/25 pt-4 md:pt-6">
          <div className="flex items-start gap-2 md:gap-3">
            <CheckCircle2 className="mt-1 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />

            <p className="max-w-3xl text-xs md:text-sm lg:text-base leading-relaxed text-white/90">
              {win.solution}
            </p>
          </div>

          <p className="mt-3 md:mt-5 text-xs md:text-sm font-semibold uppercase tracking-wider text-white/90">
            Impact — {win.impact}
          </p>
        </div>
      </div>
    </div>
  );
}