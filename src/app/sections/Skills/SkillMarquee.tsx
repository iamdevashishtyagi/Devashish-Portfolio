"use client";

import { skillMarquee } from "@/src/app/data/profile";

export default function SkillMarquee() {
  // Duplicate for seamless loop
  const skills = [...skillMarquee, ...skillMarquee];

  return (
    <div className="relative overflow-hidden py-4 border-y border-gray-200 bg-cream/50">
      <div className="flex animate-marquee whitespace-nowrap">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="mx-6 text-sm font-medium text-gray-600 hover:text-charcoal transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}