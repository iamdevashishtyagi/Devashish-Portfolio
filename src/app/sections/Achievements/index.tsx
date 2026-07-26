"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { achievements, principles } from "@/src/app/data/profile";
import { Compass } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const RING_BASE_RADIUS = 18;
const RING_STEP = 16;

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const storyStageRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeAchievement = achievements[activeIndex];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (storyStageRef.current) {
        const transitions = Math.max(achievements.length, 1);
        ScrollTrigger.create({
          trigger: storyStageRef.current,
          start: "top 5%",
          end: () => `+=${transitions * 100}%`,
          pin: true,
          scrub: reduced ? false : 0.7,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(achievements.length - 1, Math.floor(self.progress * achievements.length));
            setActiveIndex((current) => (current === next ? current : next));
          },
        });
      }

      gsap.from(".principle-item", {
        autoAlpha: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: ".principles-grid", start: "top 85%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!storyRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".achievement-story-piece",
        { autoAlpha: 0, y: 24, rotateX: -8 },
        { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.65, stagger: 0.07, ease: "power3.out" }
      );
    }, storyRef);
    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <section ref={sectionRef} id="achievements" className="section-layout">
      <div className="achievements-atmosphere" aria-hidden="true" />
      <div className="relative container-narrow">
        {/* Pin the heading and story as one unit, starting when this heading reaches the viewport top. */}
        <div ref={storyStageRef} className="achievement-stage flex flex-col">
          <div className="shrink-0">
            <span className="text-sm uppercase tracking-widest text-current/50">The pattern behind the work</span>
            <h2 className="heading-2 mt-1 text-current">
              EVERY YES WIDENED THE APERTURE
            </h2>
            <p className="mt-3 max-w-lg text-current/50">
              I don&apos;t measure growth in finished tickets. I measure it in how much I was willing to stand in front of before I felt ready for it.
            </p>
          </div>

          <div className="grid shrink-0 items-start gap-6 pt-5 lg:grid-cols-[280px_1fr] lg:gap-10 lg:pt-6">
            <div className="achievement-intro lg:self-center lg:translate-y-8">
              <div>
                <ApertureDial activeIndex={activeIndex} total={achievements.length} />
                <div className="max-w-[200px]">
                  <span className="achievement-label block text-xs uppercase tracking-widest opacity-50">Scope, at the time</span>
                  <p className="achievement-heading mt-2 text-sm font-medium leading-snug">{activeAchievement.scope}</p>
                </div>
              </div>
            </div>

            <div ref={storyRef} className="achievement-story relative min-h-[300px] overflow-hidden rounded-3xl border border-current/15 bg-current/[0.03] p-6 md:min-h-[380px] md:p-10 lg:translate-y-8">
              <article key={activeAchievement.title} className="h-full [perspective:900px]">
                <div className="achievement-story-piece flex items-center justify-between gap-4">
                  <span className="achievement-label font-mono text-sm uppercase tracking-[0.2em]">{activeAchievement.year}</span>
                  <span className="rounded-full border border-current/20 px-3 py-1 text-xs opacity-70">{activeAchievement.tag}</span>
                </div>
                <div className="achievement-story-piece mt-8 h-px w-20 bg-current/30" />
                <h3 className="achievement-story-piece mt-6 max-w-2xl text-2xl font-medium tracking-tight md:text-4xl">{activeAchievement.title}</h3>
                <p className="achievement-story-piece mt-6 max-w-2xl text-base leading-relaxed opacity-75 md:text-lg">{activeAchievement.description}</p>
              </article>
            </div>
          </div>
        </div>

        {/* Principles Section - Reduced top margin */}
        <div className="mt-12 md:mt-16">
          <div className="mb-6 flex items-center gap-3">
            <Compass className="h-5 w-5 opacity-50" />
            <h3 className="achievement-heading text-xl font-medium">The constants, whatever the problem</h3>
          </div>
          <div className="principles-grid grid grid-cols-1 gap-px overflow-hidden rounded-2xl border md:grid-cols-2">
            {principles.map((principle, index) => (
              <article key={principle.title} className="principle-item achievement-card p-5 md:p-6">
                <span className="achievement-label font-mono text-xs opacity-40">{String(index + 1).padStart(2, "0")}</span>
                <h4 className="achievement-heading mt-2 text-lg font-medium">{principle.title}</h4>
                <p className="mt-2 text-sm leading-relaxed opacity-65">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ApertureDial({ activeIndex, total }: { activeIndex: number; total: number }) {
  const size = RING_BASE_RADIUS * 2 + (total - 1) * RING_STEP * 2 + 8;
  const center = size / 2;

  // Define a color palette for each ring
  const colorPalette = [
    'rgba(59, 130, 246, 0.9)',   // Blue - Ring 0
    'rgba(139, 92, 246, 0.9)',   // Violet - Ring 1
    'rgba(236, 72, 153, 0.9)',   // Pink - Ring 2
    'rgba(245, 158, 11, 0.9)',   // Amber - Ring 3
    'rgba(16, 185, 129, 0.9)',   // Emerald - Ring 4
    'rgba(239, 68, 68, 0.9)',    // Red - Ring 5
    'rgba(99, 102, 241, 0.9)',   // Indigo - Ring 6
    'rgba(168, 85, 247, 0.9)',   // Purple - Ring 7
    'rgba(236, 72, 153, 0.9)',   // Pink - Ring 8
    'rgba(14, 165, 233, 0.9)',   // Sky - Ring 9
  ];

  // Fallback colors if more rings than palette
  const getColor = (index: number) => {
    if (index < colorPalette.length) {
      return colorPalette[index];
    }
    // Generate a random color for rings beyond the palette
    const hue = (index * 137.508) % 360; // Golden ratio for distribution
    return `hsl(${hue}, 80%, 60%)`;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="achievement-icon" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => {
        const opened = index <= activeIndex;
        const color = getColor(index);
        const opacity = opened ? (index === activeIndex ? 0.9 : 0.5) : 0.15;
        
        return (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={RING_BASE_RADIUS + index * RING_STEP}
            fill="none"
            stroke={color}
            strokeWidth={index === activeIndex ? 2.5 : 1.5}
            strokeDasharray={opened ? undefined : "3 5"}
            style={{ 
              opacity, 
              transition: "opacity 0.5s ease, stroke-width 0.5s ease, stroke 0.3s ease",
              filter: index === activeIndex ? `drop-shadow(0 0 8px ${color})` : 'none',
            }}
          />
        );
      })}
      <circle 
        cx={center} 
        cy={center} 
        r={3} 
        fill="currentColor" 
        opacity={0.7} 
      />
    </svg>
  );
}
