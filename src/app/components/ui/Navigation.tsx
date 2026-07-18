"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/src/app/data/profile";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const hasScrolled = currentScrollY > 50;

      setIsScrolled(hasScrolled);
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (!hasScrolled) {
        setIsHidden(false);
      } else if (Math.abs(scrollDelta) > 2) {
        setIsHidden(scrollDelta > 0);
      }
      lastScrollY.current = currentScrollY;

      // Detect active section
      const sections = navLinks.map((link) => link.href.replace("#", ""));
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(`#${current}`);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } ${
        isScrolled
          ? "bg-cream/90 backdrop-blur-md border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            className="text-xl font-medium tracking-tight hover:opacity-70 transition"
          >
            DT
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`transition-colors hover:text-charcoal ${
                  activeSection === link.href
                    ? "text-charcoal font-medium"
                    : "text-gray-400"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="px-5 py-2 bg-charcoal text-cream rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Let's talk
          </a>
        </div>
      </div>
    </nav>
  );
}
