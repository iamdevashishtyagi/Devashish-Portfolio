"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/src/app/data/profile";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Opening window effect
      gsap.fromTo(
        windowRef.current,
        {
          scale: 0.7,
          opacity: 0,
          borderRadius: "40px",
        },
        {
          scale: 1,
          opacity: 1,
          borderRadius: "0px",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );

      // Text reveal
      gsap.from(".hero-title", {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".hero-roles span", {
        opacity: 0,
        x: -20,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        ref={windowRef}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-20"
      >
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-widest text-gray-400 hero-title">
            {profile.location}
          </p>

          <h1 className="heading-1 hero-title">
            {profile.name}
          </h1>

          <div className="hero-roles flex flex-wrap gap-x-4 gap-y-2 text-2xl md:text-3xl lg:text-4xl font-light text-gray-500">
            {profile.taglineRoles.map((role, i) => (
              <span key={i} className="relative">
                {role}
                {i < profile.taglineRoles.length - 1 && (
                  <span className="mx-2 text-gray-300">/</span>
                )}
              </span>
            ))}
          </div>

          <p className="body-large max-w-2xl hero-title mt-8">
            {profile.experienceYears} years of shipping production systems —
            from ERP platforms to AI-powered products.
          </p>

          <div className="flex gap-4 pt-6 hero-title">
            <a
              href={profile.resumeUrl}
              className="px-8 py-3 bg-charcoal text-cream rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Resume
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-charcoal/20 rounded-full hover:border-charcoal transition-colors text-sm font-medium"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
