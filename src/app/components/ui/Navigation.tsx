"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navLinks } from "@/src/app/data/profile";

gsap.registerPlugin(ScrollTrigger);

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const lastScrollY = useRef(0);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const wordmarkSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const slot = wordmarkSlotRef.current;

    if (!wordmark || !slot) return;

    const ctx = gsap.context(() => {
      const initialStyles = window.getComputedStyle(wordmark);

      /*
      * Initial centered state.
      * This is also the exact starting state of the existing
      * scroll-driven animation.
      */
      gsap.set(wordmark, {
        left: "50%",
        top: "50%",
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        fontSize: initialStyles.fontSize,
        fontWeight: 900,
        letterSpacing: initialStyles.letterSpacing,

        // Start completely hidden
        clipPath: "inset(0 100% 0 0)",
      });

      /*
      * Create the original scroll-driven wordmark animation.
      * This remains the only animation responsible for:
      *
      * - position
      * - size
      * - font weight
      * - letter spacing
      */
      gsap.fromTo(
        wordmark,
        {
          left: "50%",
          top: "50%",
          x: 0,
          y: 0,
          xPercent: -50,
          yPercent: -50,
          fontSize: initialStyles.fontSize,
          fontWeight: 900,
          letterSpacing: initialStyles.letterSpacing,
        },
        {
          x: () => {
            const finalFontSize = 24;
            const initialFontSize = Number.parseFloat(initialStyles.fontSize);
            const initialWidth = wordmark.getBoundingClientRect().width;
            const finalWidth =
              initialWidth * (finalFontSize / initialFontSize);

            return (
              slot.getBoundingClientRect().left -
              window.innerWidth / 2 +
              finalWidth / 2
            );
          },

          y: () => {
            const rect = slot.getBoundingClientRect();

            return (
              rect.top +
              rect.height / 2 -
              window.innerHeight / 2
            );
          },

          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "-0.025em",

          ease: "none",

          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "+=420",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      /*
      * Intro sequence
      */
      const intro = gsap.timeline({
        onComplete: () => {
          /*
          * After the reveal, automatically scroll the page.
          *
          * This drives the existing ScrollTrigger animation,
          * instead of manually animating the wordmark again.
          */
          const scrollProxy = { value: window.scrollY };

          gsap.to(scrollProxy, {
            value: 420,
            duration: 1.8,
            ease: "power2.inOut",

            onUpdate: () => {
              window.scrollTo(0, scrollProxy.value);
            },
          });
        },
      });

      /*
      * Reveal DEVASHISH from left to right
      */
      intro.to(wordmark, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.6,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const hasScrolled = currentScrollY > 50;

      setIsScrolled(hasScrolled);
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Keep the bar present while the hero wordmark transitions into it.
      if (currentScrollY < 420) {
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
    <>
      <a
        ref={wordmarkRef}
        href="#"
        aria-label="Back to top"
        
        style={{
          left: "50%",
          top: "50%",
          fontSize: "clamp(3.25rem, 16vw, 16rem)",
          fontWeight: 900,
          fontFamily: "var(--font-medieval-sharp)",
          letterSpacing: "-0.09em",
        }}
        className={`fixed z-[60] -translate-x-1/2 -translate-y-1/2 font-sans uppercase leading-none text-charcoal will-change-transform transition-opacity duration-300 ${
          isHidden ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        DEVASHISH
      </a>

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
            <div ref={wordmarkSlotRef} className="h-8 w-36" aria-hidden="true" />

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
    </>
  );
}
