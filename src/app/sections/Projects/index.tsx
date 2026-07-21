"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/src/app/data/profile";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const filters = ["all", "enterprise", "ai", "saas", "compliance", "marketing"];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.filter === activeFilter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".project-grid > *", {
        autoAlpha: 0,
        y: 30,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(refreshId);
  }, [activeFilter]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-padding border-t border-gray-100"
    >
      <div className="container-narrow">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          Work
        </span>
        <h2 className="heading-2 mt-4 mb-6">THINGS I'VE BUILT</h2>

        <div className="flex flex-wrap gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-charcoal text-cream"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="project-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
