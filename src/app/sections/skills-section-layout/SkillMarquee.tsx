"use client";

import { skillMarquee } from "@/src/app/data/profile";

export default function SkillMarquee() {
  // Duplicate for seamless loop
  const skills = [...skillMarquee, ...skillMarquee];

  return (
    <div className="skill-marquee relative overflow-hidden">
      <div className="skill-marquee-track flex w-max animate-marquee whitespace-nowrap">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="skill-marquee-item cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
