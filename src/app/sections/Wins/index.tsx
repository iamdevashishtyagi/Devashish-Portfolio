"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { engineeringWins } from "@/src/app/data/profile";
import { CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Wins() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const stack = stackRef.current;

    if (!stage || !stack) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".win-card");
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
          trigger: stage,
          start: "top 2%",
          end: () => `+=${cards.length * window.innerHeight * 0.55}`,
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

      timeline.to(lastCard, {
        rotateX: isMobile ? 90 : 110,
        yPercent: isMobile ? -180 : -230,
        duration: 1,
        ease: "power2.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cardThemes = [
    { base: "#2a5ecf", accent: "#2a5ecf" },
    { base: "#c82222", accent: "#c82222" },
    { base: "#bc7c21", accent: "#bc7c21" },
    { base: "#ceb121", accent: "#ceb121" },
    { base: "#e51d1d", accent: "#e51d1d" },
    { base: "#c71f1f", accent: "#c71f1f" },
  ];

  return (
    <section
      ref={sectionRef}
      id="wins"
      className="relative isolate overflow-hidden section-layout"
    >
      <div className="hero-geometry wins-geometry" aria-hidden="true" />
      <div className="relative z-10 container-narrow">
        <div ref={stageRef} className="wins-stage flex flex-col">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          Wins
        </span>

        <h2 className="heading-2 mt-1 mb-1">ENGINEERING WINS</h2>

        <p className="body-large mb-12 max-w-2xl">
          Real problems, real fixes — the how, not just the what.
        </p>

        <div
          ref={stackRef}
          className="relative h-[52vh] min-h-[380px] md:min-h-[540px]"
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
        </div>
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
        background: theme.base, // Solid color, no gradient
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="relative z-10 flex h-full max-w-4xl flex-col justify-start gap-4 md:justify-between md:gap-0">
        {/* TOP SECTION - Reduced gaps on mobile */}
        <div>
          <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold uppercase tracking-widest">
            {win.tag}
          </span>

          <h3 className="mt-2 md:mt-6 max-w-3xl text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight">
            {win.title}
          </h3>

          <p className="mt-1.5 md:mt-6 max-w-3xl text-sm sm:text-sm md:text-base lg:text-lg leading-relaxed text-white/80">
            {win.problem}
          </p>
        </div>

        {/* BOTTOM SECTION - Reduced gaps on mobile */}
        <div className="border-t border-white/25 pt-2 md:pt-6">
          <div className="flex items-start gap-1.5 md:gap-3">
            <CheckCircle2 className="mt-0.5 md:mt-1 h-3.5 w-3.5 md:h-5 md:w-5 flex-shrink-0" />

            <p className="text-[12px] sm:text-xs md:text-sm lg:text-base leading-relaxed text-white/90">
              {win.solution}
            </p>
          </div>

          <p className="mt-1.5 md:mt-5 text-[12px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-white/90">
            Impact — {win.impact}
          </p>
        </div>
      </div>
    </div>
  );
}
