"use client";

import { useState } from "react";
import { Project } from "@/src/app/data/profile";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const accentColors = {
    blue: "bg-blue-50 border-blue-200",
    violet: "bg-violet-50 border-violet-200",
    amber: "bg-amber-50 border-amber-200",
  };

  return (
    <div
      className={`transform transition-all duration-500 ease-out ${
        isHovered
          ? "scale-105 -translate-y-4 shadow-2xl z-10"
          : "scale-100 hover:z-0"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 transition-all duration-500 ${
          isHovered
            ? `${accentColors[project.accent]} border-opacity-100`
            : "bg-white border-gray-200"
        }`}
      >
        {/* Accent line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              project.accent === "blue"
                ? "#3B82F6"
                : project.accent === "violet"
                ? "#8B5CF6"
                : "#F59E0B",
          }}
        />

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400">
              {project.category}
            </span>
            <h3 className="text-xl font-medium mt-1">{project.title}</h3>
          </div>
          <div className="flex gap-2">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-3">{project.oneLiner}</p>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 transition-all duration-500 overflow-hidden ${
            isHovered ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Problem
            </p>
            <p className="text-sm text-gray-600 mt-1">{project.problem}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Solution
            </p>
            <p className="text-sm text-gray-600 mt-1">{project.solution}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-50 text-xs rounded-full text-gray-600 border border-gray-100"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="px-3 py-1 text-xs rounded-full text-gray-400">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        {isHovered && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-lg font-medium">{metric.value}</p>
                <p className="text-xs text-gray-400">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}