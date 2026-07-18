"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillGroups, skillCategories, SkillCategory } from "@/src/app/data/profile";
import SkillMarquee from "./SkillMarquee";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("All");

  const filteredSkills =
    activeCategory === "All"
      ? skillGroups
      : skillGroups.filter((s) => s.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skill-card", {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const sizeClasses = {
    sm: "col-span-1",
    md: "col-span-1 md:col-span-2",
    lg: "col-span-1 md:col-span-3",
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section-padding bg-cream border-t border-gray-100"
    >
      <div className="container-narrow">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          Skills
        </span>
        <h2 className="heading-2 mt-4 mb-6">Tech stack & tools</h2>
        <p className="body-large max-w-2xl mb-8">
          What I actually use to ship products.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {skillCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? "bg-charcoal text-cream"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className={`skill-card ${sizeClasses[skill.size]} bg-white rounded-2xl p-6 border border-gray-200 hover:border-charcoal/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <h3 className="font-medium text-lg">{skill.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{skill.detail}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <SkillMarquee />
        </div>
      </div>
    </section>
  );
}