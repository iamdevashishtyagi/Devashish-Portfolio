"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Project } from "@/src/app/data/profile";
import { ArrowUpRight, Sparkles, Zap, Rocket } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const accentColors = {
    blue: {
      bg: "from-blue-500/10 to-blue-600/5",
      border: "border-blue-400/30",
      glow: "shadow-blue-500/20",
      text: "text-blue-400",
    },
    violet: {
      bg: "from-violet-500/10 to-violet-600/5",
      border: "border-violet-400/30",
      glow: "shadow-violet-500/20",
      text: "text-violet-400",
    },
    amber: {
      bg: "from-amber-500/10 to-amber-600/5",
      border: "border-amber-400/30",
      glow: "shadow-amber-500/20",
      text: "text-amber-400",
    },
  };

  const accent = accentColors[project.accent];

  // 3D tilt effect on mouse move
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.6,
        ease: "power2.out",
        transformPerspective: 800,
      });

      // Dynamic glow follow
      if (glowRef.current) {
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;
        gsap.to(glowRef.current, {
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.15), transparent 70%)`,
          duration: 0.3,
          ease: "power1.out",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          background: "radial-gradient(circle at 50% 50%, transparent, transparent)",
          duration: 0.6,
        });
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Entrance animation
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 60,
        scale: 0.9,
        rotationX: 10,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl transition-all duration-500 ${
        isHovered ? "z-20" : "z-0"
      }`}
      style={{ transformStyle: "preserve-3d" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow overlay */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
        style={{ background: "radial-gradient(circle at 50% 50%, transparent, transparent)" }}
      />

      {/* Floating particles on hover */}
      {isHovered && (
        <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-30 animate-pulse-slow pointer-events-none">
          <div className={`w-full h-full bg-gradient-to-r ${accent.bg}`} />
        </div>
      )}

      <div
        className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 transition-all duration-500 backdrop-blur-sm ${
          isHovered
            ? `border-opacity-100 ${accent.border} shadow-2xl ${accent.glow}`
            : "border-current/10 bg-current/5"
        }`}
        style={{
          background: isHovered
            ? `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`
            : "rgba(255,255,255,0.03)",
        }}
      >
        {/* Animated border gradient */}
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-700 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `conic-gradient(from var(--angle, 0deg), ${project.accent === "blue" ? "#3B82F6" : project.accent === "violet" ? "#8B5CF6" : "#F59E0B"}, transparent 40%, transparent 60%, ${project.accent === "blue" ? "#3B82F6" : project.accent === "violet" ? "#8B5CF6" : "#F59E0B"})`,
            padding: "2px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Animated angle variable */}
        <style>{`
          @property --angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          .project-card-wrapper .rounded-2xl .rounded-2xl {
            animation: rotate-angle 4s linear infinite;
          }
          @keyframes rotate-angle {
            to { --angle: 360deg; }
          }
        `}</style>

        {/* Icon with floating animation */}
        <div
          ref={iconRef}
          className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center ${accent.bg} ${accent.border} border transition-all duration-500 ${
            isHovered ? `scale-110 ${accent.glow}` : "scale-100"
          }`}
        >
          {project.accent === "blue" && <Sparkles className={`w-6 h-6 ${accent.text}`} />}
          {project.accent === "violet" && <Zap className={`w-6 h-6 ${accent.text}`} />}
          {project.accent === "amber" && <Rocket className={`w-6 h-6 ${accent.text}`} />}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-current/50">
              {project.category}
            </span>
            <h3 className="text-xl font-medium text-current mt-1">{project.title}</h3>
          </div>
          <div className="flex gap-2">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-current/10 transition-colors text-current/60 hover:text-current"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-current/10 transition-colors text-current/60 hover:text-current"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-current/70 text-sm mt-3">{project.oneLiner}</p>

        {/* Expanded details with GSAP */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 transition-all duration-500 overflow-hidden ${
            isHovered ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-current/40">
              Problem
            </p>
            <p className="text-sm text-current/70 mt-1">{project.problem}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-current/40">
              Solution
            </p>
            <p className="text-sm text-current/70 mt-1">{project.solution}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs rounded-full border border-current/10 bg-current/5 text-current/70"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="px-3 py-1 text-xs rounded-full text-current/40">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        {/* Metrics with counter animation */}
        {isHovered && (
          <div className="mt-4 pt-4 border-t border-current/10 flex gap-6">
            {project.metrics.map((metric, idx) => (
              <div key={metric.label} className="group">
                <p className="text-lg font-medium text-current flex items-center gap-1">
                  {metric.value}
                  <span className="text-xs text-current/40 group-hover:translate-x-1 transition-transform">
                    ↑
                  </span>
                </p>
                <p className="text-xs text-current/40">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}