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

      gsap.set(cards, {
        transformOrigin: "center bottom",
        transformStyle: "preserve-3d",
      });

      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: cards.length - index,
          y: index * 14,
          scale: 1 - index * 0.02,
          width: "90%",
          left: "5%",
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: "top 80vh",
          end: () => `+=${transitions * 100}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,

          snap: {
            snapTo: 1 / transitions,
            duration: {
              min: 0.2,
              max: 0.45,
            },
            ease: "power2.inOut",
          },
        },
      });

      cards.slice(0, -1).forEach((card, index) => {
        const nextCard = cards[index + 1];

        timeline.to(
          card,
          {
            rotateX: 110,
            yPercent: -230,
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

      gsap.to(lastCard, {
        rotateX: 110,
        yPercent: -230,
        ease: "power2.inOut",

        scrollTrigger: {
          trigger: lastCardTrigger,

          // The trigger is reached by normal page scrolling
          // immediately after the pinned stack releases.
          start: "top bottom",

          // The last card flips while the next section is entering.
          end: "top top",

          scrub: 0.8,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cardThemes = [
    { base: "#111c33", accent: "#60a5fa", effect: "bubbles" },
    { base: "#35200f", accent: "#fbbf24", effect: "circuit" },
    { base: "#102b23", accent: "#5eead4", effect: "ripple" },
    { base: "#29143a", accent: "#d8b4fe", effect: "aurora" },
    { base: "#35131e", accent: "#fda4af", effect: "dots" },
    { base: "#2c2b10", accent: "#fde68a", effect: "rays" },
  ];
  return (
    <section
      ref={sectionRef}
      id="wins"
      className="relative isolate overflow-hidden section-layout border-t border-gray-100"
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
          className="relative h-[72vh] min-h-[540px]"
          style={{
            perspective: "1800px",
          }}
        >
          {engineeringWins.map((win, index) => (
            <WinCard
              key={win.id}
              win={win}
              index={index}
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
  index,
  theme,
}: {
  win: (typeof engineeringWins)[number];
  index: number;
  theme: { base: string; accent: string; effect: string };
}) {
  return (
    <div
      className="win-card absolute inset-0 overflow-hidden rounded-3xl p-7 text-white shadow-[0_25px_70px_rgb(0_0_0_/_0.2)] md:p-12"
      style={{
        background: `linear-gradient(145deg, ${theme.base}, #0a0a0a)`,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        ["--win-accent" as string]: theme.accent,
      }}
    >
      <WinAtmosphere effect={theme.effect} index={index} />
      <div className="relative z-10 flex h-full max-w-4xl flex-col justify-between">
                <div>
                  <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                    {win.tag}
                  </span>

                  <h3 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                    {win.title}
                  </h3>

                  <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
                    {win.problem}
                  </p>
                </div>

                <div className="border-t border-white/25 pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0" />

                    <p className="max-w-3xl text-sm leading-relaxed text-white/90 md:text-base">
                      {win.solution}
                    </p>
                  </div>

                  <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-white/90">
                    Impact — {win.impact}
                  </p>
                </div>
      </div>
    </div>
  );
}

function WinAtmosphere({ effect, index }: { effect: string; index: number }) {
  switch (effect) {
    case "bubbles":
      return <div className="win-effect win-effect-bubbles" aria-hidden="true"><i /><i /><i /><i /></div>;
    case "circuit":
      return <div className="win-effect win-effect-circuit" aria-hidden="true"><i /><i /></div>;
    case "ripple":
      return <div className="win-effect win-effect-ripple" aria-hidden="true"><i /><i /><i /></div>;
    case "aurora":
      return <div className="win-effect win-effect-aurora" aria-hidden="true"><i /><i /></div>;
    case "dots":
      return <div className="win-effect win-effect-dots" aria-hidden="true"><i /></div>;
    case "rays":
    default:
      return <div className="win-effect win-effect-rays" aria-hidden="true"><i style={{ animationDelay: `${index * -0.4}s` }} /></div>;
  }
}
