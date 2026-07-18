"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutParagraphs } from "@/src/app/data/profile";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-text", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding border-t border-gray-100"
    >
      <div className="container-narrow">
        <div className="max-w-4xl">
          <span className="text-sm uppercase tracking-widest text-gray-400">
            About
          </span>
          <h2 className="heading-2 mt-4 mb-12">The short version</h2>

          <div className="space-y-6">
            {aboutParagraphs.map((paragraph, i) => (
              <p key={i} className="body-large about-text">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-6 about-text">
            <div>
              <span className="text-sm uppercase tracking-widest text-gray-400">
                Location
              </span>
              <p className="text-lg font-medium">India</p>
            </div>
            <div>
              <span className="text-sm uppercase tracking-widest text-gray-400">
                Experience
              </span>
              <p className="text-lg font-medium">1.5+ Years</p>
            </div>
            <div>
              <span className="text-sm uppercase tracking-widest text-gray-400">
                Available
              </span>
              <p className="text-lg font-medium">For freelance & full-time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}