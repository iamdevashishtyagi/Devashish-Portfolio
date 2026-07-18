"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { architectureSteps } from "@/src/app/data/profile";
import { ArrowRight, Database, Search, Cpu, FileText, MessageSquare, Brain } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const icons = {
  question: MessageSquare,
  embedding: Database,
  search: Search,
  context: FileText,
  llm: Brain,
  answer: Cpu,
};

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".arch-step", {
        opacity: 0,
        x: -40,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="section-padding border-t border-gray-800"
    >
      <div className="container-narrow">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          Systems
        </span>
        <h2 className="heading-2 mt-4 mb-6">RAG pipeline architecture</h2>
        <p className="body-large max-w-2xl mb-12 text-current">
          How a question becomes a grounded answer — tenant-isolated, retrieval-first.
        </p>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-700 hidden md:block" />

          <div className="space-y-8">
            {architectureSteps.map((step, index) => {
              const Icon = icons[step.id as keyof typeof icons];
              return (
                <div
                  key={step.id}
                  className="arch-step flex items-start gap-6 relative"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 relative z-10">
                    <Icon className="w-5 h-5 text-gray-300" />
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <h3 className="text-lg font-medium">{step.label}</h3>
                      <span className="text-sm text-gray-400">{step.detail}</span>
                    </div>

                    {index < architectureSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-600 mt-2 hidden md:block" />
                    )}
                  </div>

                  <span className="text-xs text-gray-500 font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-sm text-gray-300">
            <span className="text-gray-400">Key design decisions:</span>{" "}
            Tenant-isolated vector indexes • Semantic chunking strategy • 
            Retrieval quality over model choice • Grounded, attributable answers
          </p>
        </div>
      </div>
    </section>
  );
}
