"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutParagraphs } from "@/src/app/data/profile";
import HangingLetters from "@/src/app/components/physics/HangingLetters";

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

      gsap.from(".about-hanging-letters", {
        opacity: 0,
        y: 30,
        duration: 1.1,
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
      id="about"
      className="section-layout"
    >
      <div className="container-narrow">
        {/* Header */}
        <div className="about-text mb-8 md:mb-12">
          <span className="text-sm uppercase tracking-widest text-slate-400">
            About Devashish Tyagi
          </span>
          <h2 className="heading-2 mt-3">THE SHORT VERSION</h2>
        </div>

        {/* 2-Column Layout: Text on Left (7 cols), Hanging Letters on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start overflow-visible">
          {/* Left Column: Story & Info */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <div className="space-y-6">
              {aboutParagraphs.map((paragraph, i) => (
                <p key={i} className="body-large about-text">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-6 about-text pt-4">
              <div>
                <span className="text-sm uppercase tracking-widest text-slate-400">
                  Location
                </span>
                <p className="text-lg font-medium text-slate-800">India</p>
              </div>
              <div>
                <span className="text-sm uppercase tracking-widest text-slate-400">
                  Experience
                </span>
                <p className="text-lg font-medium text-slate-800">2+ Years</p>
              </div>
              <div>
                <span className="text-sm uppercase tracking-widest text-slate-400">
                  Available
                </span>
                <p className="text-lg font-medium text-slate-800">For freelance &amp; full-time</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hanging Letters Bar */}
          <div className="lg:col-span-5 xl:col-span-5 w-full flex flex-col items-center lg:sticky lg:top-28 about-hanging-letters overflow-visible">
            <HangingLetters />
          </div>
        </div>
      </div>
    </section>
  );
}
