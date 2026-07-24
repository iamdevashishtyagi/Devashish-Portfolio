"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { architectureSteps } from "@/src/app/data/profile";
import { ArrowRight, Database, Search, Cpu, FileText, MessageSquare, Brain, Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const icons = {
  question: MessageSquare,
  chunk: Layers,
  embed: Database,
  search: Search,
  context: FileText,
  llm: Brain,
  answer: Cpu,
};

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepRefs.current.forEach((step, index) => {
        if (!step) return;

        const icon = step.querySelector(".step-icon") as HTMLElement;
        if (!icon) return;

        ScrollTrigger.create({
          trigger: step,
          start: "top 75%",
          end: "bottom 25%",
          onEnter: () => {
            icon.style.borderColor = "#00e5ff";
            icon.style.boxShadow = "0 0 30px #00e5ff, 0 0 80px #0077ff";
            const iconSvg = icon.querySelector("svg");
            if (iconSvg) {
              iconSvg.style.color = "#00e5ff";
            }
          },
          onLeave: () => {
            icon.style.borderColor = "";
            icon.style.boxShadow = "";
            const iconSvg = icon.querySelector("svg");
            if (iconSvg) {
              iconSvg.style.color = "";
            }
          },
          onEnterBack: () => {
            icon.style.borderColor = "#00e5ff";
            icon.style.boxShadow = "0 0 30px #00e5ff, 0 0 80px #0077ff";
            const iconSvg = icon.querySelector("svg");
            if (iconSvg) {
              iconSvg.style.color = "#00e5ff";
            }
          },
          onLeaveBack: () => {
            icon.style.borderColor = "";
            icon.style.boxShadow = "";
            const iconSvg = icon.querySelector("svg");
            if (iconSvg) {
              iconSvg.style.color = "";
            }
          },
        });
      });

      document.querySelectorAll(".step-detail").forEach((el) => {
        const detail = el as HTMLElement;
        detail.addEventListener("mouseenter", () => {
          gsap.to(detail, {
            rotationX: 6,
            rotationY: 6,
            scale: 1.02,
            color: "#00e5ff",
            duration: 0.3,
            ease: "power2.out",
          });
        });
        detail.addEventListener("mouseleave", () => {
          gsap.to(detail, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            color: "",
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      document.querySelectorAll(".step-label").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(el, {
            rotationX: 10,
            rotationY: 10,
            scale: 1.05,
            color: "#00e5ff",
            duration: 0.4,
            ease: "power2.out",
          });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            color: "",
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="section-layout"
    >
      <div className="container-narrow">
        {/* Make the section title adapt to background */}
        <span className="text-sm uppercase tracking-widest text-current opacity-70">
          Systems
        </span>
        <h2 className="heading-2 mt-4 mb-6 text-current">
          RAG PIPELINE ARCHITECTURE
        </h2>
        <p className="body-large max-w-2xl mb-12 text-current opacity-90">
          How a question becomes a grounded answer — tenant-isolated, retrieval-first.
        </p>

        <div className="relative">
          <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-700 hidden md:block" />

          <div className="space-y-8">
            {architectureSteps.map((step, index) => {
              const Icon = icons[step.id as keyof typeof icons];
              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className="arch-step flex items-start gap-6 relative"
                >
                  <div
                    className={`step-icon flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 relative z-10 transition-all duration-500`}
                  >
                    <Icon className="w-5 h-5 text-current transition-colors duration-500" />
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <h3
                        className="step-label text-lg font-bold tracking-tight text-current transition-colors duration-200 cursor-default"
                        style={{ perspective: "600px" }}
                      >
                        {step.label}
                      </h3>
                      <span
                        className="step-detail text-sm font-medium text-current opacity-80 transition-colors duration-200 cursor-default"
                        style={{ perspective: "400px" }}
                      >
                        {step.detail}
                      </span>
                    </div>

                    {index < architectureSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-current opacity-30 mt-2 hidden md:block" />
                    )}
                  </div>

                  <span className="text-xs font-mono text-current opacity-40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 p-6 bg-current/5 rounded-2xl border border-current/10">
          <p className="text-sm text-current opacity-80">
            <span className="font-semibold opacity-100">Key design decisions:</span>{" "}
            Tenant-isolated vector indexes • Semantic chunking with overlap •
            Retrieval quality over model choice • Grounded, attributable answers
          </p>
        </div>
      </div>
    </section>
  );
}
