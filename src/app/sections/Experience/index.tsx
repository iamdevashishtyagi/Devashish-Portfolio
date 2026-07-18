"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/src/app/data/profile";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".exp-card", {
        opacity: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.15,
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
      id="experience"
      className="section-padding bg-white border-t border-gray-100"
    >
      <div className="container-narrow">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          Experience
        </span>
        <h2 className="heading-2 mt-4 mb-12">Where I've shipped</h2>

        <div className="space-y-16">
          {experience.map((exp, index) => (
            <div key={exp.id} className="exp-card">
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                <div className="md:w-48 flex-shrink-0">
                  <span className="text-sm text-gray-400">{exp.period}</span>
                </div>

                <div className="flex-1">
                  <h3 className="heading-3">{exp.role}</h3>
                  <p className="text-lg font-medium text-gray-600 mt-1">
                    {exp.org}
                  </p>
                  <p className="body-base mt-3">{exp.summary}</p>

                  <ul className="mt-4 space-y-2">
                    {exp.details.map((detail, i) => (
                      <li key={i} className="body-small flex gap-3">
                        <span className="text-gray-300">→</span>
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
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