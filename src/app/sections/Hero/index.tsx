"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { profile } from "@/src/app/data/profile";
import PhysicsIcons from "@/src/app/components/physics/PhysicsIcons";
import { heroPhysicsIcons } from "@/src/app/data/physicsIcons";
import { ArrowUpRight, Download } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clean entrance animation for hero content
      gsap.from(".hero-title", {
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".hero-roles span", {
        opacity: 0,
        x: -15,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.35,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative isolate flex min-h-[92vh] lg:min-h-screen items-center justify-center overflow-hidden pt-20 pb-12"
    >
      {/* Interactive Motion / Physics Icons Playground */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <PhysicsIcons
          items={heroPhysicsIcons}
          gravity={0.88}
          bounce={0.72}
          showHint={false}
          bottomOffset={0}
        />
      </div>

      {/* Foreground Hero Content (Above physics layer, clicks pass through background to icons) */}
      <div
        ref={windowRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:px-12 lg:px-24 pointer-events-none"
      >
        <div ref={contentRef} className="space-y-6 max-w-3xl pointer-events-auto">
          {/* Location text - clean and clear, no border/shadow box */}
          <div className="hero-title flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{profile.location}</span>
          </div>

          {/* Main Title */}
          <h1 className="heading-1 hero-title text-slate-900 font-extrabold tracking-tight">
            {profile.name}
          </h1>

          {/* Roles */}
          <div className="hero-roles flex flex-wrap items-center gap-x-3 gap-y-2 text-xl md:text-2xl lg:text-3xl font-light text-slate-600">
            {profile.taglineRoles.map((role, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="font-normal text-slate-800">{role}</span>
                {i < profile.taglineRoles.length - 1 && (
                  <span className="mx-2.5 text-blue-500/40 font-bold">/</span>
                )}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="body-large text-slate-600 text-lg md:text-xl font-normal leading-relaxed hero-title pt-2 max-w-2xl">
            {profile.experienceYears} years of shipping production systems —
            from enterprise platforms to high-performance AI-powered products.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 hero-title">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all duration-200 text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-800 rounded-full hover:border-slate-900 hover:bg-white transition-all duration-200 text-sm font-semibold"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
