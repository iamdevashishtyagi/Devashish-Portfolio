"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { engineeringWins } from "@/src/app/data/profile";
import { CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Wins() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".win-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const tagColors = {
    Performance: "bg-blue-50 text-blue-700 border-blue-200",
    Security: "bg-red-50 text-red-700 border-red-200",
    Integration: "bg-green-50 text-green-700 border-green-200",
    "Business Logic": "bg-amber-50 text-amber-700 border-amber-200",
    Leadership: "bg-violet-50 text-violet-700 border-violet-200",
  };

  return (
    <section
      ref={sectionRef}
      id="wins"
      className="section-padding border-t border-gray-100"
    >
      <div className="container-narrow">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          Wins
        </span>
        <h2 className="heading-2 mt-4 mb-6">Engineering wins</h2>
        <p className="body-large max-w-2xl mb-12">
          Real problems, real fixes — the how, not just the what.
        </p>

        <div className="space-y-6">
          {engineeringWins.map((win) => (
            <div
              key={win.id}
              className="win-card bg-cream rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-charcoal/20 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        tagColors[win.tag]
                      }`}
                    >
                      {win.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium">{win.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{win.problem}</p>
                  <div className="mt-3 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{win.solution}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-charcoal">
                      Impact: {win.impact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}