"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Project } from "@/src/app/data/profile";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ProjectShowcaseProps {
  projects: Project[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export default function ProjectShowcase({
  projects,
  activeIndex,
  setActiveIndex,
}: ProjectShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const currentProject = projects[activeIndex];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Fade out current card with 3D rotation
      tl.to(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        rotateY: -15,
        duration: 0.4,
        ease: "power2.in",
      });

      // Fade in new card
      tl.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.1,
      });

      // Animate details with stagger
      if (detailsRef.current) {
        const children = detailsRef.current.children;
        tl.fromTo(
          children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    }, [activeIndex]);

    return () => ctx.revert();
  }, [activeIndex]);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % projects.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeIndex, projects.length, setActiveIndex]);

  // Get accent color
  const getAccentColor = (accent: string) => {
    const colors = {
      blue: "#3B82F6",
      violet: "#8B5CF6",
      amber: "#F59E0B",
    };
    return colors[accent as keyof typeof colors] || "#3B82F6";
  };

  const accentColor = getAccentColor(currentProject.accent);

  return (
    <div ref={containerRef} className="relative">
      {/* Progress dots */}
      <div className="absolute -top-8 right-0 flex gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? `w-8 bg-current`
                : `w-1.5 bg-current/30 hover:bg-current/60`
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Card with 3D effect */}
        <div
          ref={cardRef}
          className="relative group"
          style={{ perspective: "1000px" }}
        >
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-current/10 bg-current/5">
            {/* Gradient background based on accent */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, transparent 60%)`,
              }}
            />

            {/* Animated pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0tMTAgMGgtNHYtNGg0djR6bTEwLTEwaC00di00aDR2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-[length:60px_60px]" />
            </div>

            {/* Project number */}
            <div className="absolute top-6 right-6 text-6xl font-bold text-current/5">
              {String(activeIndex + 1).padStart(2, "0")}
            </div>

            {/* Tech stack floating tags */}
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
              {currentProject.stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs rounded-full bg-current/10 backdrop-blur-sm text-current/80 border border-current/10"
                >
                  {tech}
                </span>
              ))}
              {currentProject.stack.length > 3 && (
                <span className="px-3 py-1 text-xs rounded-full bg-current/10 backdrop-blur-sm text-current/50">
                  +{currentProject.stack.length - 3}
                </span>
              )}
            </div>

            {/* Category badge */}
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1 text-xs uppercase tracking-wider rounded-full bg-current/10 backdrop-blur-sm text-current/70 border border-current/10">
                {currentProject.category}
              </span>
            </div>

            {/* Year badge */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 text-xs rounded-full bg-current/5 backdrop-blur-sm text-current/50 border border-current/10">
                {currentProject.year}
              </span>
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-6 right-6 flex gap-2">
              {currentProject.links.github && (
                <a
                  href={currentProject.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-current/10 backdrop-blur-sm hover:bg-current/20 transition-all text-current/70 hover:text-current hover:scale-110"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {currentProject.links.demo && (
                <a
                  href={currentProject.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-current/10 backdrop-blur-sm hover:bg-current/20 transition-all text-current/70 hover:text-current hover:scale-110"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div ref={detailsRef} className="space-y-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-medium text-current leading-tight">
              {currentProject.title}
            </h3>
            <p className="text-current/60 text-lg mt-2">
              {currentProject.oneLiner}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-current/5 border border-current/10">
              <p className="text-xs uppercase tracking-wider text-current/40">
                Problem
              </p>
              <p className="text-current/80 text-sm mt-1 line-clamp-3">
                {currentProject.problem}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-current/5 border border-current/10">
              <p className="text-xs uppercase tracking-wider text-current/40">
                Solution
              </p>
              <p className="text-current/80 text-sm mt-1 line-clamp-3">
                {currentProject.solution}
              </p>
            </div>
          </div>

          {/* Features */}
          {currentProject.features && (
            <div className="flex flex-wrap gap-2">
              {currentProject.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 text-xs rounded-full border border-current/20 text-current/60"
                >
                  {feature}
                </span>
              ))}
              {currentProject.features.length > 3 && (
                <span className="px-3 py-1 text-xs rounded-full border border-current/20 text-current/40">
                  +{currentProject.features.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Metrics */}
          <div className="flex gap-8 pt-4 border-t border-current/10">
            {currentProject.metrics.map((metric) => (
              <div key={metric.label} className="group">
                <p className="text-2xl font-bold text-current flex items-center gap-1">
                  {metric.value}
                  <span className="text-xs text-current/30 group-hover:translate-x-1 transition-transform">
                    ↑
                  </span>
                </p>
                <p className="text-xs text-current/40">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Read more link */}
          {currentProject.links.caseStudy && (
            <a
              href={currentProject.links.caseStudy}
              className="inline-flex items-center gap-2 text-sm text-current/50 hover:text-current transition-colors"
            >
              Read case study →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}