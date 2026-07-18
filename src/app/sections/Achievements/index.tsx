"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { achievements, principles, journeyStops } from "@/src/app/data/profile";
import { Award, Zap, TrendingUp, Users, Code, Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const icons = {
  "Projects Delivered": Briefcase,
  "Production Systems": Zap,
  "Happy Clients": Users,
  Technologies: Code,
  "Years Experience": TrendingUp,
  "Lines of Code": Award,
};

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleJourney, setVisibleJourney] = useState<string[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Count up animation for numbers
      gsap.from(".stat-number", {
        textContent: 0,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".principle-item", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".principles-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Track journey stops as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setVisibleJourney((prev) => {
              if (!prev.includes(id)) return [...prev, id];
              return prev;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    journeyStops.forEach((stop) => {
      const el = document.getElementById(stop.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="section-padding bg-white border-t border-gray-100"
    >
      <div className="container-narrow">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          Achievements
        </span>
        <h2 className="heading-2 mt-4 mb-6">By the numbers</h2>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {achievements.map((stat) => {
            const Icon = icons[stat.label as keyof typeof icons];
            return (
              <div
                key={stat.label}
                className="text-center p-6 bg-cream rounded-2xl border border-gray-200"
              >
                <Icon className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <div className="stat-number text-3xl font-medium">
                  {stat.value}
                  {stat.suffix}
                </div>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Principles */}
        <div className="mb-16">
          <h3 className="text-xl font-medium mb-6">Working principles</h3>
          <div className="principles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {principles.map((principle) => (
              <div
                key={principle}
                className="principle-item p-4 bg-cream rounded-xl border border-gray-200 hover:border-charcoal/20 transition-all duration-300"
              >
                <p className="text-sm">“{principle}”</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Stops */}
        <div>
          <h3 className="text-xl font-medium mb-6">Your journey so far</h3>
          <div className="flex flex-wrap gap-3">
            {journeyStops.map((stop) => {
              const isUnlocked = visibleJourney.includes(stop.id);
              return (
                <div
                  key={stop.id}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-500 ${
                    isUnlocked
                      ? "bg-charcoal text-cream"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isUnlocked ? "🔓" : "🔒"} {stop.title}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Scroll through the page to unlock achievements.
          </p>
        </div>
      </div>
    </section>
  );
}